import { IsNotEmpty } from "class-validator";

export class CreateOrderDto{
    @IsNotEmpty()
    user_id: string;
    @IsNotEmpty()
    payment:string;
    @IsNotEmpty()
    status:string;
}