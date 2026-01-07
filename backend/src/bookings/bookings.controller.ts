import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('stats') 
  async getStats() {
    return this.bookingsService.getDashboardStats();
  }

  @Get() // <--- Responde a GET /bookings
  async getAllBookings() {
    return this.bookingsService.findAll();
  }

  @Post()
  async createBooking(@Body() body: any) {
    // body espera: scheduleId, contactEmail, contactPhone, passengers (array)
    return this.bookingsService.create(body);
  }

  @Get(':id')
  async getBooking(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }
  
  @Patch(':id/status') // Ruta especial para cambiar estado
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.bookingsService.updateStatus(id, status);
  }
}