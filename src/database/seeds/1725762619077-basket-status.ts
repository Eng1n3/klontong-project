import { DataSource } from 'typeorm';
import { Seeder } from '@jorgebodega/typeorm-seeding';
import { SeederEntity } from 'src/seeder/entities/seeder.entity';
import { BasketStatus } from 'src/basket-status/entities/basket-status.entity';

export default class BasketStatus1725762619077 extends Seeder {
  public async run(datasource: DataSource): Promise<void> {
    const dataSeeder = await datasource
      .getRepository(SeederEntity)
      .find({ where: { name: BasketStatus1725762619077.name } });
    if (!dataSeeder.length) {
      const userRole: BasketStatus[] = datasource
        .getRepository(BasketStatus)
        .create([
          {
            name: 'basket',
            description: 'product in basket',
          },
          {
            name: 'shipping',
            description: 'product in ship',
          },
          {
            name: 'finished',
            description: 'finish product',
          },
        ]);
      const value = datasource
        .createEntityManager()
        .getRepository(BasketStatus)
        .create(userRole);
      await datasource.createEntityManager().save<BasketStatus>(value);
      await datasource.getRepository(SeederEntity).save({
        name: BasketStatus1725762619077.name,
        timestamp: 1725762619077,
      });
    }
  }
}
