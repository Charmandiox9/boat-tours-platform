// backend/src/auth/auth.service.ts
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService // Inyectamos el servicio de tokens
  ) {}

  // --- REGISTRO ---
  async register(data: any) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existing) throw new BadRequestException('El correo ya existe');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        fullName: data.name, // <--- AJUSTE: El frontend manda 'name', guardamos en 'fullName'
        role: 'CLIENT',      // Por defecto cliente
        // phone: data.phone // Si el frontend lo mandara, lo pondríamos aquí
      }
    });

    const { password, ...result } = user;
    return result;
  }

  // --- LOGIN (NUEVO) ---
  async login(data: any) {
    const { email, password } = data;

    // 1. Buscar usuario
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Generar Token
    const payload = { sub: user.id, email: user.email, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    };
  }

  async getProfile(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        bookings: {
          include: {
            schedule: {
              include: { tour: true }
            },
            passengers: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }
}