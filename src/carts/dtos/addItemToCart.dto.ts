import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';
export class AddItemToCart {
    @ApiProperty()
    @IsNumber()
    product_id: number;
    @IsNumber()
    @ApiProperty()
    quantity: number
}