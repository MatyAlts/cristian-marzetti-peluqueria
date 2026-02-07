import React, { useState } from 'react';
import { Button } from '../components/Button';
import { SERVICES, CONTACT_INFO } from '../constants';
import { Calendar, Clock, Check } from 'lucide-react';

export const Booking: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [date, setDate] = useState('');

  const handleServiceSelect = (id: string) => {
    setSelectedService(id);
    setStep(2);
  };

  const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (selectedDate) {
      const date = new Date(selectedDate + 'T00:00:00');
      const dayOfWeek = date.getDay();
      
      // Check if it's Sunday (0), if so, don't set the date
      if (dayOfWeek === 0) {
        e.target.value = '';
        alert('Los domingos no trabajamos. Por favor selecciona otro día.');
        return;
      }
      
      setDate(selectedDate);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get max date (2 weeks from today) in YYYY-MM-DD format
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 14); // 2 weeks = 14 days
    return maxDate.toISOString().split('T')[0];
  };

  const finishBooking = () => {
    if (!selectedService || !date) return;
    const serviceName = SERVICES.find(s => s.id === selectedService)?.name;
    const message = encodeURIComponent(`Hola, quiero reservar un turno para *${serviceName}* el día *${date}*.`);
    window.open(`https://wa.me/${CONTACT_INFO.phone.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="font-serif text-3xl font-bold text-center mb-2">Reservar Turno</h1>
        <p className="text-center text-neutral-500 mb-8">Agenda tu visita en simples pasos</p>

        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-neutral-200 -z-0"></div>
          {[1, 2, 3].map((num) => (
            <div 
              key={num}
              className={`w-10 h-10 rounded-full flex items-center justify-center z-10 font-bold transition-colors ${
                step >= num ? 'bg-gold-500 text-dark-900' : 'bg-white text-neutral-400 border-2 border-neutral-200'
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold mb-4">1. Selecciona el Servicio</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {SERVICES.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service.id)}
                    className="p-3 sm:p-4 border-2 border-neutral-100 rounded-lg text-left hover:border-gold-500 hover:bg-gold-50 transition-all group active:scale-95"
                  >
                    <div className="font-bold text-base sm:text-lg group-hover:text-dark-900">{service.name}</div>
                    <div className="text-xs sm:text-sm text-neutral-500 mt-1">{service.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4">2. Elige Fecha Preferida</h2>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Fecha
                </label>
                <style>{`
                  /* Deshabilitar domingos en el calendario */
                  input[type="date"]::-webkit-calendar-picker-indicator {
                    cursor: pointer;
                  }
                  
                  /* This will be handled by JavaScript validation */
                `}</style>
                <input 
                  type="date" 
                  value={date}
                  className="w-full px-3 py-3 sm:px-4 sm:py-4 border-2 border-neutral-300 rounded-lg text-base sm:text-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none bg-white"
                  style={{
                    colorScheme: 'light',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none'
                  }}
                  onChange={handleDateSelect}
                  min={getTodayDate()}
                  max={getMaxDate()}
                />
                <p className="text-xs sm:text-sm text-neutral-500 mt-2">
                  Horarios de atención: Lunes a Sábado (próximas 2 semanas disponibles)
                </p>
                <p className="text-xs sm:text-sm text-amber-600 mt-1">
                  ⚠️ Los domingos no trabajamos
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                 <Button variant="ghost" onClick={() => setStep(1)} fullWidth className="sm:flex-1">
                   Atrás
                 </Button>
                 <Button onClick={() => setStep(3)} disabled={!date} fullWidth className="sm:flex-1">
                   Siguiente
                 </Button>
              </div>
            </div>
          )}

           {step === 3 && (
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold">¡Casi listo!</h2>
              <p className="text-sm sm:text-base text-neutral-600 px-2">
                Para confirmar tu turno, te redirigiremos a WhatsApp para ultimar detalles de horario con Cristian.
              </p>
              
              <div className="bg-neutral-50 p-4 rounded-lg text-left max-w-sm mx-auto space-y-2 text-sm sm:text-base">
                <div className="flex justify-between items-center gap-2">
                    <span className="text-neutral-500">Servicio:</span>
                    <span className="font-bold text-right">{SERVICES.find(s => s.id === selectedService)?.name}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                    <span className="text-neutral-500">Fecha:</span>
                    <span className="font-bold">{new Date(date + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                 <Button variant="ghost" onClick={() => setStep(2)} fullWidth className="sm:flex-1">
                   Editar
                 </Button>
                 <Button onClick={finishBooking} fullWidth className="sm:flex-1 bg-[#25D366] hover:bg-[#1ebc57] text-white">
                    Confirmar en WhatsApp
                 </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};