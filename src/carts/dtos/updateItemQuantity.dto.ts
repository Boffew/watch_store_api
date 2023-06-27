import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';
export class UpdateCartQuantity {
    @IsNumber()
    @ApiProperty()
    quantity: number
}