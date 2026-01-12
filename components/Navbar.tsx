import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scissors } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { AnimatePresence, motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled ? 'bg-dark-900/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`p-2 rounded-full ${isScrolled ? 'bg-gold-500' : 'bg-gold-500/90'} transition-colors`}>
              <Scissors className="w-6 h-6 text-dark-900" />
            </div>
            <span className={`font-serif font-bold text-xl tracking-wide ${isScrolled ? 'text-white' : 'text-white drop-shadow-md'}`}>
              MARZETTI
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium tracking-wide hover:text-gold-500 transition-colors ${
                  location.pathname === item.path ? 'text-gold-500' : (isScrolled ? 'text-gray-200' : 'text-white drop-shadow-sm')
                }`}
              >
                {item.label.toUpperCase()}
              </Link>
            ))}
            <a 
              href="https://wa.me/5492612692207" 
              className="bg-gold-500 text-dark-900 px-5 py-2 rounded-full font-bold text-sm hover:bg-gold-400 transition-colors"
            >
              RESERVAR
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2 text-white focus:outline-none"
            aria-label="Abrir menú"
          >
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </nav>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-50 bg-dark-900 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <span className="font-serif font-bold text-xl text-gold-500 tracking-wide">MARZETTI</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-300 hover:text-white"
                aria-label="Cerrar menú"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-2xl font-medium ${
                    location.pathname === item.path ? 'text-gold-500' : 'text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="mt-8 border-t border-gray-800 pt-8">
                <a 
                  href="https://wa.me/5492612692207"
                  className="flex items-center justify-center w-full bg-gold-500 text-dark-900 font-bold py-4 rounded-lg text-lg mb-4"
                >
                  Agendar Turno Ahora
                </a>
                <p className="text-gray-400 text-center text-sm">
                  Santiago Araujo 637, Mendoza
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};