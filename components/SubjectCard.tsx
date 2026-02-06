
import React from 'react';
import { Subject } from '../types';

interface SubjectCardProps {
  subject: Subject;
  icon: string;
  color: string;
  description: string;
  onClick: (subject: Subject) => void;
  difficulty?: number; // 1 to 3
  isPopular?: boolean;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ 
  subject, 
  icon, 
  color, 
  description, 
  onClick,
  difficulty = 2,
  isPopular = false
}) => {
  return (
    <div 
      onClick={() => onClick(subject)}
      className="group relative cursor-pointer bg-white rounded-[2.5rem] p-1 flex flex-col transition-all duration-500 hover:-translate-y-3 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_rgba(239,68,68,0.2)] border-2 border-transparent hover:border-red-100 overflow-hidden"
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-6 right-[-35px] bg-red-600 text-white text-[10px] font-black py-1 px-10 rotate-45 shadow-lg z-20 uppercase tracking-widest">
          POPULER
        </div>
      )}

      <div className="p-7 flex-1">
        {/* Icon Container with dynamic gradient background */}
        <div className={`${color} w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl mb-8 group-hover:rotate-[15deg] transition-all duration-500 shadow-xl group-hover:shadow-red-200 relative`}>
          <span className="relative z-10 drop-shadow-lg">{icon}</span>
          <div className="absolute inset-0 bg-white/30 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <div className="flex items-center gap-2 mb-2">
           <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{subject}</h3>
        </div>

        <p className="text-gray-500 font-semibold text-sm leading-relaxed mb-6 h-12 overflow-hidden line-clamp-2">
          {description}
        </p>

        {/* Game-like Stats Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kesulitan</span>
            <div className="flex gap-1">
              {[1, 2, 3].map((star) => (
                <div 
                  key={star} 
                  className={`w-4 h-1.5 rounded-full transition-colors ${star <= difficulty ? 'bg-red-500' : 'bg-gray-100'}`}
                />
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hadiah</span>
             <span className="text-xs font-black text-amber-500 flex items-center gap-1">
               <span className="text-base">💎</span> 500 XP
             </span>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="bg-gray-50 group-hover:bg-red-600 p-4 transition-colors duration-300 flex items-center justify-center rounded-b-[2.4rem]">
        <span className="text-gray-900 group-hover:text-white font-black text-sm uppercase tracking-[0.2em] transition-colors">
          Mulai Misi ⚡
        </span>
      </div>
    </div>
  );
};

export default SubjectCard;
