import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createPreference(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { schedule: { include: { tour: true } } }
    });

    if (!booking) throw new NotFoundException('Reserva no encontrada');

    const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
    const preference = new Preference(client);

    // Definimos el cuerpo de la petición explícitamente
    const paymentBody = {
      items: [
        {
          id: booking.scheduleId,
          title: booking.schedule.tour.title,
          quantity: 1,
          unit_price: Number(booking.totalPrice),
          currency_id: 'CLP', // Asegúrate que sea tu moneda (ARS, MXN, etc.)
        },
      ],
      external_reference: booking.id,
      // URLs de retorno simples
      back_urls: {
        success: 'http://localhost:3000/checkout/success',
        failure: 'http://localhost:3000/checkout/failure',
        pending: 'http://localhost:3000/checkout/pending',
      },
      // NOTA: Comentamos auto_return temporalmente para aislar el error
      // auto_return: 'approved', 
    };

    try {
      console.log("📤 Enviando a MercadoPago:", JSON.stringify(paymentBody, null, 2));
      
      const result = await preference.create({
        body: paymentBody
      });
      
      console.log("✅ ¡LINK GENERADO!:", result.init_point);
      return { url: result.init_point };

    } catch (error) {
      console.error("❌ Error MP detalle:", error); // Ver el error completo
      throw new InternalServerErrorException("Fallo al contactar con MercadoPago");
    }
  }

  async processPayment(paymentId: string) {
    console.log("🔍 Verificando pago ID:", paymentId);
    
    // 1. Consultar a MercadoPago el estado real del pago
    const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
    const payment = new Payment(client);
    
    try {
        const paymentData = await payment.get({ id: paymentId });
        const status = paymentData.status;
        const externalReference = paymentData.external_reference; // Aquí guardamos el bookingId

        console.log(`💳 Estado del pago: ${status} | Reserva ID: ${externalReference}`);

        // 2. Si está aprobado, actualizamos la base de datos
        if (status === 'approved') {
            await this.prisma.booking.update({
                where: { id: externalReference }, // Buscamos por el ID de reserva
                data: { status: 'CONFIRMED' }     // ¡Cambiamos a CONFIRMADO!
            });
            console.log("✅ ¡Reserva confirmada en Base de Datos!");
        }
        
        return { status: 'processed' };

    } catch (error) {
        console.error("❌ Error verificando pago:", error);
        // No lanzamos error para no hacer fallar el webhook de MP, solo logueamos
        return { status: 'error' };
    }
  }
}