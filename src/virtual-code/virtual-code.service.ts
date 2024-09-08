import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVirtualCodeDto } from './dto/create-virtual-code.dto';
import { IValidateUser } from 'src/auth/interfaces/validate-user.interfaces';
import { PageDto } from 'src/common/dto/page.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import {
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  Not,
  Repository,
} from 'typeorm';
import { VirtualCode } from './entities/virtual-code.entity';
import { PageParametersDto } from 'src/common/dto/page-parameters.dto';
import { UpdateVirtualCodeDto } from './dto/update-virtual-code.dto';
import { Log } from 'src/log/entities/log.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VirtualCodeService {
  constructor(
    @InjectRepository(VirtualCode)
    private virtualCodeRepo: Repository<VirtualCode>,
    @InjectRepository(Log)
    private logRepo: Repository<Log>,
  ) {}

  async deleteVirtualCode(id: string, user: IValidateUser) {
    const isExist = await this.virtualCodeRepo.findOneBy({
      id,
    });
    if (!isExist) throw new NotFoundException('Data not found');
    await this.virtualCodeRepo.softDelete(id);
    const log = this.logRepo.create({
      action: 'delete',
      modifiedData: { id },
      tableName: this.virtualCodeRepo.metadata.tableName,
      modifiedBy: user.id,
    });
    await this.logRepo.save(log);
  }

  async updateVirtualCode(
    updateVirtualCodeDto: UpdateVirtualCodeDto & { id: string },
    user: IValidateUser,
  ) {
    const isExist = await this.virtualCodeRepo.findOneBy({
      id: updateVirtualCodeDto.id,
    });
    if (!isExist) throw new NotFoundException('Data not found');
    const isExistNames = await this.virtualCodeRepo.findBy({
      name: updateVirtualCodeDto.name.toLowerCase(),
      id: Not(updateVirtualCodeDto.id),
    });
    if (isExistNames.length)
      throw new BadRequestException('Virtual code already exists');
    const virtualCode = this.virtualCodeRepo.create({
      ...isExist,
      ...updateVirtualCodeDto,
    });
    await this.virtualCodeRepo.save(virtualCode);
    const log = this.logRepo.create({
      action: 'update',
      modifiedData: virtualCode,
      tableName: this.virtualCodeRepo.metadata.tableName,
      modifiedBy: user.id,
    });
    await this.logRepo.save(log);
  }

  async findOneVirtualCode(id: string) {
    const role = await this.virtualCodeRepo.findOneBy({ id });
    return role;
  }

  async findAllVirtualCode(
    pageParametersDto: PageParametersDto & { orderBy: string },
  ) {
    const findOptionsWhere:
      | FindOptionsWhere<VirtualCode>
      | FindOptionsWhere<VirtualCode>[] = pageParametersDto.search
      ? [{ name: ILike(`%${pageParametersDto.search}%`) }]
      : {};

    const order: FindOptionsOrder<VirtualCode> | null =
      pageParametersDto.orderBy
        ? {
            [pageParametersDto.orderBy]: {
              direction: pageParametersDto.direction
                ? pageParametersDto.direction
                : null,
            },
          }
        : null;

    const status = await this.virtualCodeRepo.find({
      take: pageParametersDto.take,
      skip: pageParametersDto.skip,
      where: findOptionsWhere,
      order,
    });

    const itemCount = await this.virtualCodeRepo.count();

    const pageMetaDto = new PageMetaDto({ itemCount, pageParametersDto });

    return new PageDto(
      HttpStatus.OK,
      'Success get status',
      status,
      pageMetaDto,
    );
  }

  async createVirtualCode(
    createVirtualCodeDto: CreateVirtualCodeDto,
    user: IValidateUser,
  ) {
    const isExist = await this.virtualCodeRepo.findOneBy({
      name: createVirtualCodeDto.name,
    });
    if (isExist) throw new BadRequestException('Virtual code already exists');
    const virtualCode = this.virtualCodeRepo.create(createVirtualCodeDto);
    await this.virtualCodeRepo.save(virtualCode);
    const log = this.logRepo.create({
      action: 'create',
      modifiedData: virtualCode,
      tableName: this.virtualCodeRepo.metadata.tableName,
      modifiedBy: user.id,
    });
    await this.logRepo.save(log);
  }
}
