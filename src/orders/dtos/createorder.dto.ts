import {
  IsEmpty,
    IsEnum,
    IsNumber,
    IsObject,
    IsString
} from 'class-validator';
import { OrderStatus, PaymentMethod } from '../methor/OrderMethod';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemBody {
    @ApiProperty({ example: 0, description: '' })
    @IsNumber()
    cart_id: number;
  
    @ApiProperty({ example: 0, description: '' })
    @IsNumber()
    total_price: number;
  
    @ApiProperty({ example: "string", description: '' })
    @IsString()
    customer_name: string;
  
    @ApiProperty({ example: "string", description: '' })
    @IsString()
    customer_email: string;
  
    @ApiProperty({ example: "string", description: '' })
    @IsString()
    shipping_address: string;
  }
  
  export class OrderBody {
    @ApiProperty({ example: "enum", description: '' })
    @IsEmpty()
    @IsEnum(PaymentMethod)
    payment: PaymentMethod;

    @ApiProperty({ example: "enum", description: '' })
    @IsEmpty()
    @IsEnum(OrderStatus)
    status: OrderStatus;
  }
  

export class CreateOrderDto {
  @IsObject()
  orderItems: OrderItemBody;

  @IsObject()
  order: OrderBody
}

