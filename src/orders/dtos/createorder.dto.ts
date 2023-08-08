import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsPhoneNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { OrderStatus, PaymentMethod } from '../methor/OrderMethod';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemBody {
  @ApiProperty({ example: 0, description: 'The ID of the cart' })
  @IsNumber()
  @IsPositive()
  cart_id: number;

  @ApiProperty({ example: 0, description: 'The total price of the order' })
  @IsNumber()
  @IsPositive()
  total_price: number;

  @ApiProperty({ example: 'Abc', description: 'The name of the customer' })
  @IsString()
  customer_name: string;

  @ApiProperty({
    example: 'abc@gmail.com',
    description: 'The email address of the customer',
  })
  @IsString()
  @IsEmail(undefined, { message: 'Invalid email address' })
  customer_email: string;

  @ApiProperty({
    example: 'Huế, TP Huế',
    description: 'The shipping address for the order',
  })
  @IsString()
  shipping_address: string;
  
  @ApiProperty({ example: 0, description: '' })
  @IsNotEmpty()
  @IsInt({ message: 'Invalid customer phone, must be an integer' })
  @Min(0, { message: 'Customer phone must be greater than or equal to 0'})
  customer_phone: number;
}

export class OrderBody {
  @ApiProperty({
    enum: PaymentMethod,
    description: 'The payment method for the order (null)',
  })
  @IsEnum(PaymentMethod)
  payment: PaymentMethod;

  @ApiProperty({
    enum: OrderStatus,
    description: 'The status of the order (null)',
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class CreateOrderDto {
  @ApiProperty({ type: OrderItemBody, description: 'The order item details' })
  @IsObject()
  orderItems: OrderItemBody;

  @ApiProperty({ type: OrderBody, description: 'The order details' })
  @IsObject()
  order: OrderBody;
}
