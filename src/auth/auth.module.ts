import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './contants';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from 'src/authorization/guards/roles.guard';
import { CartsService } from 'src/carts/carts.service';
import { OrdersService } from 'src/orders/orders.service';
import { ReviewsService } from 'src/reviews/review.service';

@Module({
  imports: [UsersModule,PassportModule,
    JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '6000s' },
  }),],
  providers: [AuthService,LocalStrategy,JwtStrategy,RolesGuard,CartsService,OrdersService],
  exports: [AuthService],
})
export class AuthModule {}
