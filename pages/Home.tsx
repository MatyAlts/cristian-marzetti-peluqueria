import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Scissors, Star, Calendar, GraduationCap, ShoppingBag } from 'lucide-react';
import { Button } from '../components/Button';
import { SERVICES, API_URL } from '../constants';
import { Product } from '../types';

export const Home: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const scrollPosition = useRef(0);
  const animationRef = useRef<number | null>(null);
  const lastScrollLeft = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const userScrolling = useRef(false);
  const isAutoScrolling = useRef(false);
  const mouseVelocity = useRef(0);
  const lastMouseX = useRef(0);
  const lastMoveTime = useRef(0);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  const formatPrice = (price: number) =>
    `$${price.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`;

  // Calculate how many sets we need to ensure a massive scrollable area
  // We want at least 40 items total to make it very hard to hit a 'wall' even with 1-2 products
  const setsCount = products.length > 0 ? Math.max(10, Math.ceil(40 / products.length)) : 0;
  const displayProducts = Array(setsCount).fill(products).flat();

  // Initialize scroll position in the middle for bidirectional infinite scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (container && products.length > 0) {
      // Start in the middle of the massive set
      const segmentWidth = container.scrollWidth / setsCount;
      const middleIndex = Math.floor(setsCount / 2);
      const targetScroll = segmentWidth * middleIndex;
      
      container.scrollLeft = targetScroll;
      scrollPosition.current = targetScroll;
      lastScrollLeft.current = targetScroll;
    }
  }, [products.length]);

  // Sync scrollPosition ref and handle infinite scroll bounds
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScrollSync = () => {
      const currentScroll = container.scrollLeft;
      scrollPosition.current = currentScroll;
      
      // Ignore scroll events caused by auto-scroll
      if (isAutoScrolling.current) {
        return;
      }
      
      // Detect user scrolling
      if (!isDragging && !userScrolling.current) {
        userScrolling.current = true;
        if (!isPaused) {
          setIsPaused(true);
        }
      }
      
      // Clear previous timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      // Check if momentum has stopped
      scrollTimeout.current = setTimeout(() => {
        const scrollDiff = Math.abs(container.scrollLeft - lastScrollLeft.current);
        
        if (scrollDiff < 1) {
          // Momentum has stopped, resume auto-scroll
          userScrolling.current = false;
          setIsPaused(false);
        }
        
        lastScrollLeft.current = container.scrollLeft;
      }, 150);
      
      // Check bounds for infinite scroll during manual scroll
      const segmentWidth = container.scrollWidth / setsCount;
      const totalWidth = container.scrollWidth;
      
      // If we're too far to the right (past 70% of the area)
      if (currentScroll > totalWidth * 0.7) {
        const offset = currentScroll - (totalWidth * 0.5);
        scrollPosition.current = offset;
        container.scrollLeft = offset;
      } 
      // If we're too far to the left (before 30% of the area)
      else if (currentScroll < totalWidth * 0.3) {
        const offset = currentScroll + (totalWidth * 0.2);
        // We jump it forward to a safe middle ground
        scrollPosition.current = offset;
        container.scrollLeft = offset;
      }
    };

    container.addEventListener('scroll', handleScrollSync, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScrollSync);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [isDragging, isPaused, setsCount]);

  // Auto-scroll animation - works on all devices
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let lastTime = Date.now();
    const scrollSpeed = 80; // pixels per second

    const animate = () => {
      if (!isPaused && !isDragging && container) {
        const now = Date.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;

        // Mark that we're auto-scrolling
        isAutoScrolling.current = true;

        // Update scroll position smoothly
        scrollPosition.current += scrollSpeed * delta;
        container.scrollLeft = scrollPosition.current;

        // Infinite loop logic 
        const totalWidth = container.scrollWidth;
        
        // Jump back to middle when past 70%
        if (scrollPosition.current > totalWidth * 0.7) {
          scrollPosition.current = totalWidth * 0.4;
          container.scrollLeft = scrollPosition.current;
        }
        
        // Reset flag after a small delay
        setTimeout(() => {
          isAutoScrolling.current = false;
        }, 10);
      } else {
        // Update lastTime even when paused to prevent jumps
        lastTime = Date.now();
        isAutoScrolling.current = false;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.pageX);
    setInitialScrollLeft(scrollRef.current.scrollLeft);
    lastMouseX.current = e.pageX;
    lastMoveTime.current = Date.now();
    mouseVelocity.current = 0;
  };

  const applyMouseMomentum = () => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    let velocity = mouseVelocity.current * 1000; // Convert to pixels per second
    const friction = 0.95; // Friction coefficient
    const minVelocity = 0.5; // Minimum velocity to continue
    
    const momentumStep = () => {
      if (Math.abs(velocity) < minVelocity) {
        // Momentum finished
        lastScrollLeft.current = container.scrollLeft;
        return;
      }
      
      // Apply velocity
      scrollPosition.current -= velocity * 0.016; // 60fps
      container.scrollLeft = scrollPosition.current;
      
      // Check infinite scroll bounds
      const segmentWidth = container.scrollWidth / 6;
      if (scrollPosition.current >= segmentWidth * 4.5) {
        scrollPosition.current = segmentWidth * 2.5;
        container.scrollLeft = scrollPosition.current;
      } else if (scrollPosition.current <= segmentWidth * 0.5) {
        scrollPosition.current = segmentWidth * 2.5;
        container.scrollLeft = scrollPosition.current;
      }
      
      // Apply friction
      velocity *= friction;
      
      requestAnimationFrame(momentumStep);
    };
    
    if (Math.abs(velocity) > minVelocity) {
      requestAnimationFrame(momentumStep);
    } else {
      lastScrollLeft.current = container.scrollLeft;
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      applyMouseMomentum();
    }
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      applyMouseMomentum();
    }
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    
    const currentTime = Date.now();
    const deltaTime = currentTime - lastMoveTime.current;
    const deltaX = e.pageX - lastMouseX.current;
    
    // Calculate velocity
    if (deltaTime > 0) {
      mouseVelocity.current = deltaX / deltaTime;
    }
    
    lastMouseX.current = e.pageX;
    lastMoveTime.current = currentTime;
    
    const x = e.pageX;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = initialScrollLeft - walk;
    scrollPosition.current = scrollRef.current.scrollLeft;
  };

  // Touch handlers for mobile devices
  const handleTouchStart = () => {
    userScrolling.current = true;
    setIsPaused(true);
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
  };

  const handleTouchMove = () => {
    // Keep tracking that user is touching
  };

  const handleTouchEnd = () => {
    // Don't resume immediately - let scroll listener detect when momentum stops
    lastScrollLeft.current = scrollRef.current?.scrollLeft || 0;
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section - Mobile First */}
      <section className="relative h-[100svh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero/main.jpg" 
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
      
      {/* 1.5. Announcement Section - International Courses */}
      <section className="py-16 lg:py-24 bg-dark-900 text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            
            {/* 1. Header/Title - Always first on Mobile via default grid order */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 text-sm font-bold tracking-widest uppercase">
                Evento Especial
              </div>
              
              <h2 className="font-serif text-4xl lg:text-6xl font-bold leading-tight">
                Cristian Marzetti en <span className="text-gold-500 text-glow">Lima, Perú</span>
              </h2>

              {/* 2. Image Section - Placed here to be 2nd on Mobile (between Title and Description) */}
              {/* In Desktop, we move this group to the left using grid-order or wrapping */}
              <div className="block lg:hidden relative group my-8">
                <div className="absolute -inset-4 bg-gold-500/5 rounded-[2rem] blur-2xl group-hover:bg-gold-500/10 transition-all"></div>
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 aspect-video">
                  <img 
                    src="/images/academia/anuncio_1.jpg" 
                    alt="Cursos Ts Educacion Lima" 
                    className="w-full h-full object-cover object-[center_35%] transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <p className="text-xl lg:text-2xl text-gray-100 font-light leading-relaxed">
                  Se anuncia que del <span className="text-gold-500 font-semibold border-b-2 border-gold-500/30 pb-1">20 de febrero al 5 de marzo</span>, se estarán dictando cursos magistrales en la academia de <span className="font-bold text-white">TS Educación</span>.
                </p>
                
                <p className="text-gray-400 text-lg lg:text-xl leading-relaxed">
                  Una oportunidad única para perfeccionar técnicas de vanguardia como el <span className="text-white font-medium">corte shaggy rizado</span> y diseño de imagen con el estándar de excelencia Marzetti.
                </p>
              </div>
              
              <div className="pt-4">
                <a 
                  href={`https://wa.me/5492612692207?text=${encodeURIComponent("Hola, quisiera más información sobre la participación en Ts Educación")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block w-full sm:w-auto"
                >
                  <Button className="w-full sm:w-auto px-12 py-4 text-xl bg-gold-500 hover:bg-gold-400 text-dark-900 border-none shadow-[0_0_40px_rgba(212,175,55,0.25)] hover:shadow-[0_0_60px_rgba(212,175,55,0.45)] transition-all duration-300">
                    Mas info
                  </Button>
                </a>
              </div>
            </div>

            {/* 3. Image Section - Hidden on Mobile, Visible on Desktop (on the correct column) */}
            <div className="hidden lg:block relative group order-first">
              <div className="absolute -inset-4 bg-gold-500/5 rounded-[2rem] blur-2xl group-hover:bg-gold-500/10 transition-all"></div>
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 aspect-square">
                <img 
                  src="/images/academia/anuncio_1.jpg" 
                  alt="Cursos Ts Educacion Lima" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

          </div>
        </div>
        <style>{`
          .text-glow {
            text-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
          }
        `}</style>
      </section>

      {/* 2. Quienes Somos (Brief) */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
              <img src="/images/nosotros/cliente_1.jpg" alt="Cliente 1" className="rounded-lg shadow-lg w-full h-64 object-cover -mt-8" />
              <img src="/images/nosotros/cliente_2.jpg" alt="Cliente 2" className="rounded-lg shadow-lg w-full h-64 object-cover mt-8" />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-serif text-3xl lg:text-5xl font-bold text-dark-900 mb-6">
                Nuestros Clientes
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
                <img src="/images/academia/demo.jpg" alt="Academia Class" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Products (Seamless Infinite Scroll) */}
      <section className="py-16 lg:py-24 bg-neutral-50 overflow-hidden">
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
          className={`w-full overflow-x-auto pb-8 hide-scrollbar cursor-grab active:cursor-grabbing hw-accelerate`}
          style={{ 
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'auto', // Important for seamless jumps
            overscrollBehaviorX: 'none',
            touchAction: 'auto'
          }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* 
            Strategy: 
            Duplicamos los items suficientes veces (mínimo 6 sets) para que el scroll 
            siempre tenga contenido hacia ambos lados. El 'jump' ocurre en el evento onScroll.
          */}
          <div className="flex px-4 gap-4 sm:gap-6 min-w-max">
            {(products.length > 0 ? [...displayProducts] : []).map((product, index) => (
              <div 
                key={`${product.id}-${index}`} 
                className="w-[280px] sm:w-[320px] bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-neutral-100 select-none hw-accelerate ring-1 ring-black/5"
                draggable="false"
              >
                <Link to={`/productos/${product.id}`} className="block">
                  <div className="h-64 overflow-hidden relative group">
                    <img
                      src={product.image_url ? `${API_URL}${product.image_url}` : 'https://placehold.co/400x400?text=Sin+imagen'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none hw-accelerate"
                      draggable="false"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                </Link>
                <div className="p-4">
                  <span className="text-xs font-bold text-gold-600 tracking-wider uppercase">{product.category}</span>
                  <h3 className="font-bold text-lg text-dark-900 mt-1 mb-2 truncate">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-dark-900">{formatPrice(product.price)}</span>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`https://wa.me/5492612692207?text=${encodeURIComponent(`Hola, me interesa el producto ${product.name}`)}`, '_blank');
                      }}
                      className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-dark-900 hover:bg-gold-500 transition-colors"
                    >
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 mt-4 sm:hidden">
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