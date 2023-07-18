import {
    IsEnum,
    IsNumber,
    IsObject,
    IsString
} from 'class-validator';
import { OrderStatus, PaymentMethod } from '../methor/OrderMethod';

export class OrderItemBody {
    @IsNumber()
    cart_id: number;
  
    @IsNumber()
    total_price: number;
  
    @IsString()
    customer_name: string;
  
    @IsString()
    customer_email: string;
  
    @IsString()
    shipping_address: string;
  }
  
  export class OrderBody {
    @IsEnum(PaymentMethod)
    payment: PaymentMethod;
    @IsEnum(OrderStatus)
    status: OrderStatus;
  }
  

export class CreateOrderDto {
  @IsObject()
  orderItems: OrderItemBody;

  @IsObject()
  order: OrderBody
}

