
import React, { useState, useEffect } from 'react';
import { Subject, Question } from '../types';
import { generateQuiz } from '../services/geminiService';

interface QuizProps {
  subject: Subject;
  onClose: () => void;
}

const Quiz: React.FC<QuizProps> = ({ subject, onClose }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 menit total
  const [timeOut, setTimeOut] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await generateQuiz(subject);
        setQuestions(data);
      } catch (error) {
        console.error("Failed to fetch quiz", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [subject]);

  useEffect(() => {
    if (loading || finished || timeOut) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeOut(true);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, finished, timeOut]);

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    if (selectedOption === questions[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-[6px] border-red-100 border-t-red-600"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">⚡</div>
        </div>
        <p className="text-red-600 font-black text-xl animate-pulse text-center">Membangun Dunia Kuis...</p>
      </div>
    );
  }

  if (finished) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="bg-white rounded-[3rem] p-10 shadow-2xl max-w-md mx-auto text-center border-4 border-red-50 animate-in zoom-in-95 duration-300">
        <div className="text-8xl mb-6 animate-bounce inline-block">
          {timeOut ? '⏰' : percentage >= 80 ? '👑' : percentage >= 50 ? '🥈' : '💪'}
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-2">
          {timeOut ? 'Waktu Habis!' : 'Misi Selesai!'}
        </h2>
        <p className="text-gray-500 font-bold mb-8 italic">
          {timeOut ? 'Jangan menyerah, coba lagi dengan lebih cepat!' : 'Kamu hebat, teruskan belajarmu!'}
        </p>
        
        <div className="bg-red-50 rounded-[2rem] p-10 mb-8 border-2 border-red-100">
          <div className="text-xs text-red-400 font-black uppercase tracking-[0.2em] mb-2">Skor Akhir</div>
          <div className="text-7xl font-black text-red-600">{score}<span className="text-2xl text-red-300">/{questions.length}</span></div>
          <div className="mt-4 text-sm font-bold text-red-500">
             {timeOut ? '+0 XP' : `+${score * 100} XP Didapat!`}
          </div>
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="btn-playful w-full bg-red-600 text-white font-black py-5 rounded-[1.5rem] text-xl hover:bg-red-700 shadow-xl shadow-red-200"
        >
          Mulai Lagi 🔥
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Global Timer Bar */}
      <div className="mb-8 bg-gray-100 h-4 rounded-full overflow-hidden border-2 border-white shadow-inner">
        <div 
          className={`h-full transition-all duration-1000 ${timeLeft < 20 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}
          style={{ width: `${(timeLeft / 120) * 100}%` }}
        ></div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
            {currentIndex + 1}
          </div>
          <div>
             <h2 className="text-2xl font-black text-gray-900 tracking-tight">{subject}</h2>
             <p className="text-xs font-black text-gray-400 uppercase">Progres: {currentIndex + 1}/{questions.length}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl border-2 font-black text-xl transition-all ${timeLeft < 20 ? 'bg-red-50 border-red-200 text-red-600 animate-bounce' : 'bg-white border-gray-100 text-gray-700'}`}>
          <span className="text-2xl">⏳</span>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border-2 border-red-50 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <div className="text-9xl font-black">?</div>
        </div>
        
        <p className="text-2xl text-gray-800 font-bold mb-10 leading-snug relative z-10">
          {currentQ.question}
        </p>

        <div className="grid grid-cols-1 gap-4">
          {currentQ.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`btn-playful w-full text-left p-6 rounded-2xl border-4 transition-all duration-200 font-bold text-lg ${
                selectedOption === idx 
                  ? isAnswered 
                    ? idx === currentQ.correctAnswer 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-red-500 bg-red-50 text-red-700'
                    : 'border-red-500 bg-red-50 text-red-700'
                  : isAnswered && idx === currentQ.correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-50 bg-gray-50 hover:bg-white hover:border-red-200 text-gray-600 shadow-sm'
              }`}
            >
              <div className="flex items-center">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 font-black text-sm ${
                  selectedOption === idx ? 'bg-red-600 text-white' : 'bg-white border-2 border-gray-100 text-gray-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </div>
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className="mt-10 p-8 bg-amber-50 rounded-[2rem] border-2 border-amber-100 animate-in slide-in-from-top-4">
            <h4 className="font-black text-amber-700 mb-3 flex items-center text-lg">
              <span className="mr-3 text-2xl">💡</span>
              Wawasan Kilat
            </h4>
            <p className="text-amber-800 leading-relaxed font-medium">
              {currentQ.explanation}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end items-center mb-10">
        {!isAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className={`btn-playful px-12 py-5 rounded-[1.5rem] font-black text-xl transition-all shadow-xl ${
              selectedOption === null 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                : 'bg-red-600 text-white hover:bg-red-700 shadow-red-200'
            }`}
          >
            Kunci Jawaban 🔒
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn-playful px-12 py-5 rounded-[1.5rem] bg-red-600 text-white font-black text-xl hover:bg-red-700 shadow-xl shadow-red-200"
          >
            {currentIndex < questions.length - 1 ? 'Lanjut Misi ➡️' : 'Selesaikan Misi 🚩'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
