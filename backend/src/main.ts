// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitamos CORS para que el Frontend (Next.js) pueda conectarse luego
  app.enableCors(); 
  
  await app.listen(3001); // Usaremos el puerto 3001 para el Backend
  console.log(`🚀 Servidor Backend corriendo en: http://localhost:3001`);
}
bootstrap();