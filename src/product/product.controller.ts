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
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { ApiQuery } from '@nestjs/swagger';
import { ProductOrderBy } from './enum/product-order-by.enum';
import { PageParametersDto } from 'src/common/dto/page-parameters.dto';
import { OrderByValidationPipe } from 'src/common/pipes/order-by.pipe';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteProductCategory(@Param('id', ParseUUIDPipe) id: string) {
    await this.productService.deleteProduct(id);
    return {
      message: 'Success deleted product',
    };
  }

  @Patch(':id')
  @FormDataRequest()
  @HttpCode(HttpStatus.CREATED)
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    await this.productService.updateProduct({ ...createProductDto, id });
    return { message: 'Succes created product' };
  }

  @Get()
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
  @FormDataRequest()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() createProductDto: CreateProductDto) {
    await this.productService.createProduct(createProductDto);
    return { message: 'Succes created product' };
  }
}
