import { Injectable, NotFoundException } from '@nestjs/common';
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
import { rmSync } from 'fs';
import { CreateFile } from 'src/common/interfaces/create-file.interface';
import { File } from 'src/file/entities/file.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(File)
    private fileRepo: Repository<File>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(ProductCategory)
    private productCategoryRepo: Repository<ProductCategory>,
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

  async deleteProduct(id: string) {
    const isExist = await this.productRepo.findOne({
      where: {
        id,
      },
    });
    if (!isExist) throw new NotFoundException('Data not found');
    await this.productRepo.softDelete(id);
    await this.fileRepo.softDelete(isExist.fileId);
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
      take: pageParametersDto.skip,
      skip: pageParametersDto.skip,
      where: findOptionsWhere,
      order,
      relations: { productCategory: true, file: true },
    });

    const itemCount = await this.productRepo.count();

    const pageMetaDto = new PageMetaDto({ itemCount, pageParametersDto });

    return new PageDto(products, pageMetaDto, 'Success get product');
  }

  async updateProduct(createProductDto: CreateProductDto & { id: string }) {
    let createFile: CreateFile;
    let sku: string;
    const imageDto = createProductDto.image;
    const isExist = await this.productRepo.findOne({
      where: {
        id: createProductDto.id,
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
    if (createProductDto.name && createProductDto.weight) {
      sku = this.generateSku(createProductDto.name, createProductDto.weight);
    }
    const isExistsCategory = await this.productCategoryRepo.findOneBy({
      id: createProductDto.productCategoryId,
    });
    if (!isExistsCategory) throw new NotFoundException('category not found');
    const productCreate = this.productRepo.create({
      ...createProductDto,
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
  }

  async createProduct(createProductDto: CreateProductDto) {
    const imageDto = createProductDto.image;
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
  }
}
