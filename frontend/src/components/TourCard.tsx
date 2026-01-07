'use client'; // <--- IMPORTANTE: Agregamos esto al inicio

import { Tour } from '@/types';
import { useRouter } from 'next/navigation'; // Usamos el router de navegación

export default function TourCard({ tour }: { tour: Tour }) {
  const router = useRouter();

  const imageSrc = tour.images.length > 0 
    ? tour.images[0] 
    : 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop'; 

  const handleNavigate = () => {
    console.log("🖱 Click detectado en tour:", tour.id); // Debug en consola
    router.push(`/tours/${tour.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-slate-100 flex flex-col h-full">
      {/* Imagen */}
      <div className="h-48 overflow-hidden relative">
        <img 
          src={imageSrc} 
          alt={tour.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-700">
          {tour.duration} min
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-800 mb-2">{tour.title}</h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
          {tour.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Desde</span>
            <span className="text-lg font-bold text-blue-600">
              ${Number(tour.basePrice).toLocaleString()}
            </span>
          </div>
          
          {/* Cambiamos Link por Button con onClick */}
          <button 
            onClick={handleNavigate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer z-10"
          >
            Reservar
          </button>
        </div>
      </div>
    </div>
  );
}