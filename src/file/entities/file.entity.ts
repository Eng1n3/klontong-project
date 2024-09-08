import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'files' })
export class File {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_files',
  })
  id: string;

  @Column({
    name: 'path',
  })
  path: string;

  @Column({
    name: 'caption',
    type: 'varchar',
    length: 100,
  })
  caption: string;

  @Column({
    name: 'mime_type',
  })
  mimeType: string;

  @Column({
    type: 'float',
    name: 'size',
  })
  size: number;

  @Column({
    name: 'checksum',
  })
  checksum: string;

  @Column({
    name: 'is_main',
    type: 'boolean',
  })
  isMain: boolean;

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

  @OneToMany((type) => User, (user) => user.file)
  user?: User[];

  @OneToMany((type) => Product, (product) => product.file)
  product?: Product[];
}
