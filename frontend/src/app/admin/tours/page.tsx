// src/app/admin/tours/page.tsx
import Link from 'next/link';
import { Tour } from '@/types';
import DeleteTourButton from '@/components/admin/DeleteTourButton';

async function getTours(): Promise<Tour[]> {
  try {
    const res = await fetch('http://localhost:3001/tours', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function AdminToursPage() {
  const tours = await getTours();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Gestionar Tours</h1>
        <Link 
          href="/admin/tours/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          + Nuevo Tour
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
            <tr>
              <th className="p-4 border-b">Nombre</th>
              <th className="p-4 border-b">Precio</th>
              <th className="p-4 border-b">Duración</th>
              <th className="p-4 border-b">Capacidad</th>
              <th className="p-4 border-b text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tours.map((tour) => (
              <tr key={tour.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-800">{tour.title}</td>
                <td className="p-4 text-slate-600">${Number(tour.basePrice).toLocaleString()}</td>
                <td className="p-4 text-slate-600">{tour.duration} min</td>
                <td className="p-4 text-slate-600">{tour.maxCapacity} pers.</td>
                <td className="p-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    Editar
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Editar</button>
                  <DeleteTourButton id={tour.id} /> {/* <--- AQUÍ */}
                </td>
              </tr>
            ))}
            {tours.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  No tienes tours creados aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}