import { DataSource } from 'typeorm';
import { Seeder } from '@jorgebodega/typeorm-seeding';
import { SeederEntity } from 'src/seeder/entities/seeder.entity';
import { VirtualCode } from 'src/virtual-code/entities/virtual-code.entity';

export default class VirtualCode1725762619078 extends Seeder {
  public async run(datasource: DataSource): Promise<void> {
    const dataSeeder = await datasource
      .getRepository(SeederEntity)
      .find({ where: { name: VirtualCode1725762619078.name } });
    if (!dataSeeder.length) {
      const userRole: VirtualCode[] = datasource
        .getRepository(VirtualCode)
        .create([
          {
            name: 'top-up',
            code: 100,
          },
          {
            name: 'checkout',
            code: 1000,
          },
        ]);
      const value = datasource
        .createEntityManager()
        .getRepository(VirtualCode)
        .create(userRole);
      await datasource.createEntityManager().save<VirtualCode>(value);
      await datasource.getRepository(SeederEntity).save({
        name: VirtualCode1725762619078.name,
        timestamp: 1725762619078,
      });
    }
  }
}
