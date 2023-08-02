import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentMethod } from '../methor/OrderMethod';

export class UpdateOrderDto {
  @ApiProperty({ enum: PaymentMethod })
  payment: PaymentMethod;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;
}
