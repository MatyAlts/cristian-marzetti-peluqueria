import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Scissors, Star, Calendar, GraduationCap } from 'lucide-react';
import { Button } from '../components/Button';
import { PRODUCTS, SERVICES } from '../constants';

export const Home: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate products to create infinite scroll illusion
  // 4 sets ensures we have enough content for the reset logic (Set 1+2 == Set 3+4)
  const displayProducts = [...PRODUCTS, ...PRODUCTS, ...PRODUCTS, ...PRODUCTS];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;

    const animate = () => {
      if (!isDragging && !isPaused) {
        // Auto scroll speed
        container.scrollLeft += 1;

        // Infinite scroll reset:
        // When we reach the middle (start of the 3rd set), jump back to 0 (start of 1st set).
        // Since Set 3+4 is identical to Set 1+2, the jump is seamless.
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isDragging, isPaused]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX);
    setInitialScrollLeft(scrollRef.current.scrollLeft);
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollRef.current.scrollLeft = initialScrollLeft - walk;
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section - Mobile First */}
      <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/1920/1080?random=1" 
            alt="Peluquería Marzetti Interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-dark-900/30"></div>
        </div>

        <div className="container relative z-10 px-4 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 leading-tight">
            Estilo que <span className="text-gold-500">Define</span>
          </h1>
          <p className="text-gray-200 text-lg sm:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto font-light">
            Experiencia premium en peluquería, coloración y estilismo en Mendoza.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/turnos" className="w-full sm:w-auto">
              <Button fullWidth className="sm:w-auto min-w-[200px] text-lg">
                Agendar Turno
              </Button>
            </Link>
            <Link to="/productos" className="w-full sm:w-auto">
               <Button variant="outline" fullWidth className="sm:w-auto min-w-[200px] text-white border-white hover:bg-white hover:text-dark-900 text-lg">
                Ver Productos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Quienes Somos (Brief) */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
              <img src="https://picsum.photos/400/600?random=2" alt="Corte y Peinado" className="rounded-lg shadow-lg w-full h-64 object-cover -mt-8" />
              <img src="https://picsum.photos/400/600?random=3" alt="Tratamiento Capilar" className="rounded-lg shadow-lg w-full h-64 object-cover mt-8" />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-serif text-3xl lg:text-5xl font-bold text-dark-900 mb-6">
                Nuestra Historia
              </h2>
              <p className="text-neutral-600 text-lg mb-6 leading-relaxed">
                Peluquería Marzetti nace de la pasión por el detalle. Con años de trayectoria en Mendoza, hemos creado un espacio donde la técnica tradicional se fusiona con las tendencias modernas.
              </p>
              <ul className="space-y-4 mb-8">
                {['Especialistas en Colorimetría', 'Servicio exclusivo para Novias', 'Atención personalizada'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-neutral-800 font-medium">
                    <Star className="w-5 h-5 text-gold-500 fill-current" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/nosotros">
                <Button variant="outline">Conoce al equipo</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Academy Teaser */}
      <section className="py-16 bg-dark-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-500 px-4 py-1 rounded-full text-sm font-bold">
                <GraduationCap size={18} />
                ACADEMIA MARZETTI
              </div>
              <h2 className="font-serif text-3xl lg:text-5xl font-bold">
                Formate como Profesional
              </h2>
              <p className="text-gray-400 text-lg">
                Descubrí nuestros cursos intensivos de peluquería y estilismo profesional. Aprendé de los mejores y construí tu futuro.
              </p>
              <Link to="/academia">
                <Button>Ver Cursos Disponibles</Button>
              </Link>
            </div>
            <div className="flex-1 w-full">
              <div className="aspect-video bg-neutral-800 rounded-xl overflow-hidden shadow-2xl relative group">
                {/* Placeholder for Video */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/40">
                    <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1"></div>
                  </div>
                </div>
                <img src="https://picsum.photos/800/450?random=4" alt="Academia Class" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Products (Infinite Scroll + Drag) */}
      <section className="py-16 lg:py-24 bg-neutral-50">
        <div className="container mx-auto px-4 mb-8 flex justify-between items-end">
          <div>
            <h2 className="font-serif text-3xl font-bold text-dark-900 mb-2">Productos Destacados</h2>
            <p className="text-neutral-500">Lo mejor para tu cuidado personal</p>
          </div>
          <Link to="/productos" className="hidden sm:flex items-center text-gold-600 font-medium hover:text-gold-500">
            Ver todo <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>

        {/* Scroll Container */}
        <div 
          ref={scrollRef}
          className={`w-full overflow-x-auto pb-8 hide-scrollbar cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="flex px-4 gap-4 sm:gap-6 min-w-max">
            {displayProducts.map((product, index) => (
              <div 
                key={`${product.id}-${index}`} 
                className="w-[280px] sm:w-[320px] bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-neutral-100 select-none"
                draggable="false"
              >
                <div className="h-64 overflow-hidden relative group">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                    draggable="false"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
                <div className="p-4">
                  <span className="text-xs font-bold text-gold-600 tracking-wider uppercase">{product.category}</span>
                  <h3 className="font-bold text-lg text-dark-900 mt-1 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-dark-900">{product.price}</span>
                    <Link to="/productos" onClick={(e) => {
                      if (isDragging) e.preventDefault();
                    }}>
                       <button className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-dark-900 hover:bg-gold-500 transition-colors">
                        <ArrowRight size={16} />
                       </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 sm:hidden">
            <Link to="/productos">
              <Button variant="outline" fullWidth>Ver Catálogo Completo</Button>
            </Link>
        </div>
      </section>

      {/* 5. CTA Booking Section */}
      <section className="py-16 bg-gold-500 text-dark-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl lg:text-5xl font-bold mb-8">
            ¿Listo para un cambio?
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto mb-10">
            {SERVICES.map((service) => (
              <div key={service.id} className="bg-gold-400/50 p-4 rounded-lg backdrop-blur-sm border border-gold-600/20 flex flex-col items-center justify-center">
                <Scissors className="w-8 h-8 mb-2 opacity-80" />
                <h3 className="font-bold text-sm sm:text-base leading-tight">{service.name}</h3>
              </div>
            ))}
          </div>

          <Link to="/turnos">
            <Button variant="secondary" className="px-8 py-4 text-lg shadow-xl hover:scale-105 transition-transform">
              <Calendar className="mr-2" />
              Reservar Turno Ahora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};