import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class UpdateProductDto{
    @ApiProperty()
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    @ApiProperty()
    description: string;
    @IsNotEmpty()
    @ApiProperty()
    price: number;
    @IsNotEmpty()
    @ApiProperty()
    brand: string;
    @IsNotEmpty()
    @ApiProperty()
    color: string;
    @IsNotEmpty()
    @ApiProperty()
    material: string;
    @IsNotEmpty()
    @ApiProperty()
    quantity: number;
    @IsNotEmpty()
    @ApiProperty()
    category_id: number;
}