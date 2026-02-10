import React from 'react';

export const AnnouncementBar: React.FC = () => {
  const text = "Cursos del 20 de Febrero al 5 de Marzo en Ts Educacion, Lima Peru";
  
  return (
    <div className="fixed top-16 left-0 w-full z-40 bg-gold-500 overflow-hidden py-1.5 border-b border-gold-600 shadow-lg hw-accelerate">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center">
            <span className="text-dark-900 font-bold tracking-[0.15em] text-[10px] lg:text-[11px] mx-6 lg:mx-10 uppercase flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-dark-900 rounded-full opacity-40"></span>
              {text}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
          width: fit-content;
          will-change: transform;
        }
        @media (max-width: 640px) {
          .animate-marquee {
            animation: marquee 45s linear infinite;
          }
        }
      `}</style>
    </div>
  );
};
