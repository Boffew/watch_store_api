import { Controller, Get, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt.auth.guard';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return "Hello";
  }
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req){
    console.log(req.user)
    return this.authService.login(req.user)
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

}
