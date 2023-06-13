import { IsNotEmpty } from "class-validator";

export class UpdateOrderDto{
    @IsNotEmpty()
    user_id: number;
    @IsNotEmpty()
    voucher_id: string;
    @IsNotEmpty()
    payment:string;
    @IsNotEmpty()
    status:string;
}