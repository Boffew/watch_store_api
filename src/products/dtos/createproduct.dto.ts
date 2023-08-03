import { IsEmpty, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class CreateProductDto{
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
    @IsString()
    @ApiProperty()
    image_url: string;
}