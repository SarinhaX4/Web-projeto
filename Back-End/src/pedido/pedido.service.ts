// Caminho completo: raquelpds/nest-app/nest-app-f35be99ae39dc056a7441449a93bd1cfa64e74f7/src/pedido/pedido.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
  ) {}

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    // Usa o createPedidoDto diretamente, pois agora ele tem todas as propriedades
    const newPedido = this.pedidoRepository.create(createPedidoDto);
    return this.pedidoRepository.save(newPedido);
  }

  async findAll(): Promise<Pedido[]> {
    return this.pedidoRepository.find();
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidoRepository.findOne({ where: { id } });
    if (!pedido) {
      throw new NotFoundException(`Pedido com ID "${id}" não encontrado.`);
    }
    return pedido;
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const pedido = await this.findOne(id); // Busca o pedido existente

    // Atualiza as propriedades do pedido com base no DTO de atualização.
    // O PartialType garante que você só atualiza as propriedades que são passadas.
    this.pedidoRepository.merge(pedido, updatePedidoDto);

    return this.pedidoRepository.save(pedido); // Salva as alterações
  }

  async remove(id: number): Promise<void> {
    const result = await this.pedidoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Pedido com ID "${id}" não encontrado.`);
    }
  }
}