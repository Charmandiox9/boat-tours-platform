// src/app/admin/tours/new/page.tsx
'use client'; // Necesitamos interactividad

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTourPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    basePrice: '',
    duration: '',
    maxCapacity: '',
    imageUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          basePrice: Number(formData.basePrice),
          duration: Number(formData.duration),
          maxCapacity: Number(formData.maxCapacity),
          images: formData.imageUrl ? [formData.imageUrl] : []
        })
      });

      if (!res.ok) throw new Error('Error al crear tour');

      // Redirigir al listado
      router.push('/admin/tours');
      router.refresh(); // Actualizar datos

    } catch (error) {
      alert('Error creando el tour. Revisa la consola.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Crear Nuevo Tour</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
        
        {/* Título */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Tour</label>
          <input 
            name="title" required
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej: Paseo Romántico al Atardecer"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Descripción</label>
          <textarea 
            name="description" required rows={4}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Describe la experiencia..."
          />
        </div>

        {/* Grid de Precio y Duración */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Precio Base ($)</label>
            <input 
              name="basePrice" type="number" required
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="50000"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Duración (minutos)</label>
            <input 
              name="duration" type="number" required
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="60"
            />
          </div>
        </div>

        {/* Capacidad e Imagen */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Capacidad Máxima</label>
            <input 
              name="maxCapacity" type="number" required
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="10"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">URL de Imagen</label>
            <input 
              name="imageUrl" type="url" required
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://..."
            />
            <p className="text-xs text-slate-400 mt-1">Usa una URL de Unsplash o similar por ahora.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Crear Tour'}
          </button>
        </div>

      </form>
    </div>
  );
}