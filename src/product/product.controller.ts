import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { ApiQuery } from '@nestjs/swagger';
import { ProductOrderBy } from './enum/product-order-by.enum';
import { PageParametersDto } from 'src/common/dto/page-parameters.dto';
import { OrderByValidationPipe } from 'src/common/pipes/order-by.pipe';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { IValidateUser } from 'src/auth/interfaces/validate-user.interfaces';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Delete(':id')
  @Roles(Role.SUPERUSER, Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteProductCategory(
    @CurrentUser() user: IValidateUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.productService.deleteProduct(id, user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Success deleted product',
    };
  }

  @Patch(':id')
  @Roles(Role.SUPERUSER, Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @FormDataRequest()
  @HttpCode(HttpStatus.CREATED)
  async updateProduct(
    @CurrentUser() user: IValidateUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    await this.productService.updateProduct({ ...updateProductDto, id }, user);
    return { statusCode: HttpStatus.OK, message: 'Succes updated product' };
  }

  @Get(':id')
  @Roles(Role.SUPERUSER, Role.ADMIN, Role.USER)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async findOneProductCategory(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.productService.findOneProduct(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Success get product',
      data,
    };
  }

  @Get()
  @Roles(Role.SUPERUSER, Role.ADMIN, Role.USER)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiQuery({ name: 'order_by', enum: ProductOrderBy })
  async findAllProductCategory(
    @Query() pageParametersDto: PageParametersDto,
    @Query('order_by', new OrderByValidationPipe(ProductOrderBy))
    orderBy?: string,
  ) {
    return await this.productService.findAllProduct({
      skip: pageParametersDto.skip,
      ...pageParametersDto,
      orderBy,
    });
  }

  @Post()
  @Roles(Role.SUPERUSER, Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @FormDataRequest()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(
    @CurrentUser() user: IValidateUser,
    @Body() createProductDto: CreateProductDto,
  ) {
    await this.productService.createProduct(createProductDto, user);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Succes created product',
    };
  }
}
