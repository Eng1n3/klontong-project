import { Module } from '@nestjs/common';
import { BasketStatusController } from './basket-status.controller';
import { BasketStatusService } from './basket-status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketStatus } from './entities/basket-status.entity';
import { Log } from 'src/log/entities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BasketStatus, Log])],
  controllers: [BasketStatusController],
  providers: [BasketStatusService],
})
export class BasketStatusModule {}
