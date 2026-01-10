import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ToursService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    // Aquí usamos el modelo "tour" que definimos en schema.prisma
    return this.prisma.tour.create({
      data: {
        title: data.title,
        description: data.description,
        basePrice: data.basePrice,
        duration: data.duration,
        maxCapacity: data.maxCapacity,
        images: data.images || [],
      },
    });
  }

  async findAll(date?: string) {
    const whereClause: Prisma.TourWhereInput = {
      isActive: true, // Siempre traer solo los activos
    };

    // Si hay fecha, filtramos por la relación 'schedules'
    if (date) {
      const targetDate = new Date(date);
      
      // Calcular inicio (00:00) y fin (23:59) del día en UTC
      const startOfDay = new Date(targetDate.toISOString().split('T')[0] + 'T00:00:00.000Z');
      const endOfDay = new Date(targetDate.toISOString().split('T')[0] + 'T23:59:59.999Z');

      whereClause.schedules = {
        some: {
          startTime: {
            gte: startOfDay,
            lte: endOfDay,
          },
          isClosed: false, // Opcional: solo horarios abiertos
        },
      };
    }

    return this.prisma.tour.findMany({
      where: whereClause,
      include: {
        // Incluimos los horarios para mostrar la hora en el frontend si es necesario
        schedules: {
          where: date ? {
            startTime: {
              gte: new Date(date + 'T00:00:00.000Z'),
              lte: new Date(date + 'T23:59:59.999Z'),
            }
          } : undefined,
          orderBy: { startTime: 'asc' }
        }
      }
    });
  }

  async delete(id: string) {
    // OJO: Si el tour tiene horarios creados, esto fallará a menos que borres los horarios primero
    // o configures "Cascade Delete" en Prisma. Por ahora, asumiremos que borras tours vacíos.
    return this.prisma.tour.delete({ where: { id } });
  }
}