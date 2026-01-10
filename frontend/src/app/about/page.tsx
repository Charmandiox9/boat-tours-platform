// src/app/about/page.tsx
'use client';

import { useState } from 'react';

export default function AboutPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulación de envío
    setTimeout(() => {
      setFormStatus('success');
      alert("Mensaje enviado (Simulación). Aquí conectaríamos con un endpoint de contacto.");
      // Resetear el formulario si quisieras
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src="https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?q=80&w=2074&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-40"
            alt="Capitán navegando"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Más que un tour, <span className="text-blue-400">una experiencia</span>
          </h1>
          <p className="text-slate-200 max-w-2xl mx-auto text-lg">
            Conoce al equipo detrás de las mejores aventuras náuticas de la región.
          </p>
        </div>
      </section>

      {/* 2. NUESTRA HISTORIA */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">Nuestra Historia</h2>
            <h3 className="text-3xl font-bold text-slate-800 mb-6">Navegando desde 2018</h3>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                Todo comenzó con una pequeña lancha y un gran sueño: mostrar la belleza oculta de nuestras costas a viajeros de todo el mundo.
              </p>
              <p>
                Hoy, YudiBel Tours cuenta con una flota moderna y un equipo de capitanes certificados, pero mantenemos el mismo espíritu familiar y la pasión por el mar que nos vio nacer.
              </p>
              <p>
                Nuestra misión es simple: <strong>Seguridad, Diversión y Recuerdos Inolvidables.</strong>
              </p>
            </div>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl transform md:rotate-2 hover:rotate-0 transition-all duration-500">
            <img 
              src="https://images.unsplash.com/photo-1559136555-930d72f1d300?q=80&w=2074&auto=format&fit=crop"
              className="w-full h-full object-cover"
              alt="Nuestro equipo"
            />
          </div>
        </div>
      </section>

      {/* 3. POR QUÉ ELEGIRNOS (Iconos) */}
      <section className="bg-slate-50 py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="text-4xl mb-4">🛡️</div>
            <h4 className="font-bold text-slate-800 mb-2">Seguridad Primero</h4>
            <p className="text-sm text-slate-500">Todas nuestras embarcaciones cuentan con certificación al día y chalecos salvavidas premium.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="text-4xl mb-4">👨‍✈️</div>
            <h4 className="font-bold text-slate-800 mb-2">Capitanes Expertos</h4>
            <p className="text-sm text-slate-500">Nuestro equipo tiene años de experiencia navegando estas aguas y conocen los mejores secretos.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="text-4xl mb-4">⭐</div>
            <h4 className="font-bold text-slate-800 mb-2">Excelencia</h4>
            <p className="text-sm text-slate-500">Más de 500 clientes satisfechos y reseñas de 5 estrellas nos respaldan.</p>
          </div>
        </div>
      </section>

      {/* 4. CONTACTO Y MAPA */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800">Contáctanos</h2>
          <p className="text-slate-500 mt-2">¿Tienes dudas o quieres un tour privado? Escríbenos.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          
          {/* Lado Izquierdo: Formulario */}
          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre Completo</label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" placeholder="Juan Pérez" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Correo Electrónico</label>
                <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" placeholder="juan@ejemplo.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mensaje</label>
                <textarea required rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500" placeholder="Hola, quisiera cotizar un evento privado..." />
              </div>

              <button 
                type="submit" 
                disabled={formStatus === 'submitting'}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {formStatus === 'submitting' ? 'Enviando...' : 'Enviar Mensaje'}
              </button>

              {formStatus === 'success' && (
                <div className="p-3 bg-green-100 text-green-700 text-sm rounded-lg text-center">
                  ¡Mensaje enviado correctamente! Te responderemos pronto.
                </div>
              )}
            </form>
          </div>

          {/* Lado Derecho: Info y Mapa */}
          <div className="bg-slate-900 text-white p-8 md:p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-6">Información de Contacto</h3>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start gap-3">
                  <span>📍</span>
                  <span>Muelle Prat, Local 45<br/>Valparaíso, Chile</span>
                </li>
                <li className="flex items-center gap-3">
                  <span>📞</span>
                  <span>+56 9 9876 5432</span>
                </li>
                <li className="flex items-center gap-3">
                  <span>✉️</span>
                  <span>contacto@yudibel.cl</span>
                </li>
                <li className="flex items-center gap-3">
                  <span>⏰</span>
                  <span>Lun - Dom: 09:00 - 18:00</span>
                </li>
              </ul>
            </div>

            {/* Mapa Embed (Google Maps Placeholder) */}
            <div className="mt-8 rounded-lg overflow-hidden h-48 border border-slate-700">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3344.827725832746!2d-71.62534562432243!3d-33.03463327663363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9689e0cd0d8262f9%3A0x6c624564c4c23577!2sMuelle%20Prat!5e0!3m2!1ses-419!2scl!4v1715000000000!5m2!1ses-419!2scl" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}