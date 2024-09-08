import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IValidateUser } from './interfaces/validate-user.interfaces';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

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
