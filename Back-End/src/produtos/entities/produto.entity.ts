// raquelpds/nest-app/nest-app-f35be99ae39dc056a7441449a93bd1cfa64e74f7/src/produtos/entities/produto.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true }) // Adicionado como opcional no DB
  description: string;

  @Column({ nullable: true }) // Adicionado como opcional no DB
  category: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @Column()
  unit: string;

  @Column({ default: 'active' }) // Status padrão
  status: 'active' | 'deleted' | 'low_stock';

  @Column({ nullable: true }) // URL da imagem, opcional
  image: string;
}