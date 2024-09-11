import { ConfigService } from '@nestjs/config';
import { Exclude, Expose } from 'class-transformer';
import { File } from 'src/file/entities/file.entity';
import { Log } from 'src/log/entities/log.entity';
import { UserBalance } from 'src/user-balance/entities/user-balance.entity';
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

const configService = new ConfigService()

@Entity('users')
export class User {
    
  @Exclude()
  @Column({ name: 'file_id', nullable: true })
  fileId?: string;

  @Exclude()
  @ManyToOne(() => File, (file) => file.user, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'file_id',
    foreignKeyConstraintName: 'FK_user_files',
  })
  file?: File;

  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_user',
  })
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 100, nullable: true })
  phoneNumber?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
  deletedAt: Date;

  @OneToMany((type) => Log, (log) => log.user)
  log?: Log[];

  @OneToMany((type) => UserRole, (userRole) => userRole.user)
  userRole?: UserRole[];

  @OneToMany((type) => UserBalance, (userBalance) => userBalance.user)
  userBalance?: UserBalance;

  @Expose({ name: 'image' })
  get imagePath(): string {
    return `${configService.get('BASE_URL_APP')}/${this.file.path}`
  }

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
