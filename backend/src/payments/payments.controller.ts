import { Controller, Post, Body, Get, Query, HttpCode, HttpStatus } from '@nestjs/common'; // <--- Agrega HttpCode, HttpStatus
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-preference')
  async createPreference(@Body() body: { bookingId: string }) {
    return this.paymentsService.createPreference(body.bookingId);
  }

  // --- NUEVO: El Webhook ---
  @Post('webhook')
  @HttpCode(HttpStatus.OK) // MercadoPago espera un 200 o 201 siempre
  async handleWebhook(@Body() body: any, @Query('type') type: string) {
    console.log("🔔 Webhook recibido:", body);
    
    // Solo nos interesa cuando el topic es 'payment' o el type es 'payment'
    if (body.type === 'payment' || body.topic === 'payment') {
        const paymentId = body.data?.id || body.id;
        return this.paymentsService.processPayment(paymentId);
    }
    
    return { status: 'ignored' };
  }
}