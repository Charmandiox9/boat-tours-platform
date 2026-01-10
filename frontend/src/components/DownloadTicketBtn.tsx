// src/components/DownloadTicketBtn.tsx
'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import TicketPDF from './TicketPDF';
import QRCode from 'qrcode';
import { SetStateAction, useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DownloadTicketBtn({ booking }: { booking: any }) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    // 1. Generar el QR. 
    // Contenido: Una URL que tú (Admin) abrirás para ver si es válido.
    // Ej: http://tusitio.com/admin/validate/CODIGO-TICKET
    const validationUrl = `http://localhost:3000/admin/validate/${booking.ticketCode}`;
    
    QRCode.toDataURL(validationUrl)
      .then((url: SetStateAction<string>) => setQrCodeUrl(url))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((err: any) => console.error(err));
  }, [booking.ticketCode]);

  // Renderizado condicional para evitar errores de hidratación en Next.js
  if (!isClient || !qrCodeUrl) return <span className="text-xs text-slate-400">Cargando ticket...</span>;

  return (
    <PDFDownloadLink
      document={<TicketPDF booking={booking} qrCodeUrl={qrCodeUrl} />}
      fileName={`Ticket-${booking.ticketCode}.pdf`}
      className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
    >
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore - A veces PDFDownloadLink se queja de los tipos de children */}
      {({ loading }) => (
        <>
          <span>📄</span>
          {loading ? 'Generando...' : 'Descargar Ticket'}
        </>
      )}
    </PDFDownloadLink>
  );
}