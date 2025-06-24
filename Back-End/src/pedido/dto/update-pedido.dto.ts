// Caminho completo: raquelpds/nest-app/nest-app-f35be99ae39dc056a7441449a93bd1cfa64e74f7/src/pedido/dto/update-pedido.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoDto } from './create-pedido.dto';
import { IsString, IsIn, IsOptional } from 'class-validator';

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {
  @IsOptional()
  @IsString()
  @IsIn(['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'])
  status?: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
}