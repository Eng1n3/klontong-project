import {
  Controller,
  Request,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { CreateSuperuserDto } from './dtos/create-superuser.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    // private readonly superusersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  // @Post('register')
  // @HttpCode(HttpStatus.CREATED)
  // async register(@Body() createSuperuserDto: CreateSuperuserDto) {
  //   await this.superusersService.register(createSuperuserDto);
  //   return {
  //     statusCode: HttpStatus.CREATED,
  //     message: 'Success create account',
  //   };
  // }
}
