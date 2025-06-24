// raquelpds/nest-app/nest-app-f35be99ae39dc056a7441449a93bd1cfa64e74f7/src/usuario/dto/update-usuario.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsString, MinLength, IsEmail, IsOptional } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsOptional()
  @IsString()
  @MinLength(6) // Se a senha for atualizada, ainda deve ter um mínimo
  password?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string; // Permitir atualização de email, mas ainda deve ser válido

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  role?: string;
}