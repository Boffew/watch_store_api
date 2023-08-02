import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNumber } from 'class-validator';

export class UpdateOrderItemDto {
  @ApiProperty({ example: 0, description: 'The ID of the ' })
  @IsEmpty()
  @IsNumber()
  total_price: number;

  @ApiProperty({ example: 'string', description: '' })
  @IsEmpty()
  customer_name: string;

  @ApiProperty({ example: 'string', description: '' })
  @IsEmpty()
  customer_email: string;

  @ApiProperty({ example: 'string', description: '' })
  @IsEmpty()
  shipping_address: string;
}
