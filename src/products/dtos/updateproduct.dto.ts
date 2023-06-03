import { IsNotEmpty } from "class-validator";

export class UpdateProductDto{
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
    image_url: string;
    @IsNotEmpty()
    price: number;
    @IsNotEmpty()
    brand: string;
    @IsNotEmpty()
    color: string;
    @IsNotEmpty()
    material: string;
    @IsNotEmpty()
    quantity: number;
    @IsNotEmpty()
    category_id: number;
}