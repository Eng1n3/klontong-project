import {
  Body,
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
} from '@nestjs/common';
import { CreateBasketStatusDto } from './dto/create-basket-status.dto';
import { IValidateUser } from 'src/auth/interfaces/validate-user.interfaces';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/auth/enum/roles.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PageParametersDto } from 'src/common/dto/page-parameters.dto';
import { OrderByValidationPipe } from 'src/common/pipes/order-by.pipe';
import { BasketStatusOrderBy } from './enum/basket-status-order-by.enum';
import { ApiQuery } from '@nestjs/swagger';
import { UpdateBasketStatusDto } from './dto/update-basket-status.dto';
import { BasketStatusService } from './basket-status.service';

@Controller('basket-status')
export class BasketStatusController {
  constructor(private virtualCodeService: BasketStatusService) {}

  @Delete(':id')
  @Roles(Role.SUPERUSER, Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteBasketStatus(
    @CurrentUser() user: IValidateUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.virtualCodeService.deleteBasketStatus(id, user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Success deleted basket status',
    };
  }

  @Patch(':id')
  @Roles(Role.SUPERUSER, Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateBasketStatus(
    @CurrentUser() user: IValidateUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBasketStatusDto: UpdateBasketStatusDto,
  ) {
    await this.virtualCodeService.updateBasketStatus(
      {
        ...updateBasketStatusDto,
        id,
      },
      user,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Success updated basket status',
    };
  }

  @Get(':id')
  @Roles(Role.SUPERUSER, Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findOneBasketStatus(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.virtualCodeService.findOneBasketStatus(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Success get basket status',
      data,
    };
  }

  @Get()
  @Roles(Role.SUPERUSER, Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'order_by', enum: BasketStatusOrderBy })
  async findAllBasketStatus(
    @Query() pageParametersDto: PageParametersDto,
    @Query('order_by', new OrderByValidationPipe(BasketStatusOrderBy))
    orderBy?: string,
  ) {
    return await this.virtualCodeService.findAllBasketStatus({
      skip: pageParametersDto.skip,
      ...pageParametersDto,
      orderBy,
    });
  }

  @Post()
  @Roles(Role.SUPERUSER, Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createBasketStatus(
    @CurrentUser() user: IValidateUser,
    @Body() createBasketStatusDto: CreateBasketStatusDto,
  ) {
    await this.virtualCodeService.createBasketStatus(
      createBasketStatusDto,
      user,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Succes created basket status',
    };
  }
}
