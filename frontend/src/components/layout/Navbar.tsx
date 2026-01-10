'use client'; // <--- OBLIGATORIO: Para usar hooks y localStorage

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Definimos una interfaz básica para el usuario
interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'CLIENT';
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  // Al cargar la página, leemos el localStorage
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true); // Indica que ya estamos en el cliente
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Borramos datos
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    
    // Redirigimos al home y refrescamos para limpiar estados
    router.push('/login');
    router.refresh(); 
  };

  // Evitamos renderizar contenido dinámico hasta que el cliente esté listo (evita errores de hidratación)
  if (!mounted) return null; 

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">⚓</span>
            <span className="font-bold text-xl text-slate-800 tracking-tight">
              Yudi<span className="text-blue-600">Bel</span>
            </span>
          </Link>

          {/* ENLACES DE NAVEGACIÓN (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              Inicio
            </Link>
            <Link href="/tours" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              Tours
            </Link>
            <Link href="/about" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              Nosotros
            </Link>
          </div>

          {/* BOTONES DE ACCIÓN (Lógica Condicional) */}
          <div className="flex items-center gap-4">
            
            {/* CASO 1: USUARIO LOGUEADO */}
            {user ? (
              <div className="flex items-center gap-3">
                
                {/* Saludo (Opcional, se ve bonito) */}
                <span className="hidden lg:block text-xs text-slate-400 font-medium mr-1">
                  Hola, {user.fullName.split(' ')[0]}
                </span>

                {/* Botón DASHBOARD (Solo Admin) */}
                {user.role === 'ADMIN' && (
                  <Link 
                    href="/admin"
                    className="text-slate-600 hover:text-blue-600 font-bold text-sm bg-slate-100 px-3 py-1 rounded-md transition-colors"
                  >
                    📊 Dashboard
                  </Link>
                )}

                {/* Botón PERFIL (Para todos los logueados) */}
                <Link 
                  href="/profile"
                  className="text-slate-600 hover:text-slate-900 font-medium text-sm border border-slate-200 px-3 py-1 rounded-md hover:bg-slate-50 transition-all"
                >
                  👤 Perfil
                </Link>

                {/* Botón CERRAR SESIÓN */}
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 text-sm font-medium ml-2"
                >
                  Salir
                </button>
              </div>
            ) : (
              /* CASO 2: INVITADO (NO LOGUEADO) */
              <>
                <Link 
                  href="/login"
                  className="text-slate-600 hover:text-slate-900 font-medium text-sm"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  href="/#tours"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-colors shadow-sm hover:shadow-md"
                >
                  Reservar Ahora
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}