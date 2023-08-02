import { OrderStatus, PaymentMethod } from '../methor/OrderMethod';

export interface Order {
  id: number;
  user_id: number;
  payment: PaymentMethod;
  status: OrderStatus;
  created_at: Date;
  updated_at: Date;
}
