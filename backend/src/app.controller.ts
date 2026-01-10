// backend/src/app.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { MailService } from './mail/mail.service';

@Controller()
export class AppController {
  constructor(private readonly mailService: MailService) {}

  @Get('test-email')
  async sendTestEmail(@Query('email') email: string) {
    if (!email) return '❌ Error: Debes poner un email. Ejemplo: /test-email?email=tucorreo@gmail.com';
    
    try {
      // Accedemos al transporter interno para probar la conexión directa con Gmail
      const transporter = (this.mailService as any).transporter;

      await transporter.sendMail({
        from: '"Test YudiBel" <tucorreo@gmail.com>', // Gmail lo sobrescribe con el real autenticado
        to: email,
        subject: '✅ YudiBel Tours: Test de Conexión',
        html: `
          <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; border: 1px solid #bae6fd;">
            <h1 style="color: #0284c7;">¡Funciona! 🚀</h1>
            <p>Si estás leyendo esto, la configuración de Gmail y Nodemailer está perfecta.</p>
            <p>Ya puedes aprobar pagos y los correos llegarán.</p>
          </div>
        `,
      });
      return `✅ ÉXITO: Correo de prueba enviado a ${email}. Revisa tu bandeja de entrada (y spam).`;
    } catch (error: any) {
      console.error(error);
      return {
        status: '❌ FALLÓ',
        mensaje: 'No se pudo enviar el correo.',
        error_tecnico: error.message,
        pista: 'Revisa que la "Contraseña de Aplicación" sea correcta y no la de tu login normal.'
      };
    }
  }

  @Get()
  getHello(): string {
    return 'Servidor YudiBel Tours funcionando 🚀';
  }
}