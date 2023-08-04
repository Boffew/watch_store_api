import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class UpdateOrderItemDto {
  
  @ApiProperty({ example: 0, description: '' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  total_price: number;

  @ApiProperty({ example: 'abc', description: '' })
  @IsNotEmpty()
  @IsString()
  customer_name: string;

  @ApiProperty({ example: 'abc@gmail.com', description: '' })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  customer_email: string;

  @ApiProperty({ example: 'abc', description: '' })
  @IsNotEmpty()
  @IsString()
  shipping_address: string;
}
