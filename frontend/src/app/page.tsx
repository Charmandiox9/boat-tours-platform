// src/app/page.tsx
import TourCard from '@/components/TourCard';
import { Tour } from '@/types';

// Función para obtener los datos del Backend
async function getTours(): Promise<Tour[]> {
  // OJO: Usamos http://localhost:3001 porque es server-to-server
  // Si falla en Docker, tendríamos que usar el nombre del servicio, pero local está bien.
  try {
    const res = await fetch('http://localhost:3001/tours', { 
      cache: 'no-store' // Para que siempre traiga datos frescos
    });
    
    if (!res.ok) throw new Error('Error al obtener tours');
    
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  const tours = await getTours();

  return (
    <main className="min-h-screen">
      
      {/* 1. HERO SECTION (Portada) */}
      <section className="relative h-[500px] flex items-center justify-center">
        {/* Imagen de fondo oscurecida */}
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-50"
            alt="Mar y Lancha"
          />
        </div>

        {/* Contenido del Hero */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Descubre el mar <span className="text-blue-400">como nunca antes</span>
          </h1>
          <p className="text-lg text-slate-200 mb-8 max-w-2xl mx-auto">
            Reserva los mejores paseos en lancha y tours náuticos. 
            Experiencias inolvidables a un clic de distancia.
          </p>

          {/* Buscador Rápido (Visual por ahora) */}
          <div className="bg-white p-4 rounded-xl shadow-2xl flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 mb-1 text-left">FECHA</label>
              <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-500 mb-1 text-left">PASAJEROS</label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none">
                <option>1 Pasajero</option>
                <option>2 Pasajeros</option>
                <option>3+ Pasajeros</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-lg transition-all">
                Buscar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LISTADO DE TOURS */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Tours Destacados</h2>
            <p className="text-slate-500 mt-2">Explora nuestras salidas más populares</p>
          </div>
          <button className="text-blue-600 font-semibold hover:underline hidden md:block">
            Ver todos los tours &rarr;
          </button>
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
            <p className="text-slate-500 text-lg">No hay tours disponibles por el momento.</p>
            <p className="text-sm text-slate-400 mt-2">Asegúrate de que el Backend esté corriendo en el puerto 3001.</p>
          </div>
        )}
      </section>

    </main>
  );
}