import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VirtualCode } from './entities/virtual-code.entity';
import { Log } from 'src/log/entities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VirtualCode, Log])]
})
export class VirtualCodeModule {}
