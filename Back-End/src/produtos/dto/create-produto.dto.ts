// raquelpds/nest-app/nest-app-f35be99ae39dc056a7441449a93bd1cfa64e74f7/src/produtos/dto/create-produto.dto.ts
import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProdutoDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Type(() => Number)
  stock: number;

  @IsString()
  unit: string;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'deleted', 'low_stock'])
  status?: 'active' | 'deleted' | 'low_stock';
}