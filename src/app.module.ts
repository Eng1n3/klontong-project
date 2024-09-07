import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/data-source';
import { ProductCategoryModule } from './product-category/product-category.module';
import { ProductImageModule } from './product-image/product-image.module';
import pathEnv from './common/config/config.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: pathEnv,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    ProductModule,
    ProductCategoryModule,
    ProductImageModule,
  ],
})
export class AppModule {}
