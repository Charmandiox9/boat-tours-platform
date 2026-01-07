// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ToursModule } from './tours/tours.module';
import { SchedulesModule } from './schedules/schedules.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Para que funcione en todos los servicios
    }),

    PrismaModule, 
    ToursModule, 
    SchedulesModule, 
    BookingsModule, 
    PaymentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}