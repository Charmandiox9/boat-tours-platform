// src/components/TicketPDF.tsx
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: '#ffffff', fontFamily: 'Helvetica' },
  header: { borderBottomWidth: 2, borderBottomColor: '#2563eb', paddingBottom: 10, marginBottom: 20 },
  logo: { fontSize: 20, color: '#1e293b', fontWeight: 'bold' },
  subHeader: { fontSize: 10, color: '#64748b' },
  
  // Sección Principal
  section: { margin: 10, padding: 10, backgroundColor: '#f8fafc', borderRadius: 5 },
  title: { fontSize: 18, marginBottom: 15, color: '#2563eb', fontWeight: 'bold' },
  
  row: { flexDirection: 'row', marginBottom: 8 },
  label: { width: 80, fontSize: 10, color: '#64748b' },
  value: { fontSize: 12, color: '#0f172a', fontWeight: 'bold' },

  // NUEVO: Estilos para la lista de pasajeros
  passengerSection: { marginTop: 15, borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 10 },
  passengerTitle: { fontSize: 11, color: '#64748b', marginBottom: 5, fontWeight: 'bold' },
  passengerItem: { fontSize: 10, color: '#334155', marginBottom: 2, marginLeft: 10 },
  
  // Sección QR
  qrSection: { 
    marginTop: 30, 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: '#e2e8f0', 
    paddingTop: 20,
    marginBottom: 60 // <--- AQUÍ ESTÁ LA SEPARACIÓN EXTRA (60px de aire abajo)
  },
  qrImage: { width: 120, height: 120 },
  qrText: { fontSize: 10, color: '#64748b', marginTop: 5 },
  
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, fontSize: 9, textAlign: 'center', color: '#94a3b8' }
});

interface TicketProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  booking: any;
  qrCodeUrl: string;
}

export default function TicketPDF({ booking, qrCodeUrl }: TicketProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.logo}>YudiBel Tours</Text>
          <Text style={styles.subHeader}>Comprobante de Reserva</Text>
        </View>

        {/* Detalles del Tour */}
        <View style={styles.section}>
          <Text style={styles.title}>{booking.schedule.tour.title}</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Fecha:</Text>
            <Text style={styles.value}>{new Date(booking.schedule.startTime).toLocaleDateString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Hora:</Text>
            <Text style={styles.value}>{new Date(booking.schedule.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Titular:</Text>
            <Text style={styles.value}>{booking.contactEmail}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total:</Text>
            <Text style={styles.value}>${Number(booking.totalPrice).toLocaleString()}</Text>
          </View>

          {/* === NUEVA SECCIÓN: LISTA DE PASAJEROS === */}
          <View style={styles.passengerSection}>
            <Text style={styles.passengerTitle}>Pasajeros Registrados ({booking.passengers?.length || 0}):</Text>
            
            {/* Iteramos sobre los pasajeros de forma segura */}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {booking.passengers?.map((p: any, index: number) => (
                <Text key={index} style={styles.passengerItem}>
                    • {p.fullName} - {p.rut || 'S/R'} {p.age ? `(${p.age} años)` : ''}
                </Text>
            ))}
            
            {(!booking.passengers || booking.passengers.length === 0) && (
              <Text style={styles.passengerItem}>Sin pasajeros registrados.</Text>
            )}
          </View>
        </View>

        {/* El Código QR con más espacio abajo */}
        <View style={styles.qrSection}>
          <Text style={{ fontSize: 12, marginBottom: 30 }}>Escanea para abordar</Text>
          {qrCodeUrl ? (
            <Image src={qrCodeUrl} style={styles.qrImage} />
          ) : (
            <Text>Generando QR...</Text>
          )}
          <Text style={styles.qrText}>Ticket ID: {booking.ticketCode}</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Por favor llega 15 minutos antes del zarpe. Este ticket es único e intransferible.
          YudiBel Tours - Tongoy, Chile.
        </Text>
      </Page>
    </Document>
  );
}