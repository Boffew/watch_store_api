import { IsNotEmpty } from "class-validator";

export class CreateOrderItemDto{
    @IsNotEmpty()
    order_id: string;
    @IsNotEmpty()
    product_id:string;
    @IsNotEmpty()
    quantity: number;
    @IsNotEmpty()
    price: number;

}