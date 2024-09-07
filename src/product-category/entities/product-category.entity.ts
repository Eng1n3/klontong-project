import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product_categories')
export class ProductCategory {
  //   @ManyToOne((type) => User, (user) => user.project, {
  //     nullable: true,
  //     cascade: true,
  //     onDelete: 'CASCADE',
  //   })
  //   @JoinColumn({ name: 'idUser' })
  //   @Field(() => User, {
  //     description: 'user bedasarkan project contoh: {...user}',
  //   })
  //   user?: User;

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_product_categories',
  })
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
  deletedAt: Date;

  @OneToMany((type) => Product, (product) => product.productCategory)
  product?: Product[];
}
