import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FindOptionsOrder, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { createFileFunction } from 'src/common/functions/create-file.function';
import { ProductCategory } from 'src/product-category/entities/product-category.entity';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageParametersDto } from 'src/common/dto/page-parameters.dto';
import { join } from 'path';
import { exists, rmSync } from 'fs';
import { CreateFile } from 'src/common/interfaces/create-file.interface';
import { File } from 'src/file/entities/file.entity';
import { IValidateUser } from 'src/auth/interfaces/validate-user.interfaces';
import { Log } from 'src/log/entities/log.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(File)
    private fileRepo: Repository<File>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(ProductCategory)
    private productCategoryRepo: Repository<ProductCategory>,
    @InjectRepository(Log)
    private logRepo: Repository<Log>,
  ) {}

  private generateSku(name: string, weight: number): string {
    const randomString = Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase();
    const productCode = name.replace(/\s+/g, '').substring(0, 3).toUpperCase(); // Ambil 3 huruf pertama dari nama produk
    const weightCode = weight.toString().padStart(3, '0'); // Berat produk sebagai kode (minimal 3 digit)

    return `${productCode}${weightCode}${randomString}`;
  }

  async deleteProduct(id: string, user: IValidateUser) {
    const isExist = await this.productRepo.findOne({
      where: {
        id,
      },
    });
    if (!isExist) throw new NotFoundException('Data not found');
    await this.productRepo.softDelete(id);
    await this.fileRepo.softDelete(isExist.fileId);
    const logFile = this.logRepo.create({
      action: 'update',
      modifiedData: { id: isExist.fileId },
      tableName: this.fileRepo.metadata.tableName,
      modifiedBy: user.id,
    });
    const logProduct = this.logRepo.create({
      action: 'update',
      modifiedData: { id },
      tableName: this.productRepo.metadata.tableName,
      modifiedBy: user.id,
    });
    await this.logRepo.save([logFile, logProduct]);
  }

  async findOneProduct(id: string) {
    const role = await this.productRepo.findOne({
      where: { id },
      relations: { productCategory: true, file: true },
    });
    return role;
  }

  async findAllProduct(
    pageParametersDto: PageParametersDto & { orderBy: string },
  ) {
    const findOptionsWhere:
      | FindOptionsWhere<Product>
      | FindOptionsWhere<Product>[] = pageParametersDto.search
      ? [
          { name: ILike(`%${pageParametersDto.search}%`) },
          { description: ILike(`%${pageParametersDto.search}%`) },
        ]
      : {};

    const order: FindOptionsOrder<Product> | null = pageParametersDto.orderBy
      ? {
          [pageParametersDto.orderBy]: {
            direction: pageParametersDto.direction
              ? pageParametersDto.direction
              : null,
          },
        }
      : null;

    const products = await this.productRepo.find({
      take: pageParametersDto.take,
      skip: pageParametersDto.skip,
      where: findOptionsWhere,
      order,
      relations: { productCategory: true, file: true },
    });

    const itemCount = await this.productRepo.count();

    const pageMetaDto = new PageMetaDto({ itemCount, pageParametersDto });

    return new PageDto(
      HttpStatus.OK,
      'Success get product',
      products,
      pageMetaDto,
    );
  }

  async updateProduct(
    updateProductDto: UpdateProductDto & { id: string },
    user: IValidateUser,
  ) {
    let createFile: CreateFile;
    let sku: string;
    const imageDto = updateProductDto.image;
    if (!imageDto) throw new BadRequestException('file not found!');
    const isExist = await this.productRepo.findOne({
      where: {
        id: updateProductDto.id,
      },
      relations: { file: true },
    });
    if (!isExist) throw new NotFoundException('Data not found');
    if (imageDto) {
      createFile = await createFileFunction(imageDto, 'product-images');
      rmSync(join(process.cwd(), isExist.file.path), {
        recursive: true,
        force: true,
      });
    }
    if (updateProductDto.name && updateProductDto.weight) {
      sku = this.generateSku(updateProductDto.name, updateProductDto.weight);
    }
    const isExistsCategory = await this.productCategoryRepo.findOneBy({
      id: updateProductDto.productCategoryId,
    });
    if (!isExistsCategory) throw new NotFoundException('category not found');
    const productCreate = this.productRepo.create({
      ...updateProductDto,
      sku: sku ? sku : undefined,
      file: createFile
        ? {
            caption: createFile.originalFilename,
            isMain: true,
            mimeType: createFile.mime,
            path: createFile.path,
            size: createFile.size,
            checksum: createFile.checksum,
          }
        : undefined,
    });
    const product = this.productRepo.create(productCreate);
    await this.productRepo.save(product);
    const logFile = this.logRepo.create({
      action: 'update',
      modifiedData: createFile || undefined,
      tableName: this.fileRepo.metadata.tableName,
      modifiedBy: user.id,
    });
    const logProduct = this.logRepo.create({
      action: 'update',
      modifiedData: product,
      tableName: this.productRepo.metadata.tableName,
      modifiedBy: user.id,
    });
    await this.logRepo.save([logFile, logProduct]);
  }

  async createProduct(createProductDto: CreateProductDto, user: IValidateUser) {
    const imageDto = createProductDto.image;
    if (!imageDto) throw new BadRequestException('file not found!');
    const fileValue = await createFileFunction(imageDto, 'product-images');
    const sku = this.generateSku(
      createProductDto.name,
      createProductDto.weight,
    );
    const isExistsCategory = await this.productCategoryRepo.findOneBy({
      id: createProductDto.productCategoryId,
    });
    if (!isExistsCategory) throw new NotFoundException('category not found');
    const productCreate = this.productRepo.create({
      ...createProductDto,
      sku,
      file: {
        caption: fileValue.originalFilename,
        isMain: true,
        mimeType: fileValue.mime,
        path: fileValue.path,
        size: fileValue.size,
        checksum: fileValue.checksum,
      },
    });
    const product = this.productRepo.create(productCreate);
    await this.productRepo.save(product);
    const logFile = this.logRepo.create({
      action: 'create',
      modifiedData: fileValue,
      tableName: this.fileRepo.metadata.tableName,
      modifiedBy: user.id,
    });
    const logProduct = this.logRepo.create({
      action: 'create',
      modifiedData: product,
      tableName: this.productRepo.metadata.tableName,
      modifiedBy: user.id,
    });
    await this.logRepo.save([logFile, logProduct]);
  }
}
