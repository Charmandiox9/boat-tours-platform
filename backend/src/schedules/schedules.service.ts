import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async create(tourId: string, startTime: string, priceOverride?: number, maxCapacity?: number) {
    // 1. Buscamos el tour original para saber sus valores por defecto
    const tour = await this.prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour) throw new NotFoundException('Tour no encontrado');

    // 2. Creamos la fecha en el calendario
    return this.prisma.tourSchedule.create({
      data: {
        tourId,
        startTime: new Date(startTime), // Convertimos texto a fecha real
        // Si no envían precio/capacidad, usamos los del Tour base
        priceOverride: priceOverride || tour.basePrice,
        maxCapacity: maxCapacity || tour.maxCapacity,
      },
    });
  }

  async findByTour(tourId: string) {
    return this.prisma.tourSchedule.findMany({
      where: { tourId },
      include: { 
        tour: true, // Incluimos datos del tour para ver el título
        bookings: true // Incluimos reservas para calcular cupos (luego)
      } 
    });
  }

  async findAll() {
    return this.prisma.tourSchedule.findMany({
      include: { 
        tour: true,       // Para saber de qué tour es la salida
        bookings: true    // Para saber cuántos asientos quedan
      },
      orderBy: { startTime: 'asc' } // Ordenar por fecha (más cercana primero)
    });
  }

  async delete(id: string) {
    return this.prisma.tourSchedule.delete({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prisma.tourSchedule.update({
      where: { id },
      data: {
        startTime: data.startTime, // Si envían fecha nueva
        maxCapacity: data.maxCapacity ? Number(data.maxCapacity) : undefined,
        priceOverride: data.priceOverride ? Number(data.priceOverride) : undefined,
      }
    });
  }
}