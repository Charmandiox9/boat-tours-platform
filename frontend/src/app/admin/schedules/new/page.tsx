// src/app/admin/schedules/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tour } from '@/types';

export default function NewSchedulePage() {
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    tourId: '',
    date: '',
    time: '',
    priceOverride: '',
    maxCapacity: ''
  });

  // Cargar lista de tours al iniciar para el <select>
  useEffect(() => {
    fetch('http://localhost:3001/tours')
      .then(res => res.json())
      .then(data => setTours(data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Combinar fecha y hora en formato ISO
    const dateTime = new Date(`${formData.date}T${formData.time}`);
    
    try {
      const res = await fetch('http://localhost:3001/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId: formData.tourId,
          startTime: dateTime.toISOString(),
          priceOverride: formData.priceOverride ? Number(formData.priceOverride) : undefined,
          maxCapacity: Number(formData.maxCapacity)
        })
      });

      if (!res.ok) throw new Error('Error creando horario');
      
      router.push('/admin/schedules');
      router.refresh();

    } catch (error) {
      alert('Error. Revisa la consola.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Programar Nueva Salida</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
        
        {/* Selección de Tour */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Selecciona el Tour</label>
          <select 
            required
            className="w-full border border-slate-300 rounded-lg p-3 bg-white"
            value={formData.tourId}
            onChange={e => {
                const tour = tours.find(t => t.id === e.target.value);
                setFormData({
                    ...formData, 
                    tourId: e.target.value,
                    maxCapacity: tour ? String(tour.maxCapacity) : '' // Auto-llenar capacidad
                });
            }}
          >
            <option value="">-- Elige un barco --</option>
            {tours.map(tour => (
              <option key={tour.id} value={tour.id}>{tour.title}</option>
            ))}
          </select>
        </div>

        {/* Fecha y Hora */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Fecha</label>
            <input 
              type="date" required
              className="w-full border border-slate-300 rounded-lg p-3"
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Hora</label>
            <input 
              type="time" required
              className="w-full border border-slate-300 rounded-lg p-3"
              onChange={e => setFormData({...formData, time: e.target.value})}
            />
          </div>
        </div>

        {/* Opcionales */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Capacidad (Cupos)</label>
            <input 
              type="number" required
              className="w-full border border-slate-300 rounded-lg p-3"
              value={formData.maxCapacity}
              onChange={e => setFormData({...formData, maxCapacity: e.target.value})}
            />
          </div>
          <div>
             <label className="block text-sm font-bold text-slate-700 mb-2">Precio Especial (Opcional)</label>
             <input 
               type="number"
               placeholder="Dejar vacío si es igual"
               className="w-full border border-slate-300 rounded-lg p-3"
               onChange={e => setFormData({...formData, priceOverride: e.target.value})}
             />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 mt-4"
        >
          {loading ? 'Guardando...' : 'Programar Salida'}
        </button>

      </form>
    </div>
  );
}