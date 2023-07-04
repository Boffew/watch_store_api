import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('protected')
  async protectedRoute() {
    return 'This is a protected route';
  }
}