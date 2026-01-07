// src/app/admin/bookings/page.tsx
import { Booking } from '@prisma/client'; // O definimos una interfaz manual si da error
import CancelBookingButton from '@/components/admin/CancelBookingButton';

// Interfaz manual para facilitar (ya que el tipo de Prisma no lo tenemos en frontend)
interface BookingWithDetails {
  id: string;
  contactEmail: string;
  contactPhone: string;
  totalPrice: string;
  status: string; // PENDING_PAYMENT, CONFIRMED, etc.
  createdAt: string;
  passengers: any[];
  schedule: {
    startTime: string;
    tour: {
      title: string;
    }
  };
}

async function getBookings(): Promise<BookingWithDetails[]> {
  try {
    const res = await fetch('http://localhost:3001/bookings', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function AdminBookingsPage() {
  const bookings = await getBookings();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Reservas Recibidas</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
            <tr>
              <th className="p-4 border-b">Cliente</th>
              <th className="p-4 border-b">Tour / Fecha</th>
              <th className="p-4 border-b">Pasajeros</th>
              <th className="p-4 border-b">Total</th>
              <th className="p-4 border-b">Estado</th>
              <th className="p-4 border-b">Fecha Compra</th>
              <th className="p-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((booking) => {
              // Colores según estado
              const statusColor = booking.status === 'CONFIRMED' 
                ? 'bg-green-100 text-green-700 border-green-200'
                : 'bg-yellow-100 text-yellow-700 border-yellow-200';

              const statusLabel = booking.status === 'CONFIRMED' ? 'Confirmada' : 'Pendiente';

              return (
                <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{booking.contactEmail}</div>
                    <div className="text-xs text-slate-400">{booking.contactPhone}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-700">{booking.schedule.tour.title}</div>
                    <div className="text-xs text-blue-600">
                      {new Date(booking.schedule.startTime).toLocaleString('es-CL')}
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 text-center">
                    {booking.passengers?.length || 0}
                  </td>
                  <td className="p-4 font-mono font-medium text-slate-700">
                    ${Number(booking.totalPrice).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-400">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <CancelBookingButton id={booking.id} status={booking.status} />
                  </td>
                </tr>
              );
            })}
            
            {bookings.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-slate-400">
                  Aún no hay reservas. ¡Espera a que lleguen los clientes! 🚀
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}