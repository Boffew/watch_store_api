import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateOrderItemDto{
    
    @ApiProperty({ example: 0, description: 'The ID of the order' })
    @IsNotEmpty()
    order_id: number;

    @ApiProperty({ example: 0, description: 'The ID of the product' })
    @IsNotEmpty()
    product_id:number;

    @ApiProperty({ example: 0, description: 'The quantity of the product in the order' })
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ example: 0, description: 'The price of the product in the order' })
    @IsNotEmpty()
    price: number;

}