// backend/src/payments/payments.service.ts

import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

  // 1. CREAR PREFERENCIA DE PAGO (Link de pago)
  async createPreference(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { schedule: { include: { tour: true } } }
    });

    if (!booking) throw new NotFoundException('Reserva no encontrada');

    const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
    const preference = new Preference(client);

    // Validamos que el precio sea un número correcto
    const unitPrice = Number(booking.totalPrice);
    if (isNaN(unitPrice)) throw new InternalServerErrorException("El precio de la reserva no es válido");

    // Construimos el cuerpo con la estructura exacta de la API v2
    const paymentBody = {
      items: [
        {
          id: booking.scheduleId,
          title: booking.schedule.tour.title,
          quantity: 1,
          unit_price: unitPrice,
          currency_id: 'CLP', // Peso Chileno
        },
      ],
      external_reference: booking.id,
      
      // AQUÍ ESTABA EL PROBLEMA: Nos aseguramos de que sean strings válidos
      back_urls: {
        success: 'http://localhost:3000/profile', // Redirigir al perfil al terminar
        failure: 'http://localhost:3000/',        // Al home si falla
        pending: 'http://localhost:3000/profile', // Al perfil si queda pendiente
      },
      
      // Esto obliga a MP a redirigir automáticamente si el pago es exitoso
      ///auto_return: 'approved', 
      
      // Opcional: Para evitar errores con correos de prueba
      payer: {
        email: booking.contactEmail || 'test_user_123456@test.com' 
      }
    };

    try {
      this.logger.log(`📤 Enviando a MercadoPago Booking: ${booking.id} | Precio: ${unitPrice}`);
      
      const result = await preference.create({ body: paymentBody });
      
      // Log para verificar que se generó
      if (!result.init_point) throw new Error("MercadoPago no devolvió la URL (init_point)");

      return { url: result.init_point };

    } catch (error: any) {
      this.logger.error("❌ Error MP detalle completo:", JSON.stringify(error, null, 2));
      throw new InternalServerErrorException("Fallo al contactar con MercadoPago: " + (error.message || 'Error desconocido'));
    }
  }

  // 2. WEBHOOK (Entrada de notificaciones de MP)
  async handleWebhook(body: any) {
    const { type, data } = body;

    // Solo nos interesa cuando el evento es de tipo "payment"
    if (type === 'payment' || body.action === 'payment.created' || body.action === 'payment.updated') {
      const paymentId = data?.id || body.data?.id; // A veces viene en data.id, a veces en body.data.id

      if (paymentId) {
        this.logger.log(`🔔 Webhook recibido para pago ID: ${paymentId}`);
        // Procesamos el pago asíncronamente para responder rápido a MP
        this.processPayment(paymentId); 
      }
    }
    return { status: 'received' };
  }

  // 3. PROCESAR PAGO (Verificar estado y actualizar BD)
  async processPayment(paymentId: string) {
    const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
    const payment = new Payment(client);
    
    try {
        // A. Consultar estado real a MercadoPago
        const paymentData = await payment.get({ id: paymentId });
        const status = paymentData.status;
        const externalReference = paymentData.external_reference; // Este es nuestro bookingId

        this.logger.log(`💳 Procesando pago ${paymentId} | Estado: ${status} | Booking: ${externalReference}`);

        // B. Si está aprobado, hacemos la magia
        if (status === 'approved' && externalReference) {
            
            // Transacción: Actualizar Booking y Payment al mismo tiempo
            const updatedBooking = await this.prisma.booking.update({
                where: { id: externalReference },
                data: { 
                    status: 'CONFIRMED',
                    payment: {
                        // Buscamos el pago asociado o creamos/actualizamos uno
                        upsert: {
                            create: {
                                amount: paymentData.transaction_amount,
                                provider: 'MERCADOPAGO',
                                providerPaymentId: String(paymentId),
                                status: 'APPROVED'
                            },
                            update: {
                                providerPaymentId: String(paymentId),
                                status: 'APPROVED'
                            }
                        }
                    }
                },
                include: { 
                    schedule: { include: { tour: true } },
                    passengers: true
                }
            });

            this.logger.log(`✅ Reserva ${externalReference} CONFIRMADA en base de datos.`);

            // C. ENVIAR CORREO (Solo si tiene email)
            if (updatedBooking.contactEmail) {
                this.logger.log(`📧 Enviando correo a ${updatedBooking.contactEmail}...`);
                await this.mailService.sendBookingConfirmation(updatedBooking);
            }
        }
        
        return { status: 'processed' };

    } catch (error) {
        this.logger.error(`❌ Error procesando pago ${paymentId}:`, error);
        return { status: 'error' };
    }
  }

  // 4. APROBACIÓN MANUAL (Para testing local)
  async approvePaymentManual(bookingId: string) {
    this.logger.log(`🔧 Aprobación manual forzada para Booking: ${bookingId}`);
    
    const booking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { 
        status: 'CONFIRMED',
        payment: {
          update: { status: 'APPROVED' }
        }
      },
      include: { 
        schedule: { include: { tour: true } },
        passengers: true
      }
    });

    if (booking.contactEmail) {
      await this.mailService.sendBookingConfirmation(booking);
    }

    return booking;
  }
}