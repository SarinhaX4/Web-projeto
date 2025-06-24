// src/auth/auth.controller.ts
import { Controller, Post, Request, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local')) // Usa a estratégia 'local' para login
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt')) // Protege esta rota com JWT
  @Get('profile')
  getProfile(@Request() req) {
    return req.user; // Retorna o payload do token
  }
}