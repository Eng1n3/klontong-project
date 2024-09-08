import {
  BadRequestException,
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

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}

  async deleteRole(id: string) {
    const isExist = await this.roleRepo.findOneBy({
      id,
    });
    if (!isExist) throw new NotFoundException('Data not found');
    await this.roleRepo.softDelete(id);
  }

  async updateRole(updateRoleDto: UpdateRoleDto & { id: string }) {
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
      take: pageParametersDto.skip,
      skip: pageParametersDto.skip,
      where: findOptionsWhere,
      order,
    });

    const itemCount = await this.roleRepo.count();

    const pageMetaDto = new PageMetaDto({ itemCount, pageParametersDto });

    return new PageDto(roles, pageMetaDto, 'Success get roles');
  }

  async createRole(createRoleDto: CreateRoleDto) {
    const isExist = await this.roleRepo.findOneBy({
      name: createRoleDto.name,
    });
    if (isExist) throw new BadRequestException('Role already exists');
    const role = this.roleRepo.create(createRoleDto);
    await this.roleRepo.save(role);
  }
}
