import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { OrderItemsModule } from './order_items/order_items.module';
import { ReviewsModule } from './reviews/review.module';


@Module({  
  imports: [DatabaseModule.forRoot(), UsersModule, ProductsModule, OrdersModule,OrderItemsModule,ReviewsModule, AuthModule, CloudinaryModule],
  controllers: [AppController],
  
  providers: [AppService],
  
})
export class AppModule {
}
