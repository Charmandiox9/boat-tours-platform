import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <--- ¡ESTA LÍNEA ES OBLIGATORIA! 
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Boat Tours",
  description: "Reserva tu paseo en lancha",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* 2. Colocamos el Navbar ARRIBA */}
        <Navbar />
        
        {/* El contenido de cada página */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* 3. Colocamos el Footer ABAJO */}
        <Footer />
      </body>
    </html>
  );
}