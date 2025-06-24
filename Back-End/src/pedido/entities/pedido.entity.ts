// raquelpds/nest-app/nest-app-f35be99ae39dc056a7441449a93bd1cfa64e74f7/src/pedido/entities/pedido.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column()
  customerPhone: string;

  @Column()
  deliveryAddress: string;

  @Column({ default: 'PENDING' }) // Status inicial padrão
  status: string; // Poderia ser um ENUM, mas string é mais simples para começar

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  // Você pode adicionar um campo de data de criação
  // @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  // created_at: Date;

  // Relações com outras entidades (Carrinho, Usuario, Produto) seriam adicionadas aqui
  // Ex: @ManyToOne(() => Usuario, usuario => usuario.pedidos)
  // usuario: Usuario;
  // Ex: @OneToMany(() => OrderItem, orderItem => orderItem.pedido)
  // items: OrderItem[];
}