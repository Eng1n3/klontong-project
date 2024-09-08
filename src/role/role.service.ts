import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import {
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  Not,
  Repository,
} from 'typeorm';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PageParametersDto } from 'src/common/dto/page-parameters.dto';
import { Log } from 'src/log/entities/log.entity';
import { IValidateUser } from 'src/auth/interfaces/validate-user.interfaces';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(Log)
    private logRepo: Repository<Log>,
  ) {}

  async deleteRole(id: string, user: IValidateUser) {
    const isExist = await this.roleRepo.findOneBy({
      id,
    });
    if (!isExist) throw new NotFoundException('Data not found');
    await this.roleRepo.softDelete(id);
    const log = this.logRepo.create({
      action: 'delete',
      modifiedData: { id },
      tableName: this.roleRepo.metadata.tableName,
      modifiedBy: user.id,
    });
    await this.logRepo.save(log);
  }

  async updateRole(
    updateRoleDto: UpdateRoleDto & { id: string },
    user: IValidateUser,
  ) {
    const isExist = await this.roleRepo.findOneBy({
      id: updateRoleDto.id,
    });
    if (!isExist) throw new NotFoundException('Data not found');
    const isExistNames = await this.roleRepo.findBy({
      name: updateRoleDto.name.toLowerCase(),
      id: Not(updateRoleDto.id),
    });
    if (isExistNames.length)
      throw new BadRequestException('Role already exists');
    const role = this.roleRepo.create({
      ...isExist,
      ...updateRoleDto,
    });
    await this.roleRepo.save(role);
    const log = this.logRepo.create({
      action: 'update',
      modifiedData: role,
      tableName: this.roleRepo.metadata.tableName,
      modifiedBy: user.id,
    });
    await this.logRepo.save(log);
  }

  async findOneRole(id: string) {
    const role = await this.roleRepo.findOneBy({ id });
    return role;
  }

  async findAllRole(
    pageParametersDto: PageParametersDto & { orderBy: string },
  ) {
    const findOptionsWhere: FindOptionsWhere<Role> | FindOptionsWhere<Role>[] =
      pageParametersDto.search
        ? [
            { name: ILike(`%${pageParametersDto.search}%`) },
            { description: ILike(`%${pageParametersDto.search}%`) },
          ]
        : {};

    const order: FindOptionsOrder<Role> | null = pageParametersDto.orderBy
      ? {
          [pageParametersDto.orderBy]: {
            direction: pageParametersDto.direction
              ? pageParametersDto.direction
              : null,
          },
        }
      : null;

    const roles = await this.roleRepo.find({
      take: pageParametersDto.take,
      skip: pageParametersDto.skip,
      where: findOptionsWhere,
      order,
    });

    const itemCount = await this.roleRepo.count();

    const pageMetaDto = new PageMetaDto({ itemCount, pageParametersDto });

    return new PageDto(HttpStatus.OK, 'Success get roles', roles, pageMetaDto);
  }

  async createRole(createRoleDto: CreateRoleDto, user: IValidateUser) {
    const isExist = await this.roleRepo.findOneBy({
      name: createRoleDto.name,
    });
    if (isExist) throw new BadRequestException('Role already exists');
    const role = this.roleRepo.create(createRoleDto);
    await this.roleRepo.save(role);
    const log = this.logRepo.create({
      action: 'create',
      modifiedData: role,
      tableName: this.roleRepo.metadata.tableName,
      modifiedBy: user.id,
    });
    await this.logRepo.save(log);
  }
}
