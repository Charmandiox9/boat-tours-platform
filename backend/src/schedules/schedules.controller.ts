import { Controller, Post, Get, Body, Param, Delete, Patch } from '@nestjs/common';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get() // <--- Este es el nuevo, responde a GET /schedules
  async getAllSchedules() {
    // Usamos el servicio de prisma directamente o creamos un método en el servicio.
    // Para hacerlo rápido, voy a asumir que puedes llamar al servicio.
    return this.schedulesService.findAll();
  }

  // Crear una fecha disponible para un tour
  @Post()
  async createSchedule(@Body() body: any) {
    return this.schedulesService.create(
      body.tourId, 
      body.startTime, 
      body.priceOverride,
      body.maxCapacity
    );
  }

  // Ver fechas disponibles de un tour específico
  @Get(':tourId')
  async getSchedulesByTour(@Param('tourId') tourId: string) {
    return this.schedulesService.findByTour(tourId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulesService.delete(id);
  }

  @Patch(':id') // Usamos PATCH para ediciones parciales
  update(@Param('id') id: string, @Body() data: any) {
    return this.schedulesService.update(id, data);
  }

  
}