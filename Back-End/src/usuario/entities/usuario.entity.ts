// raquelpds/nest-app/nest-app-f35be99ae39dc056a7441449a93bd1cfa64e74f7/src/usuario/entities/usuario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt'; // Para criptografia de senha
// import { Pedido } from '../../pedido/entities/pedido.entity'; // Se houver relação um-para-muitos com Pedido

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // Nome de usuário único
  username: string;

  @Column({ unique: true }) // Email único
  email: string;

  @Column()
  password: string; // A senha será armazenada criptografada

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  // Se houver papéis (ex: 'admin', 'user')
  @Column({ default: 'user' })
  role: string; // Ex: 'user', 'admin'

  // Exemplo de relação: Um usuário pode ter muitos pedidos
  // @OneToMany(() => Pedido, pedido => pedido.usuario)
  // pedidos: Pedido[];

  // Hook TypeORM para criptografar a senha antes de salvar
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10); // 10 é o salt rounds
  }
}