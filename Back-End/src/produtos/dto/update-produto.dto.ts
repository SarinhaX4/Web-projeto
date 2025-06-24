// raquelpds/nest-app/nest-app-f35be99ae39dc056a7441449a93bd1cfa64e74f7/src/produtos/dto/update-produto.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProdutoDto } from './create-produto.dto';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateProdutoDto extends PartialType(CreateProdutoDto) {
  @IsOptional()
  @IsString()
  @IsIn(['active', 'deleted', 'low_stock']) // Permite atualizar o status
  status?: 'active' | 'deleted' | 'low_stock';
}