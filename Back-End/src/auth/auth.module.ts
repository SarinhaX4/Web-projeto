// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuarioModule } from '../usuario/usuario.module'; // Importa UsuarioModule
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'; // Criaremos este

@Module({
  imports: [
    UsuarioModule,
    PassportModule,
    JwtModule.register({
      secret: 'SEGREDO_MUITO_SECRETO', // DEVE SER UMA VARIÁVEL DE AMBIENTE EM PRODUÇÃO!
      signOptions: { expiresIn: '60m' }, // Token expira em 60 minutos
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}