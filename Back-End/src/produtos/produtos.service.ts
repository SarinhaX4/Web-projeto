// raquelpds/nest-app/nest-app-f35be99ae39dc056a7441449a93bd1cfa64e74f7/src/produtos/produtos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './entities/produto.entity';

@Injectable()
export class ProdutosService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
  ) {}

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    const newProduto = this.produtoRepository.create(createProdutoDto);
    // Garante que o status padrão seja aplicado se não fornecido
    if (!newProduto.status) {
        newProduto.status = 'active';
    }
    // Exemplo: se não tiver imagem, adiciona um placeholder
    if (!newProduto.image) {
        newProduto.image = '/placeholder.svg';
    }
    return this.produtoRepository.save(newProduto);
  }

  async findAll(): Promise<Produto[]> {
    return this.produtoRepository.find({ where: { status: 'active' } }); // Busca apenas produtos ativos por padrão
  }

  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({ where: { id } });
    if (!produto || produto.status === 'deleted') { // Considera produtos "deletados" como não encontrados
      throw new NotFoundException(`Produto com ID "${id}" não encontrado.`);
    }
    return produto;
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto): Promise<Produto> {
    const produto = await this.findOne(id); // Reutiliza findOne para verificar se existe e não está deletado
    this.produtoRepository.merge(produto, updateProdutoDto);
    return this.produtoRepository.save(produto);
  }

  async remove(id: number): Promise<void> {
    // Implementa soft delete: muda o status para 'deleted' em vez de remover do DB
    const produto = await this.findOne(id); // Verifica se o produto existe
    produto.status = 'deleted';
    await this.produtoRepository.save(produto);
    // Se quisesse remover fisicamente:
    // const result = await this.produtoRepository.delete(id);
    // if (result.affected === 0) {
    //   throw new NotFoundException(`Produto com ID "${id}" não encontrado.`);
    // }
  }
}