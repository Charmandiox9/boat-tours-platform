// src/app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DownloadTicketBtn from '@/components/DownloadTicketBtn';

export default function ProfilePage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Obtener datos básicos del localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const localUserData = JSON.parse(storedUser);

    // 2. Pedir datos FRESCOS al servidor (con reservas)
    fetch('http://localhost:3001/auth/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: localUserData.email })
    })
    .then(res => res.json())
    .then(data => {
      setUser(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });

  }, [router]);

  if (loading) return <div className="p-20 text-center">Cargando perfil...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Tarjeta de Usuario */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{user.fullName}</h1>
            <p className="text-slate-500">{user.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
              {user.role}
            </span>
          </div>
        </div>

        {/* Lista de Reservas */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Mis Reservas Recientes</h2>
          
          {user.bookings && user.bookings.length > 0 ? (
            <div className="grid gap-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {user.bookings.map((booking: any) => (
                <div key={booking.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{booking.schedule.tour.title}</h3>
                      <p className="text-slate-500 text-sm">
                        📅 {new Date(booking.schedule.startTime).toLocaleDateString()} - 
                        ⏰ {new Date(booking.schedule.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Ticket: {booking.ticketCode}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold 
                        ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {booking.status === 'CONFIRMED' ? 'Confirmada' : 'Pendiente Pago'}
                      </span>
                      <p className="font-bold text-slate-800 mt-2">${Number(booking.totalPrice).toLocaleString()}</p>

                      {booking.status === 'CONFIRMED' && (
                        <div className="mt-2">
                          <DownloadTicketBtn booking={booking} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center border border-dashed border-slate-300">
              <p className="text-slate-500 mb-2">No tienes reservas registradas.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}