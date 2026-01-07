import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const { scheduleId, contactEmail, contactPhone, passengers } = data;

    // INICIO DE TRANSACCIÓN (Todo o nada)
    return this.prisma.$transaction(async (tx) => {
      
      // 1. Buscar el Horario y sus reservas actuales
      const schedule = await tx.tourSchedule.findUnique({
        where: { id: scheduleId },
        include: { bookings: { include: { passengers: true } }, tour: true }
      });

      if (!schedule) throw new NotFoundException('Horario no encontrado');

      // 2. Calcular cupos ocupados
      // Sumamos todos los pasajeros de todas las reservas que NO estén canceladas
      const occupiedSeats = schedule.bookings.reduce((total, booking) => {
        if (booking.status === 'CANCELLED') return total;
        return total + booking.passengers.length;
      }, 0);

      const requestedSeats = passengers.length;

      // 3. Validar disponibilidad
      if (occupiedSeats + requestedSeats > schedule.maxCapacity) {
        throw new BadRequestException(`Solo quedan ${schedule.maxCapacity - occupiedSeats} cupos disponibles.`);
      }

      // 4. Calcular Precio Total
      // Si el schedule tiene precio especial lo usa, sino usa el base del tour
      const unitPrice = Number(schedule.priceOverride ?? schedule.tour.basePrice);
      const totalPrice = unitPrice * requestedSeats;

      // 5. Crear la Reserva
      const newBooking = await tx.booking.create({
        data: {
          scheduleId,
          contactEmail,
          contactPhone,
          totalPrice,
          ticketCode: this.generateTicketCode(), // Generamos un código único
          status: 'PENDING_PAYMENT', // Nace pendiente de pago
          passengers: {
            create: passengers.map(p => ({
              fullName: p.fullName,
              age: p.age
            }))
          }
        },
        include: { passengers: true }
      });

      return newBooking;
    });
  }

  async findOne(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: { passengers: true, schedule: { include: { tour: true } } }
    });
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        schedule: {
          include: {
            tour: true // Para tener el nombre del tour
          }
        },
        passengers: true
      },
      orderBy: { createdAt: 'desc' } // Las más recientes primero
    });
  }

  async getDashboardStats() {
    // 1. Contar tours activos
    const activeTours = await this.prisma.tour.count();

    // 2. Contar reservas confirmadas
    const totalBookings = await this.prisma.booking.count({
      where: { status: 'CONFIRMED' }
    });

    // 3. Calcular ingresos (Sumar el precio de las confirmadas)
    // Nota: Como totalPrice a veces es string en SQLite/Prisma, traemos los datos y sumamos en JS para evitar errores
    const confirmedBookings = await this.prisma.booking.findMany({
      where: { status: 'CONFIRMED' },
      select: { totalPrice: true }
    });
    
    const totalRevenue = confirmedBookings.reduce((acc, booking) => {
      return acc + Number(booking.totalPrice);
    }, 0);

    // 4. Obtener las 5 reservas más recientes (sean confirmadas o no)
    const recentBookings = await this.prisma.booking.findMany({
      take: 5, // Solo las últimas 5
      orderBy: { createdAt: 'desc' },
      include: {
        schedule: {
          include: { tour: true }
        },
        passengers: true
      }
    });

    return {
      activeTours,
      totalBookings,
      totalRevenue,
      recentBookings
    };
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.booking.update({
      where: { id },
      data: { 
        status: status as BookingStatus 
      }
    });
  }

  // Utilidad simple para generar códigos tipo "TICKET-X9Z"
  private generateTicketCode() {
    return 'TKT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}