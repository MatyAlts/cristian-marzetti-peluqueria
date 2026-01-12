import React from 'react';
import { MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

export const FloatingWhatsApp: React.FC = () => {
  const message = encodeURIComponent("Hola, quisiera consultar por un turno en Peluquería Marzetti.");
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.phone.replace('+', '')}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:bg-[#1ebc57] transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#25D366]/50"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-8 h-8 text-white" />
    </a>
  );
};