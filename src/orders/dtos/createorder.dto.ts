import { IsEnum, IsNotEmpty } from "class-validator";
import { OrderStatus, PaymentMethod } from "../method/OrderMethod";




export class CreateOrderDto{
    @IsNotEmpty()
    user_id: string;

    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    payment:PaymentMethod;
    
    @IsNotEmpty()
    @IsEnum(OrderStatus)
    status: OrderStatus;
}

