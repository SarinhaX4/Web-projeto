// sarinhax4/hort-/Hort--main/Back-End/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuarioModule } from '../usuario/usuario.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // Importe ConfigModule para disponibilizar ConfigService para todo o módulo
    ConfigModule.forRoot(), // <--- ADICIONADO AQUI! Isso carrega as variáveis de ambiente.
    UsuarioModule,
    PassportModule,
    // JwtModule.registerAsync para carregar o segredo JWT de forma assíncrona
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importa ConfigModule para o useFactory do JwtModule
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [], // Adicione AuthController aqui se ainda não estiver
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}