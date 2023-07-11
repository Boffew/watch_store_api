import { ApiProperty } from "@nestjs/swagger/dist";
import { OrderStatus, PaymentMethod } from "../methor/OrderMethod";

export class CreateOrderDto{
    
    @ApiProperty({ enum: PaymentMethod })
    payment:PaymentMethod;
    
    @ApiProperty({ enum: OrderStatus })
    status: OrderStatus;

    
}
