import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { UserBalance } from 'src/user-balance/entities/user-balance.entity';
import { Basket } from 'src/basket/entities/basket.entity';
import { BasketStatus } from 'src/basket-status/entities/basket-status.entity';
import { VirtualCode } from 'src/virtual-code/entities/virtual-code.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      User,
      Product,
      UserBalance,
      Basket,
      BasketStatus,
      VirtualCode,
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
