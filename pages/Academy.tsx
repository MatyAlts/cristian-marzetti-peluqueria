import React from 'react';
import { COURSES, CONTACT_INFO } from '../constants';
import { Button } from '../components/Button';
import { CheckCircle, Play } from 'lucide-react';

export const Academy: React.FC = () => {
  return (
    <div className="pt-20 pb-16">
      {/* Hero */}
      <section className="bg-dark-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h1 className="font-serif text-4xl lg:text-6xl font-bold">
                Academia <span className="text-gold-500">Marzetti</span>
              </h1>
              <p className="text-xl text-gray-300">
                Formamos a la próxima generación de estilistas con técnicas exclusivas y práctica real.
              </p>
              <a href={`https://wa.me/${CONTACT_INFO.phone.replace('+', '')}?text=Info%20Academia`}>
                <Button>Consultar Inscripciones</Button>
              </a>
            </div>
            <div className="flex-1 w-full">
               <div className="aspect-video bg-neutral-800 rounded-xl overflow-hidden shadow-2xl relative group cursor-pointer border border-neutral-700">
                 {/* Simulate Video Player */}
                 <img src="https://picsum.photos/800/450?random=88" className="w-full h-full object-cover opacity-60" alt="Video cover" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-gold-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="fill-dark-900 text-dark-900 ml-1 w-8 h-8" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-neutral-50">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Certificación Profesional', 'Prácticas con Modelos Reales', 'Bolsa de Trabajo'].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white p-6 rounded-lg shadow-sm">
                        <CheckCircle className="text-gold-500 w-8 h-8 shrink-0" />
                        <span className="font-bold text-lg">{benefit}</span>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="font-serif text-3xl font-bold text-center mb-12">Nuestros Cursos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-neutral-100 flex flex-col">
              <div className="h-48 overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-sm font-bold text-gold-600 mb-2">{course.duration}</div>
                <h3 className="text-xl font-bold mb-3">{course.title}</h3>
                <p className="text-neutral-600 mb-6 flex-1">{course.description}</p>
                <a 
                  href={`https://wa.me/${CONTACT_INFO.phone.replace('+', '')}?text=Hola,%20quiero%20info%20sobre%20el%20curso%20de%20${course.title}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="outline" fullWidth>Solicitar Info</Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};