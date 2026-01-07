import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <--- ¡ESTA LÍNEA ES OBLIGATORIA! 

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
      <body className={inter.className}>{children}</body>
    </html>
  );
}