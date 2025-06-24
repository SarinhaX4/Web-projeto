// raquelpds/nest-app/nest-app-f35be99ae39dc056a7441449a93bd1cfa64e74f7/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProdutosModule } from './produtos/produtos.module';
import { UsuarioModule } from './usuario/usuario.module';
import { CarrinhoModule } from './carrinho/carrinho.module';
import { PedidoModule } from './pedido/pedido.module';
import { Produto } from './produtos/entities/produto.entity';
import { Usuario } from './usuario/entities/usuario.entity';
import { Carrinho } from './carrinho/entities/carrinho.entity';
import { Pedido } from './pedido/entities/pedido.entity';
import { AuthModule } from './auth/auth.module'; // Importar AuthModule

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'hortplus.sqlite',
      entities: [Produto, Usuario, Carrinho, Pedido],
      synchronize: true,
    }),
    ProdutosModule,
    UsuarioModule,
    CarrinhoModule,
    PedidoModule,
    AuthModule, // Adicionar AuthModule aqui
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}