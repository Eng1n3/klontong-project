import {
  Controller,
  Request,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Body,
  Get,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.auth.guard';
import { Role } from './enum/roles.enum';
import { IValidateUser } from './interfaces/validate-user.interfaces';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    await this.authService.register(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Success create account',
    };
  }

  @Post('refresh-token')
  @Roles(Role.SUPERUSER, Role.ADMIN, Role.USER)
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(@CurrentUser() user: IValidateUser) {
    const token = await this.authService.login(user);
    const refreshToken = this.authService.refreshToken(user);
    return { token, refreshToken };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: IValidateUser,
  ) {
    const token = await this.authService.login(user);
    const refreshToken = this.authService.refreshToken(user);
    return { token, refreshToken };
  }
}
