'use client'; // Esto permite interactividad

import { useRouter } from 'next/navigation';

export default function DeleteTourButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este tour? Esta acción no se puede deshacer.')) return;

    try {
      const res = await fetch(`http://localhost:3001/tours/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('No se pudo eliminar (quizás tiene reservas activas)');
      
      router.refresh(); // Recarga la página para ver que desapareció
    } catch (error) {
      alert('Error: No se puede eliminar un tour que tiene horarios o reservas asociadas.');
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-500 hover:text-red-700 font-medium text-sm ml-4">
      Eliminar
    </button>
  );
}