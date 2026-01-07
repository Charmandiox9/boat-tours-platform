// src/app/checkout/success/page.tsx
import Link from 'next/link';

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // MercadoPago nos devuelve el payment_id en la URL
  const paymentId = searchParams.payment_id;

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-green-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-800 mb-2">¡Reserva Exitosa!</h1>
        <p className="text-slate-500 mb-6">
          Tu pago ha sido procesado correctamente. Te hemos enviado un correo con los detalles.
        </p>

        <div className="bg-slate-50 rounded-lg p-4 mb-8 text-left">
          <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">ID de Pago</p>
          <p className="text-slate-800 font-mono text-sm break-all">{paymentId || 'Procesando...'}</p>
        </div>

        <Link 
          href="/"
          className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}