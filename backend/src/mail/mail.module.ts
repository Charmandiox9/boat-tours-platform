import { Module, Global } from '@nestjs/common'; // Agrega Global si quieres usarlo en todos lados sin importar
import { MailService } from './mail.service';

@Global() // <--- Truco: Esto lo hace disponible en toda la app
@Module({
  providers: [MailService],
  exports: [MailService], // <--- IMPORTANTE: Exportarlo
})
export class MailModule {}