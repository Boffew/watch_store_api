import { Controller, Get, Post, Request, UploadedFile, UseGuards,  } from '@nestjs/common';
import { AppService } from './app.service';

import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './auth/dto/login.dto';
import { Role } from './authorization/models/role.enum';
import { Roles } from './authorization/decorators/roles.decorator';
import { RolesGuard } from './authorization/guards/roles.guard';
@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return "Hello";
  }
  @ApiTags('users')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ description: 'Login credentials', type: LoginDto })
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

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiTags('Admin')
  @ApiOperation({ summary: 'Get admin section' })
  @Get('admin')
  @ApiBearerAuth('JWT-auth') // This is the one that needs to match the name in main.ts
  getAdminArea(@Request() req) {
    return req.user;
  }

}
