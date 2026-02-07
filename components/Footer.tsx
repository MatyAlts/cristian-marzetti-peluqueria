import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, MapPin, Phone, Clock } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-gold-500">MARZETTI</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Más de 10 años definiendo el estilo en Mendoza. Un espacio donde la tradición se encuentra con la vanguardia.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://www.instagram.com/cristian.marzetti/" target="_blank" rel="noopener noreferrer" className="p-2 bg-dark-800 rounded-full hover:bg-gold-500 hover:text-dark-900 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/cristian.marzetti.92" target="_blank" rel="noopener noreferrer" className="p-2 bg-dark-800 rounded-full hover:bg-gold-500 hover:text-dark-900 transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Explorar</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/" className="hover:text-gold-500 transition-colors">Inicio</Link></li>
              <li><Link to="/nosotros" className="hover:text-gold-500 transition-colors">Nosotros</Link></li>
              <li><Link to="/productos" className="hover:text-gold-500 transition-colors">Productos</Link></li>
              <li><Link to="/academia" className="hover:text-gold-500 transition-colors">Academia</Link></li>
              <li><Link to="/turnos" className="hover:text-gold-500 transition-colors">Reservar Turno</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contacto</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-1" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold-500 shrink-0" />
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gold-500 shrink-0" />
                <span>{CONTACT_INFO.hours}</span>
              </li>
            </ul>
          </div>

          {/* Map (Small placeholder) */}
          <div className="rounded-lg overflow-hidden h-40 bg-dark-800 relative group">
             <a 
               href={CONTACT_INFO.mapUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors"
             >
               <span className="opacity-0 group-hover:opacity-100 bg-gold-500 text-dark-900 px-4 py-2 rounded-full font-bold text-sm transition-opacity">
                 Abrir en Maps
               </span>
             </a>
             <iframe 
                src={CONTACT_INFO.mapEmbedUrl}
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen={false} 
                loading="lazy"
                title="Mini Map"
                className="pointer-events-none"
            ></iframe>
          </div>
        </div>

        <div className="border-t border-dark-700 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Peluquería Marzetti. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};