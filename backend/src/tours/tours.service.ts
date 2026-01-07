import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ToursService {
  constructor(private prisma: PrismaService) {}

  async createTour(data: any) {
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

  async findAll() {
    return this.prisma.tour.findMany();
  }

  async delete(id: string) {
    // OJO: Si el tour tiene horarios creados, esto fallará a menos que borres los horarios primero
    // o configures "Cascade Delete" en Prisma. Por ahora, asumiremos que borras tours vacíos.
    return this.prisma.tour.delete({ where: { id } });
  }
}