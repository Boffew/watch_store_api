import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './contants';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from 'src/authorization/guards/roles.guard';

@Module({
  imports: [UsersModule,PassportModule,
    JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '600s' },
  }),],
  providers: [AuthService,LocalStrategy,JwtStrategy,RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}
