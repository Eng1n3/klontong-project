import { DataSource } from 'typeorm';
import { Seeder } from '@jorgebodega/typeorm-seeding';
import { SeederEntity } from 'src/seeder/entities/seeder.entity';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/role/entities/role.entity';
import { UserRole } from 'src/user-role/entities/user-role.entity';
import { File } from 'src/file/entities/file.entity';
import { join } from 'path';
import { getChecksum, getMimetype, getSize } from 'src/common/functions/create-file.function';

export default class SuperUser1725762619076 extends Seeder {
  public async run(datasource: DataSource): Promise<void> {
    const dataSeeder = await datasource
      .getRepository(SeederEntity)
      .find({ where: { name: SuperUser1725762619076.name } });
    if (!dataSeeder.length) {
      const pathDefaultImage = join(
        'uploads',
        'default-user.jpg',
      );
      const checksum = await getChecksum(pathDefaultImage)
      const mimeType = await getMimetype(pathDefaultImage)
      const size = getSize(pathDefaultImage)
      const getSalt = bcrypt.genSaltSync();
      const password = 'Sup3rstrong_password';
      const hashPassword = await bcrypt.hash(password, getSalt);
      const role: Role = datasource.getRepository(Role).create({
        name: 'superuser',
        description: 'superuser role',
      });
      const file: File = datasource.getRepository(File).create({
        caption: 'default-user',
        checksum,
        isMain: true,
        mimeType,
        path: pathDefaultImage,
        size
      });
      const superUser: User = datasource.getRepository(User).create({
        username: 'superuser',
        email: 'superuser@mail.com',
        password: hashPassword,
        file
      });
      const userRole: UserRole = datasource.getRepository(UserRole).create({
        user: superUser,
        role,
      });
      const value = datasource
        .createEntityManager()
        .getRepository(UserRole)
        .create(userRole);
      await datasource.createEntityManager().save<UserRole>(value);
      await datasource.getRepository(SeederEntity).save({
        name: SuperUser1725762619076.name,
        timestamp: 1725762619076,
      });
    }
  }
}
