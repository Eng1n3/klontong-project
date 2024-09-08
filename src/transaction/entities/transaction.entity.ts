import { Exclude } from 'class-transformer';
import { Role } from 'src/role/entities/role.entity';
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
import { VirtualCode } from 'src/virtual-code/entities/virtual-code.entity';

@Entity('transactions')
export class UserRole {
  @PrimaryColumn({ primaryKeyConstraintName: 'PK_transactions' })
  id: string;

  @Exclude()
  @Column({ name: 'virtual_code_id', nullable: true })
  virtualCodeId: string;

  @Exclude()
  @ManyToOne(() => VirtualCode, (virtualCode) => virtualCode.id, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'virtual_code_id',
    foreignKeyConstraintName: 'FK_transactions_virtual_code',
  })
  virtualCode: VirtualCode;

  @Column({ name: 'payment_type' })
  paymentType: string;

  @Column({ name: 'expired_time', type: 'timestamp with time zone', nullable: true })
  expiredTime: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
  deletedAt: Date;
}
