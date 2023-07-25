import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderController } from './orders.controller';

@Module({
  controllers: [OrderController],
  providers: [OrdersService],
})
export class OrdersModule {}
