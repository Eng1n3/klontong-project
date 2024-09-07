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

@Entity({ name: 'product_images' })
export class ProductImage {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_product_images',
  })
  id: string;

  @Column({
    name: 'path',
  })
  path: string;

  @Column({
    name: 'caption',
  })
  caption: string;

  @Column({
    name: 'mime_type',
  })
  mimeType: string;

  @Column({
    type: 'int4',
    name: 'size',
  })
  size: number;

  @Column({
    name: 'checksum',
  })
  checksum: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp with time zone',
  })
  deletedAt: Date;

  @OneToMany((type) => Product, (product) => product.productCategory)
  product?: Product[];
}
