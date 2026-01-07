// src/app/checkout/failure/page.tsx
import Link from 'next/link';

export default function FailurePage() {
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Pago Rechazado</h1>
        <p className="text-slate-500 mb-8">
          Hubo un problema al procesar tu tarjeta. No se ha realizado ningún cargo.
        </p>

        <Link 
          href="/"
          className="block w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition-colors"
        >
          Intentar de nuevo
        </Link>
      </div>
    </div>
  );
}