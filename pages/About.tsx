import React from 'react';
import { TEAM } from '../constants';
import { Star, Award, Users } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="pt-20 pb-16">
      {/* Header */}
      <section className="bg-neutral-50 py-12 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl lg:text-6xl font-bold text-dark-900 mb-4">Nosotros</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Conocé la historia y el equipo detrás de la experiencia Marzetti.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-12 lg:py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-serif text-3xl font-bold">Pasión por la Estética</h2>
            <p className="text-neutral-600 leading-relaxed">
              Fundada en 2015 por Cristian Marzetti, nuestra peluquería nació con la misión de elevar el estándar del estilismo en Mendoza. Lo que comenzó como un pequeño local familiar, hoy es un referente de calidad y vanguardia.
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Creemos que cada cliente es único, y por eso nos dedicamos a escuchar, asesorar y crear estilos que no solo se vean bien, sino que resalten la personalidad de quien los lleva.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 border rounded-lg text-center bg-white shadow-sm">
                <Users className="w-8 h-8 mx-auto text-gold-500 mb-2" />
                <span className="block font-bold text-2xl">5000+</span>
                <span className="text-xs text-neutral-500">Clientes Felices</span>
              </div>
              <div className="p-4 border rounded-lg text-center bg-white shadow-sm">
                <Award className="w-8 h-8 mx-auto text-gold-500 mb-2" />
                <span className="block font-bold text-2xl">10+</span>
                <span className="text-xs text-neutral-500">Años de Exp.</span>
              </div>
               <div className="p-4 border rounded-lg text-center bg-white shadow-sm">
                <Star className="w-8 h-8 mx-auto text-gold-500 mb-2" />
                <span className="block font-bold text-2xl">4.9</span>
                <span className="text-xs text-neutral-500">Rating Google</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <img src="/images/equipo/corte_1.jpg" className="w-full h-full object-cover rounded-lg shadow-md" alt="Salon interior" />
             <img src="/images/nosotros/cliente_4.jpg" className="w-full h-full object-cover rounded-lg shadow-md mt-8" alt="Stylist working" />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 bg-neutral-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">Nuestro Equipo</h2>
          <div className="grid grid-cols-1 gap-8 max-w-md mx-auto">
            {TEAM.map((member) => (
              <div key={member.id} className="group relative overflow-hidden rounded-xl bg-neutral-800">
                <div className="aspect-[3/4] overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-100"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <p className="text-gold-500 font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};