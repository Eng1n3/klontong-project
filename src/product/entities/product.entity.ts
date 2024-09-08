import { Exclude, Expose } from 'class-transformer';
import { File } from 'src/file/entities/file.entity';
import { ProductCategory } from 'src/product-category/entities/product-category.entity';
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
  @Exclude()
  @Column({ name: 'product_category_id' })
  productCategoryId: string;

  @Exclude()
  @ManyToOne(
    () => ProductCategory,
    (productCategory) => productCategory.product,
    {
      nullable: false,
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'product_category_id',
    foreignKeyConstraintName: 'FK_products_product_categories',
  })
  productCategory: ProductCategory;

  @Exclude()
  @Column({ name: 'file_id' })
  fileId: string;

  @Exclude()
  @ManyToOne(() => File, (file) => file.product, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'file_id',
    foreignKeyConstraintName: 'FK_products_files',
  })
  file: File;

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_products',
  })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  sku: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'float' })
  weight: number;

  @Column({ type: 'float' })
  width: number;

  @Column({ type: 'float' })
  length: number;

  @Column({ type: 'float' })
  height: number;

  @Column({ type: 'float' })
  price: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
  deletedAt: Date;

  @Expose({ name: 'image' })
  get imagePath(): string {
    return this.file.path;
  }

  @Expose()
  get categoryId(): string {
    return this.productCategory.id;
  }

  @Expose()
  get categoryName(): string {
    return this.productCategory.name;
  }

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}
