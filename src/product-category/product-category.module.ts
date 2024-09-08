import { forwardRef, Module } from '@nestjs/common';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryService } from './product-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { ProductModule } from 'src/product/product.module';
import { Log } from 'src/log/entities/log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductCategory, Log]),
    forwardRef(() => ProductModule),
  ],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService],
})
export class ProductCategoryModule {}
