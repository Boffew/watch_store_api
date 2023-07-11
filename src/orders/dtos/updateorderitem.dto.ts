import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty } from "class-validator";

export class UpdateOrderItemDto{
     
    @ApiProperty({ example: 0, description: 'The ID of the ' })
    @IsEmpty()
    total_price:number;

    @ApiProperty({ example: "string", description: 'The quantity of the product in the order' })
    @IsEmpty()
    customer_name: string;

    @ApiProperty({ example: "string", description: 'The quantity of the product in the order' })
    @IsEmpty()
    customer_email: string;

    @ApiProperty({ example: "string", description: 'The quantity of the product in the order' })
    @IsEmpty()
    shipping_address: string;

}