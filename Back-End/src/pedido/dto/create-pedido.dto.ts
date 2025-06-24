// Caminho completo: raquelpds/nest-app/nest-app-f35be99ae39dc056a7441449a93bd1cfa64e74f7/src/pedido/dto/create-pedido.dto.ts
import { IsString, IsNumber, IsEmail, IsOptional, IsIn } from 'class-validator';
import { Type } from 'class-transformer'; // <-- ESSA LINHA É IMPORTANTE!

export class CreatePedidoDto {
  @IsString()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsString()
  customerPhone: string;

  @IsString()
  deliveryAddress: string;

  @IsNumber()
  @Type(() => Number) // Garante que o total seja um número
  total: number;

  @IsOptional()
  @IsString()
  @IsIn(['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'])
  status?: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
}