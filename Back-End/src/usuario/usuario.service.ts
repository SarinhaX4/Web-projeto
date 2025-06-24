// raquelpds/nest-app/nest-app-f35be99ae39dc056a7441449a93bd1cfa64e74f7/src/usuario/usuario.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    // Verifica se o usuário ou email já existem
    const existingUser = await this.usuarioRepository.findOne({
      where: [{ username: createUsuarioDto.username }, { email: createUsuarioDto.email }],
    });
    if (existingUser) {
      if (existingUser.username === createUsuarioDto.username) {
        throw new ConflictException('Nome de usuário já existe.');
      }
      if (existingUser.email === createUsuarioDto.email) {
        throw new ConflictException('Email já cadastrado.');
      }
    }

    const newUsuario = this.usuarioRepository.create(createUsuarioDto);
    await newUsuario.hashPassword(); // Criptografa a senha antes de salvar
    return this.usuarioRepository.save(newUsuario);
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado.`);
    }
    return usuario;
  }

  async findByUsername(username: string): Promise<Usuario | undefined> {
    const usuario = await this.usuarioRepository.findOne({ where: { username } });
    return usuario === null ? undefined : usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);

    if (updateUsuarioDto.password) {
      // Se a senha for atualizada, criptografe-a
      usuario.password = await bcrypt.hash(updateUsuarioDto.password, 10);
      delete updateUsuarioDto.password; // Remove do DTO para não tentar mergear novamente
    }

    this.usuarioRepository.merge(usuario, updateUsuarioDto);
    return this.usuarioRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usuarioRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado.`);
    }
  }
}