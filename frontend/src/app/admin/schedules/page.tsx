// src/app/admin/schedules/page.tsx
import Link from 'next/link';
import DeleteScheduleButton from '@/components/admin/DeleteScheduleButton';

// Definimos el tipo aquí para no complicarnos con el global por ahora
interface ScheduleWithTour {
  id: string;
  startTime: string;
  maxCapacity: number;
  priceOverride: number;
  tour: { title: string };
  bookings: any[]; // Solo necesitamos contar el largo
}

async function getSchedules(): Promise<ScheduleWithTour[]> {
  try {
    const res = await fetch('http://localhost:3001/schedules', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function AdminSchedulesPage() {
  const schedules = await getSchedules();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Calendario de Salidas</h1>
        <Link 
          href="/admin/schedules/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Programar Salida
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schedules.map((schedule) => {
          const date = new Date(schedule.startTime);
          const occupied = schedule.bookings.length; // Simplificado (1 booking = 1 cupo por ahora)
          // Nota: En realidad deberíamos sumar los pasajeros de cada booking, pero para visualizar sirve.

          return (
            <div key={schedule.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-md uppercase">
                  {schedule.tour.title}
                </span>
                <span className="text-slate-400 text-xs">ID: ...{schedule.id.slice(-4)}</span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800">
                {date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
              <p className="text-slate-500 font-medium mb-4">
                ⏰ {date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} hrs
              </p>

              <div className="bg-slate-50 rounded-lg p-3 flex justify-between items-center text-sm">
                <span className="text-slate-600">Ocupación:</span>
                <span className={`font-bold ${occupied > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                  {occupied} / {schedule.maxCapacity}
                </span>
              </div>
              <DeleteScheduleButton id={schedule.id} />
            </div>
          );
        })}

        {schedules.length === 0 && (
          <div className="col-span-full text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">No hay salidas programadas.</p>
            <p className="text-sm text-slate-400">Haz clic en "+ Programar Salida" para empezar.</p>
          </div>
        )}
      </div>
    </div>
  );
}