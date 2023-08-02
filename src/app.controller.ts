import {
  Controller,
  Get,
  Post,
  Request,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';

import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt.auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './auth/dto/login.dto';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return 'Hello';
  }
  @ApiTags('users')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ description: 'Login credentials', type: LoginDto })
  @Post('api/users/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiTags('users')
  @UseGuards(JwtAuthGuard)
  @Get('api/users/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
