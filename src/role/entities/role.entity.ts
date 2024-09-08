import { Exclude, Expose } from 'class-transformer';
import { File } from 'src/file/entities/file.entity';
import { UserRole } from 'src/user-role/entities/user-role.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('roles')
export class Role {

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_role',
  })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
  deletedAt: Date;

  @OneToMany((type) => UserRole, (userRole) => userRole.role)
  userRole?: UserRole[];
}
