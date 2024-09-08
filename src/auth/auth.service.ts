import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IValidateUser } from './interfaces/validate-user.interfaces';
import { UserService } from 'src/user/user.service';

const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<IValidateUser | null> {
    // const user = await this.userService.findOne(email);
    const user = { id: 'oe', username: 'ohe', email: 'oke', password: 'oe' };
    if (user) {
      const comparePassword: boolean = await bcrypt.compare(
        password,
        user.password,
      );
      if (comparePassword) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      email: user.email,
      sub: user.id,
    };
    return {
      statusCode: HttpStatus.OK,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
