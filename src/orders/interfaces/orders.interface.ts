import { EmptyError } from "rxjs";
import { OrderStatus, PaymentMethod } from "../method/OrderMethod";


export interface orders {
    id: number;
    user_id: number;
    create_at: string;
    update_at: string;
    payment: PaymentMethod;
    status: OrderStatus;
  }