
import React, { useState, useEffect } from 'react';
import { Subject, WordChallenge } from '../types';
import { generateWordChallenge } from '../services/geminiService';

interface WordGameProps {
  subject: Subject;
  onClose: () => void;
}

const WordGame: React.FC<WordGameProps> = ({ subject, onClose }) => {
  const [challenge, setChallenge] = useState<WordChallenge | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [lives, setLives] = useState(5);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [timeLeft, setTimeLeft] = useState(60);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    fetchNewChallenge();
  }, [subject]);

  useEffect(() => {
    if (loading || status !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, status]);

  const fetchNewChallenge = async () => {
    setLoading(true);
    setGuessedLetters([]);
    setLives(5);
    setTimeLeft(60);
    setStatus('playing');
    try {
      const data = await generateWordChallenge(subject);
      setChallenge(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuess = (letter: string) => {
    if (status !== 'playing' || guessedLetters.includes(letter)) return;

    const newGuesses = [...guessedLetters, letter];
    setGuessedLetters(newGuesses);

    if (!challenge?.word.includes(letter)) {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) setStatus('lost');
    } else {
      const isWon = challenge.word.split('').every(l => newGuesses.includes(l));
      if (isWon) setStatus('won');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-6">
        <div className="animate-bounce text-6xl">🕵️‍♂️</div>
        <p className="text-red-600 font-black text-xl animate-pulse text-center">Detektif sedang mencari kata rahasia...</p>
      </div>
    );
  }

  if (!challenge) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-8 flex items-center justify-between">
        <button onClick={onClose} className="text-red-500 font-bold hover:underline flex items-center gap-2">
          <span>⬅️</span> Kembali
        </button>
        
        {/* Timer UI */}
        <div className={`px-6 py-2 rounded-2xl font-black text-xl border-2 flex items-center gap-2 transition-all ${timeLeft < 15 ? 'bg-red-100 border-red-300 text-red-600 animate-pulse' : 'bg-white border-gray-100 text-gray-700'}`}>
          <span className="text-2xl">⏳</span>
          {timeLeft}s
        </div>

        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-2xl transition-all ${i < lives ? 'grayscale-0' : 'grayscale opacity-30'}`}>
              ❤️
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-10 shadow-2xl border-4 border-red-50 text-center relative overflow-hidden">
        {/* Progress Bar for current game timer */}
        <div className={`absolute top-0 left-0 h-2 transition-all duration-1000 ${timeLeft < 15 ? 'bg-red-500 animate-pulse' : 'bg-red-400'}`} style={{ width: `${(timeLeft / 60) * 100}%` }}></div>

        <div className="mb-8">
          <span className="bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
            Detektif Kata: {subject}
          </span>
          <h2 className="text-xl font-bold text-gray-800 mt-4 leading-relaxed px-4">
             " {challenge.hint} "
          </h2>
        </div>

        {/* Word Blanks */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {challenge.word.split('').map((letter, idx) => (
            <div 
              key={idx} 
              className={`w-12 h-16 rounded-2xl border-b-8 flex items-center justify-center text-3xl font-black transition-all ${
                guessedLetters.includes(letter) || status !== 'playing'
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-gray-100 border-gray-200 text-transparent'
              }`}
            >
              {guessedLetters.includes(letter) || status !== 'playing' ? letter : '?'}
            </div>
          ))}
        </div>

        {status === 'playing' ? (
          <div className="grid grid-cols-7 sm:grid-cols-9 gap-2">
            {alphabet.map(letter => (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={guessedLetters.includes(letter)}
                className={`w-full aspect-square rounded-xl font-black text-sm transition-all btn-playful ${
                  guessedLetters.includes(letter)
                    ? challenge.word.includes(letter)
                      ? 'bg-green-100 text-green-600 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    : 'bg-white border-2 border-red-50 text-gray-700 hover:border-red-400 hover:text-red-600 shadow-sm'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        ) : (
          <div className={`p-8 rounded-[2rem] animate-in slide-in-from-bottom-6 ${status === 'won' ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
            <div className="text-6xl mb-4">{status === 'won' ? '🎉' : '💀'}</div>
            <h3 className={`text-4xl font-black mb-2 ${status === 'won' ? 'text-green-700' : 'text-red-700'}`}>
              {status === 'won' ? 'Misi Berhasil!' : timeLeft === 0 ? 'Waktu Habis!' : 'Misi Gagal!'}
            </h3>
            <p className="text-gray-600 font-bold mb-6 text-lg">
              Kata yang dicari: <span className="text-gray-900 underline decoration-red-200 uppercase">{challenge.word}</span>
            </p>
            
            <div className="bg-white/60 p-6 rounded-2xl text-left mb-8 border border-white">
              <h4 className="font-black text-xs uppercase text-gray-400 mb-2 tracking-widest">Wawasan Detektif</h4>
              <p className="text-gray-700 font-bold leading-relaxed">{challenge.explanation}</p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={fetchNewChallenge}
                className="flex-1 btn-playful bg-red-600 text-white font-black py-5 rounded-[1.5rem] text-xl shadow-xl shadow-red-200"
              >
                Mulai Ulang 🔄
              </button>
              <button 
                onClick={onClose}
                className="flex-1 btn-playful bg-white border-2 border-red-200 text-red-600 font-black py-5 rounded-[1.5rem] text-xl"
              >
                Ke Beranda
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordGame;
