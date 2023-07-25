import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ example: 0, description: '' })
  @IsNotEmpty()
  @IsNumber()
  cart_id: number;

  @ApiProperty({ example: 0, description: '' })
  @IsNotEmpty()
  @IsNumber()
  total_price: number;

  @ApiProperty({ example: 'string', description: '' })
  @IsNotEmpty()
  customer_name: string;

  @ApiProperty({ example: 'string', description: '' })
  @IsNotEmpty()
  customer_email: string;

  @ApiProperty({ example: 'string', description: '' })
  @IsNotEmpty()
  shipping_address: string;
}
