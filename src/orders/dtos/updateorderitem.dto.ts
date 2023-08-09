import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEmpty, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';

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
  @ApiProperty({ example: 0, description: '' })
  @IsNotEmpty()
  @IsInt({ message: 'Invalid customer phone, must be an integer' })
  @Min(0, { message: 'Customer phone must be greater than or equal to 0'})
  customer_phone: number;
}
