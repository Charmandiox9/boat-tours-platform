'use client';

import { useState, useEffect } from 'react';
import { Tour, Schedule } from '@/types';

interface BookingFormProps {
  tour: Tour;
  schedules: Schedule[];
}

interface PassengerData {
  fullName: string;
  rut: string; // <--- NUEVO
  age: string;
}

// Función auxiliar para formatear RUT chileno (12.345.678-9)
const formatRut = (rut: string) => {
  // 1. Limpiar todo lo que no sea número o K
  const value = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  
  // 2. Si es muy corto, devolver tal cual
  if (value.length <= 1) return value;

  // 3. Separar dígito verificador
  const dv = value.slice(-1);
  const cuerpo = value.slice(0, -1);

  // 4. Poner puntos al cuerpo
  const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // 5. Unir
  return `${cuerpoFormateado}-${dv}`;
};

export default function BookingForm({ tour, schedules }: BookingFormProps) {
  const [selectedSchedule, setSelectedSchedule] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [contactData, setContactData] = useState({
    email: '',
    phone: ''
  });

  const [passengers, setPassengers] = useState<PassengerData[]>([
    { fullName: '', rut: '', age: '' } // Inicializar con RUT vacío
  ]);

  // 1. Detectar usuario logueado
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
      setContactData({ email: user.email, phone: user.phone || '' });
      // Pre-rellenar RUT si lo tuvieras en el perfil del usuario, si no, dejar vacío
      setPassengers([{ fullName: user.fullName, rut: '', age: '' }]);
    }
  }, []);

  // 2. Cambiar cantidad de pasajeros
  const handlePassengerCountChange = (count: number) => {
    const newPassengers = [...passengers];
    if (count > passengers.length) {
      for (let i = passengers.length; i < count; i++) {
        newPassengers.push({ fullName: '', rut: '', age: '' });
      }
    } else {
      newPassengers.length = count;
    }
    setPassengers(newPassengers);
  };

  // 3. Actualizar datos (con formateo de RUT)
  const updatePassenger = (index: number, field: keyof PassengerData, value: string) => {
    const updated = [...passengers];
    
    if (field === 'rut') {
      // Si escriben en el RUT, aplicamos el formato
      updated[index] = { ...updated[index], [field]: formatRut(value) };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    
    setPassengers(updated);
  };

  // 4. Enviar Formulario
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchedule) return alert('Por favor selecciona una fecha');
    setLoading(true);

    try {
      const formattedPassengers = passengers.map(p => ({
        fullName: p.fullName,
        rut: p.rut, // Enviamos el RUT
        age: p.age ? parseInt(p.age) : 0
      }));

      const payload = {
        scheduleId: selectedSchedule,
        contactEmail: contactData.email,
        contactPhone: contactData.phone,
        passengers: formattedPassengers,
        userId: userId
      };

      // Fetch al backend...
      const bookingRes = await fetch('http://localhost:3001/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!bookingRes.ok) throw new Error('Error creando reserva');
      const bookingData = await bookingRes.json();

      const paymentRes = await fetch('http://localhost:3001/payments/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: bookingData.id })
      });

      if (!paymentRes.ok) throw new Error('Error generando pago');
      const paymentData = await paymentRes.json();

      window.location.href = paymentData.url;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      alert('Error: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 sticky top-4">
      <h3 className="text-xl font-bold mb-4 text-slate-800">Reserva tu lugar</h3>
      
      <form onSubmit={handleBooking} className="space-y-6">
        
        {/* SECCIÓN FECHAS (Igual que antes) */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">📅 Elige una fecha</label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
             {schedules.map((sch) => (
                <button
                  type="button"
                  key={sch.id}
                  onClick={() => setSelectedSchedule(sch.id)}
                  className={`p-3 rounded-lg border text-left transition-all flex justify-between items-center ${
                    selectedSchedule === sch.id 
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">
                      {new Date(sch.startTime).toLocaleDateString('es-ES', { dateStyle: 'medium' })}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(sch.startTime).toLocaleTimeString('es-ES', { timeStyle: 'short' })} hrs
                    </div>
                  </div>
                  <div className="text-sm font-bold text-blue-600">
                    ${Number(sch.priceOverride ?? tour.basePrice).toLocaleString()}
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* SECCIÓN PASAJEROS */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">👥 Cantidad de Pasajeros</label>
          <select 
            className="w-full border border-slate-300 rounded-lg p-2.5 outline-none"
            value={passengers.length}
            onChange={e => handlePassengerCountChange(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <option key={num} value={num}>{num} persona{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        {/* CONTACTO TITULAR (Igual que antes) */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-3 border border-slate-200">
          <h4 className="text-xs font-bold text-slate-500 uppercase">Datos del Titular</h4>
          <input 
            required type="email" placeholder="Correo Electrónico"
            className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none"
            value={contactData.email}
            onChange={e => setContactData({...contactData, email: e.target.value})}
          />
          <input 
            type="tel" placeholder="Teléfono"
            className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none"
            value={contactData.phone}
            onChange={e => setContactData({...contactData, phone: e.target.value})}
          />
        </div>

        {/* LISTA DE PASAJEROS (CON RUT) */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-700">📝 Datos de los Pasajeros</label>
          {passengers.map((passenger, index) => (
            <div key={index} className="flex flex-col gap-2 p-3 border border-slate-100 rounded-lg bg-slate-50">
              <span className="text-xs font-bold text-slate-400">Pasajero {index + 1}</span>
              <input 
                required
                type="text" 
                placeholder="Nombre Completo"
                className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-blue-500"
                value={passenger.fullName}
                onChange={e => updatePassenger(index, 'fullName', e.target.value)}
              />
              <div className="flex gap-2">
                <input 
                  required
                  type="text" 
                  placeholder="RUT (12.345.678-9)"
                  maxLength={12}
                  className="flex-1 border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-blue-500"
                  value={passenger.rut}
                  onChange={e => updatePassenger(index, 'rut', e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="Edad"
                  className="w-20 border border-slate-300 rounded-lg p-2 text-sm outline-none focus:border-blue-500"
                  value={passenger.age}
                  onChange={e => updatePassenger(index, 'age', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || !selectedSchedule}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg mt-4"
        >
          {loading ? 'Procesando...' : `Pagar $${(Number(tour.basePrice) * passengers.length).toLocaleString()}`}
        </button>

      </form>
    </div>
  );
}