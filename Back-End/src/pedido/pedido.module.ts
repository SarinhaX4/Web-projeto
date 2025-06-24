// raquelpds/nest-app/nest-app-f35be99ae39dc056a7441449a93bd1cfa64e74f7/src/pedido/pedido.module.ts
import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importe TypeOrmModule
import { Pedido } from './entities/pedido.entity'; // Importe a entidade Pedido

@Module({
  imports: [TypeOrmModule.forFeature([Pedido])], // Adicione esta linha para registrar a entidade
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}