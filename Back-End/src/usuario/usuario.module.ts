// raquelpds/nest-app/nest-app-f35be99ae39dc056a7441449a93bd1cfa64e74f7/src/usuario/usuario.module.ts
import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importe TypeOrmModule
import { Usuario } from './entities/usuario.entity'; // Importe a entidade Usuario

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])], // Adicione esta linha
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService] // Exporte o serviço para ser usado em módulos de autenticação
})
export class UsuarioModule {}