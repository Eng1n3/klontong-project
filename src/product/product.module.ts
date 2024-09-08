import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductCategory } from 'src/product-category/entities/product-category.entity';
import { File } from 'src/file/entities/file.entity';
import { Log } from 'src/log/entities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, File, ProductCategory, Log])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
