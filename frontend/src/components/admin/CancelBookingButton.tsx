'use client';

import { useRouter } from 'next/navigation';

export default function CancelBookingButton({ id, status }: { id: string, status: string }) {
  const router = useRouter();

  const handleCancel = async () => {
    if (!confirm('¿Cancelar esta reserva? El cupo se liberará pero el dinero debe reembolsarse manualmente en MercadoPago.')) return;

    const res = await fetch(`http://localhost:3001/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELLED' })
    });

    if (res.ok) router.refresh();
    else alert('Error al cancelar.');
  };

  if (status === 'CANCELLED') return <span className="text-xs text-slate-400">Cancelada</span>;

  return (
    <button 
      onClick={handleCancel}
      className="text-xs text-red-600 hover:underline font-semibold"
    >
      Cancelar
    </button>
  );
}