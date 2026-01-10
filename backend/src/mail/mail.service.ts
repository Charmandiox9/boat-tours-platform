// backend/src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendBookingConfirmation(booking: any) {
    const { contactEmail, ticketCode, schedule, passengers, totalPrice } = booking;
    const tourTitle = schedule.tour.title;
    const date = new Date(schedule.startTime).toLocaleDateString();
    const time = new Date(schedule.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Link para ver/descargar el ticket en tu frontend
    const ticketLink = `http://localhost:3000/profile`; 

    // Diseño del HTML del correo
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">YudiBel Tours ⚓</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #2563eb;">¡Tu reserva está confirmada!</h2>
          <p>Hola, gracias por reservar con nosotros. Aquí tienes los detalles de tu aventura.</p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Tour:</strong> ${tourTitle}</p>
            <p style="margin: 5px 0;"><strong>Fecha:</strong> ${date} a las ${time}</p>
            <p style="margin: 5px 0;"><strong>Ticket ID:</strong> ${ticketCode}</p>
            <p style="margin: 5px 0;"><strong>Total Pagado:</strong> $${Number(totalPrice).toLocaleString()}</p>
          </div>

          <h3>Pasajeros:</h3>
          <ul>
            ${passengers.map(p => `<li>${p.fullName} (RUT: ${p.rut || 'N/A'})</li>`).join('')}
          </ul>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${ticketLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Descargar Ticket PDF
            </a>
          </div>
          
          <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 30px;">
            Por favor llega 15 minutos antes del zarpe.
          </p>
        </div>
      </div>
    `;

    await this.transporter.sendMail({
      from: '"YudiBel Tours" <tu_correo_real@gmail.com>',
      to: contactEmail,
      subject: `Confirmación de Reserva - ${ticketCode}`,
      html: htmlContent,
    });

    console.log(`📧 Correo enviado a ${contactEmail}`);
  }
}