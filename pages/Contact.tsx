import React from 'react';
import { CONTACT_INFO } from '../constants';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import { Button } from '../components/Button';

export const Contact: React.FC = () => {
  return (
    <div className="pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="font-serif text-3xl lg:text-5xl font-bold text-center mb-12">Contacto</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info & Form */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
               <h3 className="font-bold text-xl mb-6">Información</h3>
               <ul className="space-y-6">
                 <li className="flex gap-4 items-start">
                    <MapPin className="text-gold-500 shrink-0 w-6 h-6" />
                    <div>
                        <span className="font-bold block">Ubicación</span>
                        <span className="text-neutral-600">{CONTACT_INFO.address}</span>
                    </div>
                 </li>
                 <li className="flex gap-4 items-start">
                    <Phone className="text-gold-500 shrink-0 w-6 h-6" />
                    <div>
                        <span className="font-bold block">Teléfono / WhatsApp</span>
                        <a href={`https://wa.me/${CONTACT_INFO.phone.replace('+', '')}`} className="text-neutral-600 hover:text-gold-600 underline">{CONTACT_INFO.phone}</a>
                    </div>
                 </li>
                 <li className="flex gap-4 items-start">
                    <Clock className="text-gold-500 shrink-0 w-6 h-6" />
                    <div>
                        <span className="font-bold block">Horarios</span>
                        <span className="text-neutral-600">{CONTACT_INFO.hours}</span>
                    </div>
                 </li>
               </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100">
               <h3 className="font-bold text-xl mb-6">Envianos un mensaje</h3>
               <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                      <label className="block text-sm font-medium mb-1">Nombre</label>
                      <input type="text" className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none" placeholder="Tu nombre" />
                  </div>
                   <div>
                      <label className="block text-sm font-medium mb-1">Mensaje</label>
                      <textarea className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none h-32" placeholder="¿En qué podemos ayudarte?"></textarea>
                  </div>
                  <Button fullWidth>Enviar Mensaje</Button>
               </form>
            </div>
          </div>

          {/* Map */}
          <div className="h-[400px] lg:h-auto min-h-[400px] bg-neutral-200 rounded-xl overflow-hidden shadow-md relative group">
            <a 
              href={CONTACT_INFO.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 right-4 z-20 bg-white hover:bg-gold-500 text-dark-900 px-4 py-2 rounded-lg font-bold text-sm shadow-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Abrir en Maps
            </a>
            <iframe 
                src={CONTACT_INFO.mapEmbedUrl}
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen={true} 
                loading="lazy"
                title="Google Map"
                className="absolute inset-0"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};