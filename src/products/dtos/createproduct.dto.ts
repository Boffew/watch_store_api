import { IsNotEmpty } from "class-validator";

export class CreateProductDto{
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
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