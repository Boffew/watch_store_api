import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { User } from "src/users/interface/User.interface";
import { Order } from "../interface/orders.interface";

export class CreateOrderItemDto{

    @ApiProperty({ example: 0, description: '' })
    @IsNotEmpty()
    @IsNumber()
    cart_id:number;

    @ApiProperty({ example: 0, description: '' })
    @IsNotEmpty()
    @IsNumber()
    total_price:number;

    @ApiProperty({ example: "string", description: '' })
    @IsNotEmpty()
    
    customer_name: string;

    @ApiProperty({ example: "string", description: '' })
    @IsNotEmpty()
    
    customer_email: string;

    @ApiProperty({ example: "string", description: '' })
    @IsNotEmpty()
   
    shipping_address: string;



}