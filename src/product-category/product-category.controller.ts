import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { ProductCategoryService } from './product-category.service';
import { PageParametersDto } from 'src/common/dto/page-parameters.dto';
import { OrderByValidationPipe } from 'src/common/pipes/order-by.pipe';
import { ProductCategoryOrderBy } from './enum/product-category-order-by.enum';
import { ApiQuery } from '@nestjs/swagger';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IValidateUser } from 'src/auth/interfaces/validate-user.interfaces';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('product-category')
export class ProductCategoryController {
  constructor(private productCategoryService: ProductCategoryService) {}

  @Delete(':id')
  @Roles(Role.SUPERUSER, Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteProductCategory(
    @CurrentUser() user: IValidateUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.productCategoryService.deleteProductCategory(id, user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Success deleted category',
    };
  }

  @Patch(':id')
  @Roles(Role.SUPERUSER, Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProductCategory(
    @CurrentUser() user: IValidateUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ) {
    await this.productCategoryService.updateProductCategory(
      {
        ...updateProductCategoryDto,
        id,
      },
      user,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Success updated category',
    };
  }

  @Get(':id')
  @Roles(Role.SUPERUSER, Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findOneProductCategory(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.productCategoryService.findOneProductCategory(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Success get category',
      data,
    };
  }

  @Get()
  @Roles(Role.SUPERUSER, Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'order_by', enum: ProductCategoryOrderBy })
  async findAllProductCategory(
    @Query() pageParametersDto: PageParametersDto,
    @Query('order_by', new OrderByValidationPipe(ProductCategoryOrderBy))
    orderBy?: string,
  ) {
    return await this.productCategoryService.findAllProductCategory({
      skip: pageParametersDto.skip,
      ...pageParametersDto,
      orderBy,
    });
  }

  @Post()
  @Roles(Role.SUPERUSER, Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createProductCategory(
    @CurrentUser() user: IValidateUser,
    @Body() createProductCategoryDto: CreateProductCategoryDto,
  ) {
    await this.productCategoryService.createProductCategory(
      createProductCategoryDto,
      user,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Succes created category',
    };
  }
}
