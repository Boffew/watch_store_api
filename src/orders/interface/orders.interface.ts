import { OrderStatus, PaymentMethod } from '../methor/OrderMethod';
import { OrderItem } from './orderitems.interface';

export interface Order {
  id: number;
  user_id: number;
  payment: PaymentMethod;
  status: OrderStatus;
  created_at: Date;
  updated_at: Date;
  order_items: OrderItem[];
}
