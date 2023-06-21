import { Module } from "@nestjs/common";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { OrderItemsController } from "./order_Item.controller";
import { OrderItemsService } from "./order_items.service";

@Module({
    imports: [CloudinaryModule],
    controllers: [OrderItemsController],
    providers: [OrderItemsService],
    
  })
  
  
  export class OrderItemsModule {}