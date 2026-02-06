
import React, { useState, useEffect } from 'react';
import { Subject, PuzzleChallenge } from '../types';
import { generatePuzzleChallenge } from '../services/geminiService';

interface PuzzleGameProps {
  subject: Subject;
  onClose: () => void;
}

const PuzzleGame: React.FC<PuzzleGameProps> = ({ subject, onClose }) => {
  const [challenge, setChallenge] = useState<PuzzleChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentOrder, setCurrentOrder] = useState<string[]>([]);
  const [shuffledSegments, setShuffledSegments] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(90);
  const [status, setStatus] = useState<'playing' | 'finished'>('playing');

  useEffect(() => {
    fetchNewPuzzle();
  }, [subject]);

  useEffect(() => {
    if (loading || status !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus('finished');
          setIsCorrect(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, status]);

  const fetchNewPuzzle = async () => {
    setLoading(true);
    setIsCorrect(null);
    setCurrentOrder([]);
    setTimeLeft(90);
    setStatus('playing');
    try {
      const data = await generatePuzzleChallenge(subject);
      setChallenge(data);
      const shuffled = [...data.segments].sort(() => Math.random() - 0.5);
      setShuffledSegments(shuffled);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSegment = (word: string, fromShuffled: boolean) => {
    if (isCorrect === true || status !== 'playing') return;
    
    if (fromShuffled) {
      const idx = shuffledSegments.indexOf(word);
      if (idx > -1) {
        const newShuffled = [...shuffledSegments];
        newShuffled.splice(idx, 1);
        setShuffledSegments(newShuffled);
        setCurrentOrder([...currentOrder, word]);
      }
    } else {
      const idx = currentOrder.lastIndexOf(word);
      if (idx > -1) {
        const newOrder = [...currentOrder];
        newOrder.splice(idx, 1);
        setCurrentOrder(newOrder);
        setShuffledSegments([...shuffledSegments, word]);
      }
    }
    setIsCorrect(null);
  };

  const checkAnswer = () => {
    if (!challenge) return;
    const userSentence = currentOrder.join(' ').toLowerCase().replace(/[.,!]/g, '');
    const correctSentence = challenge.definition.toLowerCase().replace(/[.,!]/g, '');
    
    if (userSentence === correctSentence) {
      setIsCorrect(true);
      setStatus('finished');
    } else {
      setIsCorrect(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-6">
        <div className="animate-spin text-6xl">🧩</div>
        <p className="text-orange-600 font-black text-xl animate-pulse text-center">Menyusun potongan ilmu...</p>
      </div>
    );
  }

  if (!challenge) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8 flex items-center justify-between">
        <button onClick={onClose} className="text-orange-600 font-bold hover:underline flex items-center gap-2">
          <span>⬅️</span> Kembali ke Beranda
        </button>
        
        {/* Timer UI */}
        <div className={`px-6 py-2 rounded-2xl font-black text-xl border-2 flex items-center gap-2 transition-all ${timeLeft < 20 ? 'bg-red-100 border-red-300 text-red-600 animate-pulse' : 'bg-white border-gray-100 text-gray-700'}`}>
          <span className="text-2xl">⏳</span>
          {timeLeft}s
        </div>

        <div className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
          Mode: Puzzle Konsep
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl border-4 border-orange-50 relative overflow-hidden">
        {/* Progress Bar */}
        <div className={`absolute top-0 left-0 h-2 transition-all duration-1000 ${timeLeft < 20 ? 'bg-red-500 animate-pulse' : 'bg-orange-400'}`} style={{ width: `${(timeLeft / 90) * 100}%` }}></div>

        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">
            Konsep: <span className="text-orange-600 underline decoration-orange-200">{challenge.concept}</span>
          </h2>
          <p className="text-gray-500 font-bold text-lg">Susun kembali definisinya dengan benar!</p>
        </div>

        {/* Drop Area / Result Area */}
        <div className={`min-h-[120px] p-6 rounded-[2.5rem] mb-10 transition-all duration-300 border-4 flex flex-wrap items-center justify-center gap-3 ${
          isCorrect === true ? 'bg-green-50 border-green-200' : 
          isCorrect === false ? 'bg-red-50 border-red-200 animate-shake' : 
          'bg-gray-50 border-dashed border-gray-200'
        }`}>
          {currentOrder.length === 0 && timeLeft > 0 && <span className="text-gray-300 font-black italic">Klik potongan di bawah untuk menyusun...</span>}
          {currentOrder.map((word, i) => (
            <button
              key={i}
              onClick={() => toggleSegment(word, false)}
              className="btn-playful bg-white text-gray-800 px-5 py-3 rounded-2xl shadow-md border-2 border-gray-100 font-bold text-lg hover:border-red-300"
            >
              {word}
            </button>
          ))}
        </div>

        {/* Available segments */}
        {status === 'playing' && (
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {shuffledSegments.map((word, i) => (
              <button
                key={i}
                onClick={() => toggleSegment(word, true)}
                className="btn-playful bg-orange-500 text-white px-6 py-4 rounded-2xl shadow-lg shadow-orange-200 font-black text-lg hover:bg-orange-600 transform hover:scale-110 active:scale-95"
              >
                {word}
              </button>
            ))}
          </div>
        )}

        {status === 'finished' ? (
          <div className={`p-8 rounded-[2.5rem] border-2 animate-in slide-in-from-bottom-6 text-center ${isCorrect === true ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="text-6xl mb-4">{isCorrect === true ? '🏆' : '⏰'}</div>
            <h3 className={`text-3xl font-black mb-2 ${isCorrect === true ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect === true ? 'Sempurna!' : 'Waktu Habis!'}
            </h3>
            <p className={`font-medium text-xl mb-6 leading-relaxed ${isCorrect === true ? 'text-green-800' : 'text-red-800'}`}>
               "{challenge.definition}"
            </p>
            
            <div className="bg-white/60 p-6 rounded-2xl text-left mb-8 border border-white">
              <h4 className="font-black text-xs uppercase text-orange-600 mb-2 tracking-widest">Pendalaman Materi</h4>
              <p className="text-gray-700 font-bold leading-relaxed">{challenge.explanation}</p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={fetchNewPuzzle}
                className="flex-1 btn-playful bg-orange-600 text-white font-black py-5 rounded-[1.5rem] text-xl shadow-xl shadow-orange-200"
              >
                Coba Lagi 🚀
              </button>
              <button 
                onClick={onClose}
                className="flex-1 btn-playful bg-white border-2 border-orange-200 text-orange-600 font-black py-5 rounded-[1.5rem] text-xl"
              >
                Beranda
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center gap-4">
            <button
              disabled={currentOrder.length === 0}
              onClick={() => {
                setShuffledSegments([...shuffledSegments, ...currentOrder]);
                setCurrentOrder([]);
                setIsCorrect(null);
              }}
              className="px-8 py-4 rounded-2xl font-black text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30"
            >
              Ulangi 🔄
            </button>
            <button
              disabled={currentOrder.length < 2}
              onClick={checkAnswer}
              className="btn-playful bg-red-600 text-white px-12 py-4 rounded-2xl font-black text-xl shadow-xl shadow-red-200 disabled:opacity-50"
            >
              Cek Jawaban ✅
            </button>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default PuzzleGame;
