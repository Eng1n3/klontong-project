import { Module } from '@nestjs/common';
import { VirtualCodeController } from './virtual-code.controller';
import { VirtualCodeService } from './virtual-code.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VirtualCode } from './entities/virtual-code.entity';
import { Log } from 'src/log/entities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VirtualCode, Log])],
  controllers: [VirtualCodeController],
  providers: [VirtualCodeService]
})
export class VirtualCodeModule {}
