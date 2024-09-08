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
import { RoleService } from './role.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PageParametersDto } from 'src/common/dto/page-parameters.dto';
import { RoleOrderBy } from './enum/role-order-by.enum';
import { ApiQuery } from '@nestjs/swagger';
import { OrderByValidationPipe } from 'src/common/pipes/order-by.pipe';
import { CreateRoleDto } from './dto/create-role.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/roles.enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { IValidateUser } from 'src/auth/interfaces/validate-user.interfaces';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Delete(':id')
  @Roles(Role.SUPERUSER)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteRole(
    @CurrentUser() user: IValidateUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.roleService.deleteRole(id, user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Success deleted role',
    };
  }

  @Patch(':id')
  @Roles(Role.SUPERUSER)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateRole(
    @CurrentUser() user: IValidateUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    await this.roleService.updateRole(
      {
        ...updateRoleDto,
        id,
      },
      user,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Success updated role',
    };
  }

  @Get(':id')
  @Roles(Role.SUPERUSER)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findOneRole(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.roleService.findOneRole(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Success get role',
      data,
    };
  }

  @Get()
  @Roles(Role.SUPERUSER)
  @UseGuards(JwtAuthGuard)
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
  @Roles(Role.SUPERUSER)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createRole(
    @Body() createRoleDto: CreateRoleDto,
    @CurrentUser() user: IValidateUser,
  ) {
    await this.roleService.createRole(createRoleDto, user);
    return { statusCode: HttpStatus.CREATED, message: 'Succes created role' };
  }
}
