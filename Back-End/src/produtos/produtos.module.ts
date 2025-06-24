import { Module } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { ProdutosController } from './produtos.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importe TypeOrmModule
import { Produto } from './entities/produto.entity'; // Importe a entidade Produto

@Module({
  imports: [TypeOrmModule.forFeature([Produto])], // Adicione esta linha
  controllers: [ProdutosController],
  providers: [ProdutosService],
})
export class ProdutosModule {}