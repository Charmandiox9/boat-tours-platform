'use client';

import { useRouter } from 'next/navigation';

export default function DeleteScheduleButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('¿Borrar esta salida del calendario?')) return;

    const res = await fetch(`http://localhost:3001/schedules/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    } else {
      alert('Error al eliminar. Revisa si hay reservas.');
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 rounded mt-2 w-full"
    >
      Borrar Salida
    </button>
  );
}