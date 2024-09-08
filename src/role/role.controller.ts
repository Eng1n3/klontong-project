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
} from '@nestjs/common';
import { RoleService } from './role.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PageParametersDto } from 'src/common/dto/page-parameters.dto';
import { RoleOrderBy } from './enum/role-order-by.enum';
import { ApiQuery } from '@nestjs/swagger';
import { OrderByValidationPipe } from 'src/common/pipes/order-by.pipe';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteRole(@Param('id', ParseUUIDPipe) id: string) {
    await this.roleService.deleteRole(id);
    return {
      message: 'Success deleted role',
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    await this.roleService.updateRole({
      ...updateRoleDto,
      id,
    });
    return {
      message: 'Success updated role',
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneRole(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.roleService.findOneRole(id);
    return {
      message: 'Success get role',
      data
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'order_by', enum: RoleOrderBy })
  async findAllRole(
    @Query() pageParametersDto: PageParametersDto,
    @Query('order_by', new OrderByValidationPipe(RoleOrderBy))
    orderBy?: string,
  ) {
    return await this.roleService.findAllRole({
      skip: pageParametersDto.skip,
      ...pageParametersDto,
      orderBy,
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    await this.roleService.createRole(createRoleDto);
    return { message: 'Succes created role' };
  }
}
