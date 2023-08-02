import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentMethod } from '../methor/OrderMethod';
import { IsEnum } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({ enum: PaymentMethod, description: 'The payment method for the order (null)' })
  @IsEnum(PaymentMethod)
  payment: PaymentMethod;

  @ApiProperty({ enum: OrderStatus, description: 'The status of the order (null)' })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
