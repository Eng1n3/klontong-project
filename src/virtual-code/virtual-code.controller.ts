import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateVirtualCodeDto } from './dto/create-virtual-code.dto';
import { IValidateUser } from 'src/auth/interfaces/validate-user.interfaces';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/auth/enum/roles.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PageParametersDto } from 'src/common/dto/page-parameters.dto';
import { OrderByValidationPipe } from 'src/common/pipes/order-by.pipe';
import { VirtualCodeOrderBy } from './enum/virtual-code-order-by.enum';
import { ApiQuery } from '@nestjs/swagger';
import { UpdateVirtualCodeDto } from './dto/update-virtual-code.dto';
import { VirtualCodeService } from './virtual-code.service';

@Controller('virtual-code')
export class VirtualCodeController {
    constructor(private virtualCodeService: VirtualCodeService) {}

  @Delete(':id')
  @Roles(Role.SUPERUSER, Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteVirtualCode(
    @CurrentUser() user: IValidateUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.virtualCodeService.deleteVirtualCode(id, user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Success deleted virtual code',
    };
  }

  @Patch(':id')
  @Roles(Role.SUPERUSER, Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateVirtualCode(
    @CurrentUser() user: IValidateUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVirtualCodeDto: UpdateVirtualCodeDto,
  ) {
    await this.virtualCodeService.updateVirtualCode(
      {
        ...updateVirtualCodeDto,
        id,
      },
      user,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Success updated virtual code',
    };
  }

  @Get(':id')
  @Roles(Role.SUPERUSER, Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findOneVirtualCode(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.virtualCodeService.findOneVirtualCode(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Success get virtual code',
      data,
    };
  }

  @Get()
  @Roles(Role.SUPERUSER, Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'order_by', enum: VirtualCodeOrderBy })
  async findAllVirtualCode(
    @Query() pageParametersDto: PageParametersDto,
    @Query('order_by', new OrderByValidationPipe(VirtualCodeOrderBy))
    orderBy?: string,
  ) {
    return await this.virtualCodeService.findAllVirtualCode({
      skip: pageParametersDto.skip,
      ...pageParametersDto,
      orderBy,
    });
  }

  @Post()
  @Roles(Role.SUPERUSER, Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createVirtualCode(
    @CurrentUser() user: IValidateUser,
    @Body() createVirtualCodeDto: CreateVirtualCodeDto,
  ) {
    await this.virtualCodeService.createVirtualCode(
      createVirtualCodeDto,
      user,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Succes created virtual code',
    };
  }
}
