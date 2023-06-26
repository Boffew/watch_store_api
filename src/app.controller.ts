import { Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt.auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return;
  }
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.appService.uploadImageToCloudinary(file);
  }

  // @ApiTags('users')
  // @UseGuards(LocalAuthGuard)
  // @Post('api/users/login')
  // async login(@Request() req){
  //   return this.authService.login(req.user)
  // }
  // @ApiTags('users')
  // @UseGuards(JwtAuthGuard)
  // @Get('api/users/profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}
