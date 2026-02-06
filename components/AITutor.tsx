
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getTutorResponse } from '../services/geminiService';

const AITutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: 'Halo sobat EduQuest! 👋 Aku Tutor AI-mu. Ada materi SMP yang bikin pusing? Tanyakan aja, kita bahas bareng biar jadi gampang!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await getTutorResponse(userMsg, messages.map(m => ({role: m.role, content: m.content})));
      setMessages(prev => [...prev, { role: 'model', content: response || "Maaf, pikiranku lagi loading. Coba tanya lagi ya!" }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: 'Ups! Sinyal belajarku lagi keganggu. Sabar ya, coba lagi!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-180px)] flex flex-col bg-white rounded-[3rem] shadow-2xl overflow-hidden border-4 border-red-50">
      <div className="bg-gradient-to-r from-red-600 to-rose-500 p-8 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner group">
            <span className="group-hover:animate-bounce">🤖</span>
          </div>
          <div>
            <h2 className="font-black text-2xl tracking-tight">Tutor EQ</h2>
            <div className="flex items-center text-xs font-bold text-red-100">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full mr-2 border-2 border-white/20"></span>
              Online & Siap Bantu PR-mu!
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] rounded-[2rem] p-6 shadow-sm font-medium leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-red-600 text-white rounded-br-none shadow-red-100' 
                : 'bg-white text-gray-800 rounded-bl-none border-2 border-red-50 shadow-sm'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-red-50 rounded-[1.5rem] p-6 flex gap-1.5 shadow-sm">
              <span className="w-2.5 h-2.5 bg-red-400 rounded-full animate-bounce"></span>
              <span className="w-2.5 h-2.5 bg-red-400 rounded-full animate-bounce delay-150"></span>
              <span className="w-2.5 h-2.5 bg-red-400 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t-2 border-red-50">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tulis PR atau topik yang sulit di sini..."
            className="flex-1 bg-gray-50 border-2 border-transparent focus:border-red-400 focus:bg-white rounded-2xl px-6 py-4 text-gray-700 outline-none transition-all font-bold"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="btn-playful bg-red-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-red-700 transition disabled:opacity-50 shadow-lg shadow-red-100"
          >
            Tanya 🚀
          </button>
        </div>
        <p className="text-[11px] text-gray-400 mt-4 text-center font-bold uppercase tracking-widest">
          Didukung oleh AI EduQuest yang Pintar & Ramah
        </p>
      </div>
    </div>
  );
};

export default AITutor;
