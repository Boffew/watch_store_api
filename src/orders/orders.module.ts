import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  
})


export class OrdersModule {}
