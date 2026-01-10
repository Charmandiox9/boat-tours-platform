// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Columna 1: Marca */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⚓</span>
            <span className="font-bold text-xl text-white tracking-tight">
              Boat<span className="text-blue-400">Tours</span>
            </span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Descubre el mar como nunca antes. Ofrecemos las mejores experiencias náuticas con seguridad, confort y diversión garantizada.
          </p>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div>
          <h3 className="text-white font-bold mb-4">Explorar</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-blue-400 transition-colors">Inicio</Link></li>
            <li><Link href="/#tours" className="hover:text-blue-400 transition-colors">Nuestros Tours</Link></li>
            <li><Link href="/admin" className="hover:text-blue-400 transition-colors">Acceso Admin</Link></li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div>
          <h3 className="text-white font-bold mb-4">Contacto</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>📍 Puerto Principal, Muelle 7</li>
            <li>📞 +56 9 1234 5678</li>
            <li>✉️ contacto@boattours.com</li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} YudiBel. Todos los derechos reservados.
      </div>
    </footer>
  );
}