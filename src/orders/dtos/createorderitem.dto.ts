import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ example: 0, description: '' })
  @IsNotEmpty()
  @IsNumber()
  cart_id: number;

  @ApiProperty({ example: 0, description: '' })
  @IsNotEmpty()
  @IsNumber()
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

  @ApiProperty({ example: 0, description: '' })
  @IsNotEmpty()
  @IsNumber()
  customer_phone: number;
}
