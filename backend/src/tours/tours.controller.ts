import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ToursService } from './tours.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Get()
  findAll(@Query('date') date?: string) {
    return this.toursService.findAll(date);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    // Configuración de dónde guardar el archivo
    storage: diskStorage({
      destination: './uploads', // Se guardarán en backend/uploads
      filename: (req, file, callback) => {
        // Generar nombre único: random + extensión original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  create(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    // 1. Convertir los strings a números (FormData envía todo como texto)
    const tourData = {
      title: body.title,
      description: body.description,
      basePrice: Number(body.basePrice),
      duration: Number(body.duration),
      maxCapacity: Number(body.maxCapacity),
      // 2. Si hay archivo, construimos la URL completa; si no, array vacío
      images: file ? [`http://localhost:3001/uploads/${file.filename}`] : [],
    };

    return this.toursService.create(tourData);
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