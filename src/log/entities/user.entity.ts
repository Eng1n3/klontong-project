import { Exclude } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
import { UserRole } from 'src/user-role/entities/user-role.entity';
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

@Entity('logs')
export class Log {
  @Exclude()
  @Column({ name: 'modified_by' })
  modified_by: string;

  @Exclude()
  @ManyToOne(() => User, (user) => user.log, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'modified_by',
    foreignKeyConstraintName: 'FK_logs_users',
  })
  user: User;

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_logs',
  })
  id: string;

  @Column({ name: 'action', type: 'varchar', length: 100 })
  action: string;

  @Column({ name: 'table_name', type: 'varchar', length: 100 })
  tableName: string;

  @Column({ name: 'modified_data', type: 'json' })
  modifiedData: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
  deletedAt: Date;
}
