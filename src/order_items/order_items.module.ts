import { Module } from "@nestjs/common";

import { OrderItemsController } from "./order_Item.controller";
import { OrderItemsService } from "./order_items.service";

@Module({
    
    controllers: [OrderItemsController],
    providers: [OrderItemsService],
    
  })
  
  
  export class OrderItemsModule {}