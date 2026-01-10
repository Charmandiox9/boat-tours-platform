// src/app/tours/[id]/page.tsx
import BookingForm from '@/components/BookingForm';
import { Tour, Schedule } from '@/types';
import Link from 'next/link';

// 1. Función para obtener el Tour (Con Logs y sin caché)
async function getTour(id: string): Promise<Tour | null> {
  console.log(`🔍 [DEBUG] Buscando detalle del Tour ID: ${id}`);

  try {
    // AGREGADO: { cache: 'no-store' } para evitar datos viejos
    const res = await fetch(`http://localhost:3001/tours`, { cache: 'no-store' });
    
    if (!res.ok) {
      console.error("❌ Error al conectar con Backend:", res.status);
      return null;
    }

    const tours: Tour[] = await res.json();
    console.log(`📦 [DEBUG] Tours recibidos del backend: ${tours.length}`);

    // Buscamos el tour específico
    const found = tours.find(t => t.id === id);

    if (!found) {
      console.warn("⚠️ Tour no encontrado en la lista. IDs disponibles:", tours.map(t => t.id));
    } else {
      console.log("✅ Tour encontrado:", found.title);
    }
    
    return found || null;
  } catch (error) {
    console.error("❌ Error de red en getTour:", error);
    return null;
  }
}

// 2. Función para obtener horarios
async function getSchedules(tourId: string): Promise<Schedule[]> {
  try {
    const res = await fetch(`http://localhost:3001/schedules/${tourId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const schedules = await res.json();
    console.log(`📅 [DEBUG] Horarios encontrados: ${schedules.length}`);
    return schedules;
  } catch (error) {
    console.error("❌ Error obteniendo schedules:", error);
    return [];
  }
}

// 3. Página Principal
export default async function TourDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Esperamos a que los parámetros estén listos (Next.js 15)
  const { id } = await params;

  const tour = await getTour(id);
  const schedules = await getSchedules(id);

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <h1 className="text-4xl mb-4">😢</h1>
        <h2 className="text-2xl font-bold mb-2">Tour no encontrado</h2>
        <p>ID Buscado: <code className="bg-slate-200 px-2 py-1 rounded">{id}</code></p>
        <p className="mt-4 text-sm">Revisa la terminal de VS Code para ver los logs de error.</p>
        <Link href="/" className="mt-8 text-blue-600 hover:underline">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Columna Izquierda: Información Visual */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl overflow-hidden shadow-sm h-[400px] relative bg-slate-200">
            <img 
              src={tour.images[0] || "https://images.unsplash.com/photo-1544551763-46a013bb70d5"} 
              alt={tour.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">{tour.title}</h1>
            <div className="flex gap-4 text-sm text-slate-500 mb-6">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                ⏱ {tour.duration} minutos
              </span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
                👥 Máx {tour.maxCapacity} personas
              </span>
            </div>
            
            <h2 className="text-xl font-semibold mb-3">Descripción</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {tour.description}
            </p>
          </div>
        </div>

        {/* Columna Derecha: Formulario de Reserva */}
        <div className="lg:col-span-1">
          <BookingForm tour={tour} schedules={schedules} />
        </div>
        
      </div>
    </div>
  );
}