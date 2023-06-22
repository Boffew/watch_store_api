import { Controller, Get, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return "Hello";
  }
  @ApiTags('users')
  @UseGuards(LocalAuthGuard)
  @Post('api/users/login')
  async login(@Request() req){
    return this.authService.login(req.user)
  }
  @ApiTags('users')
  @UseGuards(JwtAuthGuard)
  @Get('api/users/profile')
  getProfile(@Request() req) {
    return req.user;
  }

}
