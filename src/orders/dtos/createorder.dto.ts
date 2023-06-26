import { IsEnum, IsNotEmpty } from "class-validator";
import { OrderStatus, PaymentMethod } from "../method/OrderMethod";
import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderDto{

    // @ApiProperty({ example: 0, description: 'The ID of the order' })
    // @IsNotEmpty()
    // user_id: number;

    @ApiProperty({ enum: PaymentMethod })
    payment:PaymentMethod;
    
    @ApiProperty({ enum: OrderStatus })
    status: OrderStatus;
}

