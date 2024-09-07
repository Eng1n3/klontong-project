import {
  BadRequestException,
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
import { ProductCategoryOrderBy } from './enum/order-by.enum';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoryRepo: Repository<ProductCategory>,
  ) {}

  async deleteProductCategory(id: string) {
    const isExist = await this.productCategoryRepo.findOneBy({
      id,
    });
    if (!isExist) throw new NotFoundException('Data not found');
    await this.productCategoryRepo.softDelete(id);
  }

  async updateProductCategory(
    updateProductCategoryDto: UpdateProductCategoryDto & { id: string },
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
      take: pageParametersDto.skip,
      skip: pageParametersDto.skip,
      where: findOptionsWhere,
      order,
    });

    const itemCount = await this.productCategoryRepo.count();

    const pageMetaDto = new PageMetaDto({ itemCount, pageParametersDto });

    return new PageDto(categories, pageMetaDto, 'Success get categories');
  }

  async createProductCategory(
    createProductCategoryDto: CreateProductCategoryDto,
  ) {
    const isExist = await this.productCategoryRepo.findOneBy({
      name: createProductCategoryDto.name,
    });    
    if (isExist) throw new BadRequestException('Category already exists');
    const productCategory = this.productCategoryRepo.create(
      createProductCategoryDto,
    );
    await this.productCategoryRepo.save(productCategory);
  }
}
