// backend/src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login') // <--- NUEVO ENDPOINT
  login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Post('me')
  getProfile(@Body('email') email: string) {
    return this.authService.getProfile(email);
  }
}