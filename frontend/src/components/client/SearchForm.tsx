// src/components/SearchForm.tsx
'use client'; // <--- Vital para usar hooks y eventos

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Estado inicial: leemos la URL por si ya hay una fecha seleccionada
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [passengers, setPassengers] = useState('1');

  const handleSearch = () => {
    // Creamos la query string
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    
    // Empujamos la nueva URL. Esto recargará los datos en la página principal
    router.push(`/?${params.toString()}`);
  };

  const handleClear = () => {
    setDate('');
    router.push('/');
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-2xl flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
      {/* Campo Fecha */}
      <div className="flex-1">
        <label className="block text-xs font-bold text-slate-500 mb-1 text-left">FECHA</label>
        <input 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" 
        />
      </div>
      
      {/* Campo Pasajeros (Visual por ahora, pero guardamos el estado) */}
      <div className="flex-1">
        <label className="block text-xs font-bold text-slate-500 mb-1 text-left">PASAJEROS</label>
        <select 
          value={passengers}
          onChange={(e) => setPassengers(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="1">1 Pasajero</option>
          <option value="2">2 Pasajeros</option>
          <option value="3">3+ Pasajeros</option>
        </select>
      </div>
      
      {/* Botones */}
      <div className="flex items-end gap-2">
        <button 
          onClick={handleSearch}
          className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all"
        >
          Buscar
        </button>
        
        {/* Botón "X" para limpiar si hay fecha */}
        {date && (
          <button 
            onClick={handleClear}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 px-4 rounded-lg transition-all"
            title="Borrar filtros"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}