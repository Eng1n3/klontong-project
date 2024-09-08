import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBasketStatusDto } from './dto/create-basket-status.dto';
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
import { BasketStatus } from './entities/basket-status.entity';
import { PageParametersDto } from 'src/common/dto/page-parameters.dto';
import { UpdateBasketStatusDto } from './dto/update-basket-status.dto';
import { Log } from 'src/log/entities/log.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BasketStatusService {
  constructor(
    @InjectRepository(BasketStatus)
    private basketStatusRepo: Repository<BasketStatus>,
    @InjectRepository(Log)
    private logRepo: Repository<Log>,
  ) {}

  async deleteBasketStatus(id: string, user: IValidateUser) {
    const isExist = await this.basketStatusRepo.findOneBy({
      id,
    });
    if (!isExist) throw new NotFoundException('Data not found');
    await this.basketStatusRepo.softDelete(id);
    const log = this.logRepo.create({
      action: 'delete',
      modifiedData: { id },
      tableName: this.basketStatusRepo.metadata.tableName,
      modifiedBy: user.id,
    });
    await this.logRepo.save(log);
  }

  async updateBasketStatus(
    updateBasketStatusDto: UpdateBasketStatusDto & { id: string },
    user: IValidateUser,
  ) {
    const isExist = await this.basketStatusRepo.findOneBy({
      id: updateBasketStatusDto.id,
    });
    if (!isExist) throw new NotFoundException('Data not found');
    const isExistNames = await this.basketStatusRepo.findBy({
      name: updateBasketStatusDto.name.toLowerCase(),
      id: Not(updateBasketStatusDto.id),
    });
    if (isExistNames.length)
      throw new BadRequestException('Basket status already exists');
    const basketStatus = this.basketStatusRepo.create({
      ...isExist,
      ...updateBasketStatusDto,
    });
    await this.basketStatusRepo.save(basketStatus);
    const log = this.logRepo.create({
      action: 'update',
      modifiedData: basketStatus,
      tableName: this.basketStatusRepo.metadata.tableName,
      modifiedBy: user.id,
    });
    await this.logRepo.save(log);
  }

  async findOneBasketStatus(id: string) {
    const role = await this.basketStatusRepo.findOneBy({ id });
    return role;
  }

  async findAllBasketStatus(
    pageParametersDto: PageParametersDto & { orderBy: string },
  ) {
    const findOptionsWhere:
      | FindOptionsWhere<BasketStatus>
      | FindOptionsWhere<BasketStatus>[] = pageParametersDto.search
      ? [
          { name: ILike(`%${pageParametersDto.search}%`) },
          { description: ILike(`%${pageParametersDto.search}%`) },
        ]
      : {};

    const order: FindOptionsOrder<BasketStatus> | null =
      pageParametersDto.orderBy
        ? {
            [pageParametersDto.orderBy]: {
              direction: pageParametersDto.direction
                ? pageParametersDto.direction
                : null,
            },
          }
        : null;

    const status = await this.basketStatusRepo.find({
      take: pageParametersDto.take,
      skip: pageParametersDto.skip,
      where: findOptionsWhere,
      order,
    });

    const itemCount = await this.basketStatusRepo.count();

    const pageMetaDto = new PageMetaDto({ itemCount, pageParametersDto });

    return new PageDto(
      HttpStatus.OK,
      'Success get status',
      status,
      pageMetaDto,
    );
  }

  async createBasketStatus(
    createBasketStatusDto: CreateBasketStatusDto,
    user: IValidateUser,
  ) {
    const isExist = await this.basketStatusRepo.findOneBy({
      name: createBasketStatusDto.name,
    });
    if (isExist) throw new BadRequestException('Basket status already exists');
    const basketStatus = this.basketStatusRepo.create(createBasketStatusDto);
    await this.basketStatusRepo.save(basketStatus);
    const log = this.logRepo.create({
      action: 'create',
      modifiedData: basketStatus,
      tableName: this.basketStatusRepo.metadata.tableName,
      modifiedBy: user.id,
    });
    await this.logRepo.save(log);
  }
}
