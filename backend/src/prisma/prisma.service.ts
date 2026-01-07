// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Se conecta automáticamente al iniciar el módulo
  async onModuleInit() {
    await this.$connect();
  }

  // Se desconecta al cerrar la aplicación (limpieza)
  async onModuleDestroy() {
    await this.$disconnect();
  }
}