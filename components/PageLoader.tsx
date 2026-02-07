import React from 'react';
import { Scissors } from 'lucide-react';

export const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-dark-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Logo animado */}
        <div className="relative">
          <div className="absolute inset-0 bg-gold-500/20 rounded-full animate-ping"></div>
          <div className="relative p-6 rounded-full bg-gold-500 animate-pulse">
            <Scissors className="w-12 h-12 text-dark-900" />
          </div>
        </div>
        
        {/* Texto */}
        <div className="text-center">
          <h2 className="font-serif font-bold text-2xl text-white mb-2">MARZETTI</h2>
          <div className="flex gap-1 justify-center">
            <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
