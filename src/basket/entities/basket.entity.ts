import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity('basket')
export class Basket {

  @PrimaryColumn({ name: 'user_id', primaryKeyConstraintName: 'PK_basket' })
  userId: string;

  @Exclude()
  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'FK_basket_user',
  })
  user: User;

  @Column({ name: 'product_id',  })
  productId: string;

  @Exclude()
  @ManyToOne(() => Product, (product) => product.id, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'product_id',
    foreignKeyConstraintName: 'FK_basket_product',
  })
  product: Product;

  @Column({ name: 'basket_status_id',  })
  basketStatusId: string;

  @Exclude()
  @ManyToOne(() => Product, (basketStatus) => basketStatus.id, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'basket_status_id',
    foreignKeyConstraintName: 'FK_basket_basket_status',
  })
  basketStatus: Product;

  @Column({ name: 'transaction_id',  })
  transactionId: string;

  @Exclude()
  @ManyToOne(() => Product, (transaction) => transaction.id, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'transaction_id',
    foreignKeyConstraintName: 'FK_basket_transaction',
  })
  transaction: Product;

  @Column({ type: 'int' })
  quantity: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
  deletedAt: Date;
}
