import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { ToursService } from './tours.service';

@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Post()
  async createTour(@Body() data: any) {
    // Nota: Luego validaremos 'data' con DTOs, por ahora lo pasamos directo
    return this.toursService.createTour(data);
  }

  @Get()
  async getTours() {
    return this.toursService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toursService.delete(id);
  }
}