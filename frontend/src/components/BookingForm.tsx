'use client'; // <--- OBLIGATORIO: Esto indica que corre en el navegador

import { useState } from 'react';
import { Tour, Schedule } from '@/types';

interface BookingFormProps {
  tour: Tour;
  schedules: Schedule[];
}

export default function BookingForm({ tour, schedules }: BookingFormProps) {
  const [selectedSchedule, setSelectedSchedule] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    passengersCount: 1,
  });

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchedule) return alert('Por favor selecciona una fecha');
    
    setLoading(true);

    try {
      // 1. Crear la Reserva en el Backend
      const passengersList = Array(Number(formData.passengersCount)).fill({
        fullName: formData.fullName, // Simplificación: usamos el mismo nombre para todos por ahora
        age: 30
      });

      const bookingRes = await fetch('http://localhost:3001/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduleId: selectedSchedule,
          contactEmail: formData.email,
          contactPhone: formData.phone,
          passengers: passengersList
        })
      });

      if (!bookingRes.ok) throw new Error('Error creando reserva');
      const bookingData = await bookingRes.json();

      // 2. Generar Link de Pago
      const paymentRes = await fetch('http://localhost:3001/payments/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: bookingData.id })
      });

      if (!paymentRes.ok) throw new Error('Error generando pago');
      const paymentData = await paymentRes.json();

      // 3. Redirigir a MercadoPago
      window.location.href = paymentData.url;

    } catch (error) {
      console.error(error);
      alert('Hubo un error al procesar tu solicitud.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 sticky top-4">
      <h3 className="text-xl font-bold mb-4 text-slate-800">Reserva tu lugar</h3>
      
      <form onSubmit={handleBooking} className="space-y-4">
        
        {/* Selector de Fechas */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Elige una fecha</label>
          {schedules.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {schedules.map((sch) => (
                <button
                  type="button"
                  key={sch.id}
                  onClick={() => setSelectedSchedule(sch.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedSchedule === sch.id 
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-semibold text-slate-800">
                    {new Date(sch.startTime).toLocaleDateString('es-ES', { dateStyle: 'full' })}
                  </div>
                  <div className="text-sm text-slate-500">
                    {new Date(sch.startTime).toLocaleTimeString('es-ES', { timeStyle: 'short' })} hrs
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-red-500 text-sm">No hay fechas disponibles.</p>
          )}
        </div>

        {/* Datos del Cliente */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
          <input 
            required
            type="text" 
            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
            value={formData.fullName}
            onChange={e => setFormData({...formData, fullName: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input 
            required
            type="email" 
            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Pasajeros</label>
          <select 
            className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-800"
            value={formData.passengersCount}
            onChange={e => setFormData({...formData, passengersCount: Number(e.target.value)})}
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} persona{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        {/* Botón de Pago */}
        <button
          type="submit"
          disabled={loading || !selectedSchedule}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 mt-4"
        >
          {loading ? 'Procesando...' : `Pagar $${(Number(tour.basePrice) * formData.passengersCount).toLocaleString()}`}
        </button>

        <p className="text-xs text-center text-slate-400 mt-2">
          Serás redirigido a MercadoPago de forma segura.
        </p>
      </form>
    </div>
  );
}