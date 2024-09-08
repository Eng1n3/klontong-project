import { Exclude, Expose } from 'class-transformer';
import { File } from 'src/file/entities/file.entity';
import { UserRole } from 'src/user-role/entities/user-role.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
    
  @Exclude()
  @Column({ name: 'file_id' })
  fileId: string;

  @Exclude()
  @ManyToOne(() => File, (file) => file.user, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'file_id',
    foreignKeyConstraintName: 'FK_user_files',
  })
  file: File;

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_user',
  })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 100 })
  phoneNumber: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
  deletedAt: Date;

  @OneToMany((type) => UserRole, (userRole) => userRole.user)
  userRole?: UserRole[];
}
