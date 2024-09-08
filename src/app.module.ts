import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/data-source';
import { ProductCategoryModule } from './product-category/product-category.module';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { ConfigModule } from './config/config.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { UserRoleModule } from './user-role/user-role.module';
import { FileModule } from './file/file.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [
    ConfigModule.register(),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    NestjsFormDataModule.config({
      storage: MemoryStoredFile,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    ProductModule,
    ProductCategoryModule,
    ConfigModule,
    UserModule,
    RoleModule,
    UserRoleModule,
    FileModule,
    LogModule,
  ],
})
export class AppModule {}
