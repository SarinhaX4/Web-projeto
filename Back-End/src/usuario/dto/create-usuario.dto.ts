// raquelpds/nest-app/nest-app-f35be99ae39dc056a7441449a93bd1cfa64e74f7/src/usuario/dto/create-usuario.dto.ts
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6) // Senha com no mínimo 6 caracteres
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  role?: string; // 'user' ou 'admin'
}