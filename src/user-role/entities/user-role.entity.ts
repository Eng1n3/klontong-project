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
import { User } from 'src/user/entities/user.entity';

@Entity('user_roles')
export class UserRole {
  @Exclude()
  @PrimaryColumn({ name: 'user_id', primaryKeyConstraintName: 'PK_user_roles' })
  userId: string;

  @Exclude()
  @ManyToOne(() => User, (user) => user.userRole, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'FK_user_roles_user',
  })
  user: User;

  @Exclude()
  @Column({ name: 'role_id' })
  roleId: string;

  @Exclude()
  @ManyToOne(() => Role, (role) => role.userRole, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'role_id',
    foreignKeyConstraintName: 'FK_user_roles_roles',
  })
  role: Role;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
  deletedAt: Date;
}
