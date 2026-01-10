// src/app/tours/page.tsx
import TourCard from '@/components/TourCard';
import SearchForm from '@/components/client/SearchForm';
import { Tour } from '@/types';
import Link from 'next/link';

// Reutilizamos la lógica de fetch (idealmente esto iría en un archivo lib/api.ts después)
async function getAllTours(date?: string): Promise<Tour[]> {
  try {
    const url = date 
      ? `http://localhost:3001/tours?date=${date}` 
      : 'http://localhost:3001/tours';

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Error al cargar tours');
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

interface ToursPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const params = await searchParams;
  const tours = await getAllTours(params.date);

  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* 1. Encabezado Simple y Buscador */}
      <div className="bg-slate-900 pt-10 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Catálogo de Experiencias
          </h1>
          <p className="text-slate-300 mb-8">
            Encuentra la aventura perfecta para ti y tu familia.
          </p>
          
          {/* Aquí reutilizamos tu buscador para que puedan filtrar también en esta página */}
          <SearchForm />
        </div>
      </div>

      {/* 2. Resultados (Superpuestos un poco sobre el fondo oscuro) */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 pb-20">
        
        {/* Barra de conteo de resultados */}
        <div className="flex justify-between items-center mb-6 px-2">
          <p className="text-slate-600 font-medium">
            {tours.length} {tours.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
            {params.date && <span className="text-blue-600 font-bold"> para el {params.date}</span>}
          </p>
          
          {/* Botón para limpiar filtro si existe */}
          {params.date && (
            <Link href="/tours" className="text-sm text-red-500 hover:underline">
              Limpiar filtro
            </Link>
          )}
        </div>

        {/* Grid de Tours */}
        {tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-200">
            <div className="text-5xl mb-4">🌊</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No encontramos tours para esta fecha</h3>
            <p className="text-slate-500 mb-6">
              Intenta buscar otro día o revisa nuestro catálogo completo.
            </p>
            <Link 
              href="/tours" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Ver todos los tours
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}