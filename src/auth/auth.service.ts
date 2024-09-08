import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IValidateUser } from './interfaces/validate-user.interfaces';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { phone } from 'phone';
import { UserBalance } from 'src/user-balance/entities/user-balance.entity';
import {
  getChecksum,
  getMimetype,
  getSize,
} from 'src/common/functions/create-file.function';
import { join } from 'path';
import { pathDefaultImage } from './constants';
import { File } from 'src/file/entities/file.entity';

const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private readonly userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserBalance)
    private userBalanceRepo: Repository<UserBalance>,
    @InjectRepository(File)
    private fileRepo: Repository<File>,
  ) {}


  async register(createUserDto: CreateUserDto) {
    const { email, password: passwordDto } = createUserDto;
    const checkUser = await this.userRepo.findOneBy({
      email,
    });
    if (checkUser) throw new BadRequestException('User already exist');
    const checkPhoneNumber = await this.userRepo.findOneBy({
      phoneNumber: createUserDto.phoneNumber,
    });
    if (checkPhoneNumber)
      throw new BadRequestException('Phone number already exist');
    const password = await bcrypt.hash(passwordDto, saltOrRounds);
    const checksum = await getChecksum(pathDefaultImage);
    const mimeType = await getMimetype(pathDefaultImage);
    const size = getSize(pathDefaultImage);
    const file = this.fileRepo.create({
      caption: 'default-user',
      checksum,
      isMain: true,
      mimeType,
      path: pathDefaultImage,
      size,
    });
    const user = this.userRepo.create({ ...createUserDto, password, file });
    const userBalance = this.userBalanceRepo.create({ balance: 0, user });
    await this.userBalanceRepo.save(userBalance);
  }

  async findUser(email: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email);
    return user;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<IValidateUser | null> {
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      const comparePassword: boolean = await bcrypt.compare(
        password,
        user.password,
      );
      if (comparePassword) {
        const { userRole, email, username, id } = user;
        const roles = userRole.map(({ role }) => role.name);
        return {
          id,
          email,
          roles,
        };
      }
    }
    return null;
  }

  refreshToken(user: IValidateUser) {
    const payload = {
      roles: user.roles,
      sub: user.id,
      email: user.email,
    };
    const secret = this.configService.get<string>(
      'JWT_REFRESH_TOKEN_PRIVATE_KEY',
    );
    const expiresIn = this.configService.get<string>(
      'JWT_REFRESH_TOKEN_EXPIRES_IN',
    );
    const tokenRefresh: string = this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
    return tokenRefresh;
  }

  async login(user: any) {
    const payload = {
      roles: user.roles,
      username: user.username,
      email: user.email,
      sub: user.id,
    };
    return {
      statusCode: HttpStatus.OK,
      token: this.jwtService.sign(payload),
    };
  }
}
