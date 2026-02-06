
import React from 'react';

interface NavbarProps {
  onNavigate: (page: 'home' | 'quiz' | 'tutor') => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-red-50 px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate('home')}>
        <div className="bg-red-500 p-2 rounded-2xl text-white font-black text-xl shadow-lg shadow-red-200 group-hover:rotate-6 transition-transform">EQ</div>
        <span className="text-xl font-extrabold red-text-gradient tracking-tight">
          EduQuest SMP
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        <button 
          onClick={() => onNavigate('home')}
          className={`font-bold transition-all ${currentPage === 'home' ? 'text-red-600 scale-105' : 'text-gray-500 hover:text-red-400'}`}
        >
          Beranda
        </button>
        <button 
          onClick={() => onNavigate('quiz')}
          className={`font-bold transition-all ${currentPage === 'quiz' ? 'text-red-600 scale-105' : 'text-gray-500 hover:text-red-400'}`}
        >
          Latihan Kuis
        </button>
        <button 
          onClick={() => onNavigate('tutor')}
          className={`font-bold transition-all ${currentPage === 'tutor' ? 'text-red-600 scale-105' : 'text-gray-500 hover:text-red-400'}`}
        >
          Tanya Tutor
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-bold text-gray-800">Siswa Pintar ✨</span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full">LEVEL 12</span>
            <span className="text-xs font-medium text-gray-400">1,250 XP</span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-2xl border-2 border-red-100 p-0.5 shadow-sm">
          <img 
            src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix" 
            alt="Profile" 
            className="w-full h-full rounded-[0.8rem] bg-red-50"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
