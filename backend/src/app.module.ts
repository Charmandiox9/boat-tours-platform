// src/app.module.ts
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ToursModule } from './tours/tours.module';
import { SchedulesModule } from './schedules/schedules.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { join } from 'path';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Para que funcione en todos los servicios
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Carpeta "uploads" en la raíz del backend
      serveRoot: '/uploads', // La URL será localhost:3001/uploads/archivo.jpg
    }),

    PrismaModule, 
    ToursModule, 
    SchedulesModule, 
    BookingsModule, 
    AuthModule,
    MailModule,
    PaymentsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}