import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product-category.entity';
import {
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  Not,
  Repository,
} from 'typeorm';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { PageParametersDto } from 'src/common/dto/page-parameters.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { IValidateUser } from 'src/auth/interfaces/validate-user.interfaces';
import { Log } from 'src/log/entities/log.entity';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoryRepo: Repository<ProductCategory>,
    @InjectRepository(Log)
    private logRepo: Repository<Log>,
  ) {}

  async deleteProductCategory(id: string, user: IValidateUser) {
    const isExist = await this.productCategoryRepo.findOneBy({
      id,
    });
    if (!isExist) throw new NotFoundException('Data not found');
    await this.productCategoryRepo.softDelete(id);
    const log = this.logRepo.create({
      action: 'delete',
      modifiedData: { id },
      tableName: this.productCategoryRepo.metadata.tableName,
      modifiedBy: user.id,
    });
    await this.logRepo.save(log);
  }

  async updateProductCategory(
    updateProductCategoryDto: UpdateProductCategoryDto & { id: string },
    user: IValidateUser,
  ) {
    const isExist = await this.productCategoryRepo.findOneBy({
      id: updateProductCategoryDto.id,
    });
    if (!isExist) throw new NotFoundException('Data not found');
    const isExistNames = await this.productCategoryRepo.findBy({
      name: updateProductCategoryDto.name.toLowerCase(),
      id: Not(updateProductCategoryDto.id),
    });
    if (isExistNames.length)
      throw new BadRequestException('Category already exists');
    const productCategory = this.productCategoryRepo.create({
      ...isExist,
      ...updateProductCategoryDto,
    });
    await this.productCategoryRepo.save(productCategory);
    const log = this.logRepo.create({
      action: 'update',
      modifiedData: productCategory,
      tableName: this.productCategoryRepo.metadata.tableName,
      modifiedBy: user.id,
    });
    await this.logRepo.save(log);
  }

  async findOneProductCategory(id: string) {
    const role = await this.productCategoryRepo.findOneBy({ id });
    return role;
  }

  async findAllProductCategory(
    pageParametersDto: PageParametersDto & { orderBy: string },
  ) {
    const findOptionsWhere:
      | FindOptionsWhere<ProductCategory>
      | FindOptionsWhere<ProductCategory>[] = pageParametersDto.search
      ? [
          { name: ILike(`%${pageParametersDto.search}%`) },
          { description: ILike(`%${pageParametersDto.search}%`) },
        ]
      : {};

    const order: FindOptionsOrder<ProductCategory> | null =
      pageParametersDto.orderBy
        ? {
            [pageParametersDto.orderBy]: {
              direction: pageParametersDto.direction
                ? pageParametersDto.direction
                : null,
            },
          }
        : null;

    const categories = await this.productCategoryRepo.find({
      take: pageParametersDto.take,
      skip: pageParametersDto.skip,
      where: findOptionsWhere,
      order,
    });

    const itemCount = await this.productCategoryRepo.count();

    const pageMetaDto = new PageMetaDto({ itemCount, pageParametersDto });

    return new PageDto(
      HttpStatus.OK,
      'Success get categories',
      categories,
      pageMetaDto,
    );
  }

  async createProductCategory(
    createProductCategoryDto: CreateProductCategoryDto,
    user: IValidateUser,
  ) {
    const isExist = await this.productCategoryRepo.findOneBy({
      name: createProductCategoryDto.name,
    });
    if (isExist) throw new BadRequestException('Category already exists');
    const productCategory = this.productCategoryRepo.create(
      createProductCategoryDto,
    );
    await this.productCategoryRepo.save(productCategory);
    const log = this.logRepo.create({
      action: 'create',
      modifiedData: productCategory,
      tableName: this.productCategoryRepo.metadata.tableName,
      modifiedBy: user.id,
    });
    await this.logRepo.save(log);
  }
}
