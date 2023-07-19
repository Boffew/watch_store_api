import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CategoriesModule } from './categories/categories.module';
import { CartsModule } from './carts/carts.module';
import { PassportModule } from '@nestjs/passport';
import { ReviewsModule } from './reviews/review.module';
@Module({
  imports: [
  PassportModule.register({ defaultStrategy: 'jwt' }),
  DatabaseModule.forRoot(), 
  UsersModule, 
  ProductsModule, 
  OrdersModule, 
  AuthModule, 
  CloudinaryModule, 
  CategoriesModule, 
  CartsModule,  
  ReviewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
