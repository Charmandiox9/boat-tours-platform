// src/app/page.tsx
import Link from 'next/link';
import TourCard from '@/components/TourCard';
import SearchForm from '@/components/client/SearchForm'; // <--- Importamos el componente interactivo
import { Tour } from '@/types';

// Función para obtener los datos (ahora acepta fecha opcional)
async function getTours(date?: string): Promise<Tour[]> {
  try {
    // Si hay fecha, la agregamos a la URL del fetch
    // Ej: http://localhost:3001/tours?date=2024-05-20
    const url = date 
      ? `http://localhost:3001/tours?date=${date}` 
      : 'http://localhost:3001/tours';

    const res = await fetch(url, { 
      cache: 'no-store' 
    });
    
    if (!res.ok) throw new Error('Error al obtener tours');
    
    return res.json();
  } catch (error) {
    console.error("Error fetching tours:", error);
    return [];
  }
}

// Next.js pasa los searchParams como props a la página
interface HomeProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  // Esperamos los parámetros (Next.js 15 requiere await aquí)
  const params = await searchParams;
  
  // Pedimos los tours filtrados (o todos si no hay fecha)
  const tours = await getTours(params.date);

  return (
    <main className="min-h-screen">
      
      {/* 1. HERO SECTION (Portada) */}
      <section className="relative h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-50"
            alt="Mar y Lancha"
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Descubre el mar <span className="text-blue-400">como nunca antes</span>
          </h1>
          <p className="text-lg text-slate-200 mb-8 max-w-2xl mx-auto">
            Reserva los mejores paseos en lancha y tours náuticos. 
            Experiencias inolvidables a un clic de distancia.
          </p>

          {/* AQUÍ ESTÁ EL CAMBIO PRINCIPAL: Usamos el componente cliente */}
          <SearchForm />
          
        </div>
      </section>

      {/* 2. LISTADO DE TOURS */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              {params.date ? `Disponibles para el ${params.date}` : 'Tours Destacados'}
            </h2>
            <p className="text-slate-500 mt-2">
              {params.date 
                ? 'Mostrando solo tours con cupos para esta fecha' 
                : 'Explora nuestras salidas más populares'}
            </p>
          </div>
          
          {/* Ocultamos el botón "Ver todos" si ya estamos filtrando */}
          {!params.date && (
            <button className="text-blue-600 font-semibold hover:underline hidden md:block">
              Ver todos los tours &rarr;
            </button>
          )}
        </div>

        {/* Grid de Tarjetas */}
        {tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <div className="text-4xl mb-4">📅</div>
            <p className="text-slate-500 text-lg font-medium">No encontramos salidas para esta fecha.</p>
            <p className="text-sm text-slate-400 mt-2">Intenta buscar otro día o limpia el filtro para ver todo.</p>
            {params.date && (
              <Link href="/" className="mt-6 inline-block text-blue-600 font-bold hover:underline">
                Ver todos los tours
              </Link>
            )}
          </div>
        )}
      </section>

    </main>
  );
}