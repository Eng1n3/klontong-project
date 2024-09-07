import { ProductCategory } from 'src/product-category/entities/product-category.entity';
import { ProductImage } from 'src/product-image/entities/product-image.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {

  @Column({ name: 'product_category_id' })
  productCategoryId: string;

  @ManyToOne(
    () => ProductCategory,
    (productCategory) => productCategory.product,
    {
      nullable: false,
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'product_category_id' })
  productCategory: ProductCategory;

  @Column({ name: 'product_image_id' })
  productImageId: string;

  @ManyToOne(
    () => ProductImage,
    (productImage) => productImage.product,
    {
      nullable: false,
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'product_image_id' })
  productImage: ProductImage;

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_products',
  })
  id: string;

  @Column()
  sku: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  weight: number;

  @Column({ type: 'int' })
  width: number;

  @Column({ type: 'int' })
  length: number;

  @Column({ type: 'int' })
  height: number;

  @Column({ type: 'int' })
  price: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone' })
  deletedAt: Date;
}
