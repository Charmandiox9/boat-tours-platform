// src/app/admin/tours/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTourPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Estado para el archivo seleccionado
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    basePrice: '',
    duration: '',
    maxCapacity: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Usamos FormData en lugar de JSON
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('basePrice', formData.basePrice);
      data.append('duration', formData.duration);
      data.append('maxCapacity', formData.maxCapacity);
      
      // 2. Adjuntamos el archivo si existe
      if (selectedFile) {
        data.append('image', selectedFile);
      }

      // 3. Enviamos al backend (Nota: NO poner header Content-Type, fetch lo pone solo)
      const res = await fetch('http://localhost:3001/tours', {
        method: 'POST',
        body: data, 
      });

      if (!res.ok) throw new Error('Error al crear tour');

      router.push('/admin/tours');
      router.refresh();

    } catch (error) {
      alert('Error creando el tour.');
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
            className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Pesca Deportiva"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Descripción</label>
          <textarea 
            name="description" required rows={4}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe la experiencia..."
          />
        </div>

        {/* Precio y Duración */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Precio Base ($)</label>
            <input 
              name="basePrice" type="number" required
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Duración (min)</label>
            <input 
              name="duration" type="number" required
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Capacidad e Imagen */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Capacidad</label>
            <input 
              name="maxCapacity" type="number" required
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* INPUT DE ARCHIVO (NUEVO) */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Imagen de Portada</label>
            <input 
              type="file"
              accept="image/*"
              required
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
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
            {loading ? 'Subiendo...' : 'Crear Tour'}
          </button>
        </div>

      </form>
    </div>
  );
}