// src/app/admin/page.tsx
import Link from 'next/link';

// Definimos la forma de los datos que vienen del backend
interface DashboardStats {
  activeTours: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: {
    id: string;
    totalPrice: string;
    status: string;
    createdAt: string;
    contactEmail: string;
    schedule: {
      tour: { title: string };
      startTime: string;
    };
  }[];
}

async function getStats(): Promise<DashboardStats> {
  try {
    // Llamamos al endpoint nuevo que acabamos de crear
    const res = await fetch('http://localhost:3001/bookings/stats', { cache: 'no-store' });
    if (!res.ok) throw new Error('Error al obtener estadísticas');
    return res.json();
  } catch (error) {
    console.error(error);
    // Datos vacíos por seguridad si falla el backend
    return { activeTours: 0, totalBookings: 0, totalRevenue: 0, recentBookings: [] };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Resumen General</h1>

      {/* --- TARJETAS DE ESTADÍSTICAS (CON DATOS REALES) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Tarjeta 1: Ingresos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium">Ingresos Confirmados</h3>
            <span className="p-2 bg-green-100 text-green-600 rounded-lg">💰</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            ${stats.totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-slate-400 mt-2">Total acumulado</p>
        </div>

        {/* Tarjeta 2: Reservas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium">Reservas Confirmadas</h3>
            <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">🎫</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.totalBookings}</p>
        </div>

        {/* Tarjeta 3: Tours Activos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium">Tours Activos</h3>
            <span className="p-2 bg-purple-100 text-purple-600 rounded-lg">🚤</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.activeTours}</p>
        </div>
      </div>

      {/* --- TABLA DE ÚLTIMAS RESERVAS (REAL) --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Últimas 5 Reservas</h3>
          <Link href="/admin/bookings" className="text-sm text-blue-600 hover:underline">
            Ver todas &rarr;
          </Link>
        </div>

        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
            <tr>
              <th className="p-4 border-b">Cliente</th>
              <th className="p-4 border-b">Tour</th>
              <th className="p-4 border-b">Monto</th>
              <th className="p-4 border-b">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stats.recentBookings.map((booking) => {
              const statusColor = booking.status === 'CONFIRMED' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700';
              
              const statusLabel = booking.status === 'CONFIRMED' ? 'Pagado' : 'Pendiente';

              return (
                <tr key={booking.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">
                    {booking.contactEmail}
                  </td>
                  <td className="p-4 text-slate-600 text-sm">
                    {booking.schedule.tour.title}
                    <div className="text-xs text-slate-400">
                        {new Date(booking.schedule.startTime).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-700">
                    ${Number(booking.totalPrice).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </td>
                </tr>
              );
            })}
            
            {stats.recentBookings.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">
                  No hay actividad reciente.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}