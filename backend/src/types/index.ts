// src/types/index.ts

export interface Schedule {
  id: string;
  startTime: string;
  priceOverride?: number;
  maxCapacity: number;
  isClosed: boolean;
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  images: string[]; // Ahora es un array de strings real
  duration: number;
  basePrice: string | number; // Prisma devuelve Decimal como string a veces en JSON
  maxCapacity: number;
  isActive: boolean;
  schedules?: Schedule[]; // Opcional porque a veces no lo traemos
}