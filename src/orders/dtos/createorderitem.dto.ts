import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty } from "class-validator";

export class CreateOrderItemDto{

 
    @ApiProperty({ example: 0, description: 'The ID of the ' })
    @IsEmpty()
    order_id:number;

    @ApiProperty({ example: 0, description: 'The ID of the ' })
    @IsEmpty()
    cartitems_id:number;

    
    @ApiProperty({ example: 0, description: 'The ID of the ' })
    @IsEmpty()
    total_price:number;

    @ApiProperty({ example: "string", description: '' })
    @IsEmpty()
    customer_name: string;

    @ApiProperty({ example: "string", description: '' })
    @IsEmpty()
    customer_email: string;

    @ApiProperty({ example: "string", description: '' })
    @IsEmpty()
    shipping_address: string;



}