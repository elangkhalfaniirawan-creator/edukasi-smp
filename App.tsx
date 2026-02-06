
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import SubjectCard from './components/SubjectCard';
import Quiz from './components/Quiz';
import AITutor from './components/AITutor';
import WordGame from './components/WordGame';
import PuzzleGame from './components/PuzzleGame';
import { Subject } from './types';

const SUBJECTS = [
  {
    id: Subject.MATH,
    icon: '📐',
    color: 'bg-gradient-to-br from-blue-400 to-blue-600 text-white',
    description: 'Taklukkan angka dan rumus dengan cara yang paling seru!',
    difficulty: 3,
    isPopular: true
  },
  {
    id: Subject.SCIENCE,
    icon: '🔬',
    color: 'bg-gradient-to-br from-green-400 to-green-600 text-white',
    description: 'Jadilah ilmuwan muda dan temukan rahasia alam semesta.',
    difficulty: 2,
    isPopular: false
  },
  {
    id: Subject.ENGLISH,
    icon: '🇬🇧',
    color: 'bg-gradient-to-br from-pink-400 to-rose-600 text-white',
    description: 'Ngobrol bahasa Inggris jadi makin pede dan lancar.',
    difficulty: 1,
    isPopular: true
  },
  {
    id: Subject.HISTORY,
    icon: '🏺',
    color: 'bg-gradient-to-br from-yellow-400 to-orange-600 text-white',
    description: 'Jelajahi waktu dan pelajari kisah hebat pahlawan kita.',
    difficulty: 2,
    isPopular: false
  }
];

type Page = 'home' | 'quiz' | 'tutor' | 'wordgame' | 'puzzle';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentPage('quiz');
  };

  const handleWordGameStart = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentPage('wordgame');
  };

  const handlePuzzleStart = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentPage('puzzle');
  };

  const navigate = (page: Page) => {
    if ((page === 'quiz' || page === 'wordgame' || page === 'puzzle') && !selectedSubject) {
      setCurrentPage('home');
    } else {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-red-200 bg-[#fffbfc]">
      <Navbar onNavigate={(p: any) => navigate(p)} currentPage={currentPage} />

      <main className="max-w-7xl mx-auto px-4 pt-8">
        {currentPage === 'home' && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-red-600 via-rose-500 to-orange-500 rounded-[3.5rem] p-8 md:p-20 text-white mb-16 shadow-[0_40px_80px_-15px_rgba(239,68,68,0.3)] relative overflow-hidden">
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-xl px-5 py-2.5 rounded-2xl text-xs font-black mb-8 border border-white/20 tracking-widest uppercase">
                  <span className="animate-pulse inline-block w-2 h-2 bg-yellow-400 rounded-full"></span>
                  Update Baru: Puzzle Konsep Aktif!
                </div>
                <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[0.95] tracking-tighter">
                  Belajar <br/> <span className="text-yellow-300">Level Up!</span>
                </h1>
                <p className="text-xl text-red-50 mb-12 leading-relaxed font-bold max-w-xl">
                  Gunakan AI pintar untuk bantu PR-mu, main tebak kata, dan pecahkan puzzle untuk jadi juara kelas!
                </p>
                <div className="flex flex-wrap gap-6">
                  <button 
                    onClick={() => navigate('tutor')}
                    className="btn-playful bg-white text-red-600 px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-gray-50 shadow-2xl shadow-red-900/40"
                  >
                    Tanya AI Tutor 🤖
                  </button>
                  <button className="btn-playful bg-red-400/30 backdrop-blur-md border-2 border-white/40 text-white px-10 py-6 rounded-[2rem] font-black text-xl hover:bg-white/10">
                    Leaderboard 🏆
                  </button>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                <div className="text-[20rem] font-black leading-none">?</div>
              </div>
              <div className="absolute -bottom-10 -right-10 hidden lg:block select-none">
                 <img 
                   src="https://api.dicebear.com/7.x/notionists/svg?seed=Rocket&backgroundColor=ff4d4d"
                   alt="Rocket Character"
                   className="w-[32rem] h-[32rem] drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)] rotate-[-10deg]"
                />
              </div>
            </div>

            {/* Games Section */}
            <div className="mb-20">
               <div className="flex items-center gap-4 mb-10">
                 <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-red-100 to-red-500 rounded-full"></div>
                 <h2 className="text-3xl font-black text-gray-900 tracking-tighter whitespace-nowrap">
                   ZONA GAME SERU 🕹️
                 </h2>
                 <div className="h-1 flex-1 bg-gradient-to-l from-transparent via-red-100 to-red-500 rounded-full"></div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div 
                    onClick={() => handleWordGameStart(Subject.SCIENCE)}
                    className="group cursor-pointer bg-gradient-to-br from-red-600 to-rose-500 p-12 rounded-[3rem] text-white shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="absolute top-[-20%] right-[-10%] text-[12rem] opacity-10 group-hover:rotate-12 transition-transform duration-700">🔍</div>
                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center text-4xl mb-6 shadow-inner">🕵️‍♂️</div>
                      <h3 className="text-4xl font-black mb-4 tracking-tighter">Detektif Kata</h3>
                      <p className="text-red-50 font-bold text-lg mb-8 max-w-xs leading-relaxed">Tebak istilah rahasia berdasarkan petunjuk AI. Asah logikamu sekarang!</p>
                      <div className="inline-flex items-center gap-3 bg-white text-red-600 px-8 py-4 rounded-[1.5rem] font-black text-base shadow-xl group-hover:scale-110 transition-transform">
                        MAIN SEKARANG ⚡
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => handlePuzzleStart(Subject.HISTORY)}
                    className="group relative cursor-pointer p-12 rounded-[3rem] bg-gradient-to-br from-orange-500 to-yellow-400 text-white shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute top-[-10%] right-[-10%] text-[12rem] opacity-10 group-hover:rotate-12 transition-transform duration-700">🧩</div>
                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center text-4xl mb-6 shadow-inner">🧩</div>
                      <h3 className="text-4xl font-black mb-4 tracking-tighter">Puzzle Konsep</h3>
                      <p className="text-orange-50 font-bold text-lg mb-8 max-w-xs leading-relaxed">Susun potongan definisi konsep materi hingga menjadi kalimat utuh.</p>
                      <div className="inline-flex items-center gap-3 bg-white text-orange-600 px-8 py-4 rounded-[1.5rem] font-black text-base shadow-xl group-hover:scale-110 transition-transform">
                        MULAI PUZZLE 🧩
                      </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Subject Selection */}
            <div className="relative">
              <div className="absolute -top-40 -left-20 w-[40rem] h-[40rem] bg-red-50 rounded-full blur-[100px] -z-10 opacity-60"></div>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">PILIH MISIMU 🗺️</h2>
                  <p className="text-gray-500 font-bold text-xl">Selesaikan misi harian untuk kumpulkan koin!</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {SUBJECTS.map((s) => (
                  <SubjectCard 
                    key={s.id}
                    subject={s.id}
                    icon={s.icon}
                    color={s.color}
                    description={s.description}
                    onClick={handleSubjectClick}
                    difficulty={s.difficulty}
                    isPopular={s.isPopular}
                  />
                ))}
              </div>
            </div>

            {/* Stats Section */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { label: 'Siswa Aktif', value: '12K+', icon: '👥', color: 'text-blue-600' },
                 { label: 'Soal Terjawab', value: '500K+', icon: '✅', color: 'text-green-600' },
                 { label: 'Kategori Belajar', value: '45+', icon: '📚', color: 'text-red-600' }
               ].map((stat, i) => (
                 <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6">
                   <div className="text-4xl">{stat.icon}</div>
                   <div>
                     <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                     <div className="text-gray-400 font-bold uppercase text-xs tracking-widest">{stat.label}</div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {currentPage === 'quiz' && selectedSubject && (
          <div className="animate-in slide-in-from-bottom duration-500 max-w-3xl mx-auto">
             <Quiz subject={selectedSubject} onClose={() => navigate('home')} />
          </div>
        )}

        {currentPage === 'wordgame' && selectedSubject && (
          <div className="animate-in slide-in-from-bottom duration-500">
             <WordGame subject={selectedSubject} onClose={() => navigate('home')} />
          </div>
        )}

        {currentPage === 'puzzle' && selectedSubject && (
          <div className="animate-in slide-in-from-bottom duration-500">
             <PuzzleGame subject={selectedSubject} onClose={() => navigate('home')} />
          </div>
        )}

        {currentPage === 'tutor' && (
          <div className="animate-in slide-in-from-bottom duration-500">
            <AITutor />
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      {currentPage !== 'tutor' && (
        <button 
          onClick={() => navigate('tutor')}
          className="btn-playful fixed bottom-8 right-8 w-24 h-24 bg-red-600 text-white rounded-[2.5rem] shadow-[0_20px_40px_rgba(239,68,68,0.4)] flex items-center justify-center text-5xl z-40 border-[8px] border-white group"
        >
          <span className="group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">🤖</span>
          <div className="absolute -top-2 -right-2 w-7 h-7 bg-yellow-400 rounded-full border-4 border-white animate-bounce"></div>
        </button>
      )}
    </div>
  );
};

export default App;
