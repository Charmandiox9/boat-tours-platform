// src/types/index.ts

export interface Schedule {
  id: string;
  startTime: string; // Viene como ISO string
  priceOverride: string;
  maxCapacity: number;
  // Podríamos agregar 'bookedSeats' si el backend lo enviara calculado
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  basePrice: string;
  duration: number;
  images: string[];
  maxCapacity: number;
}