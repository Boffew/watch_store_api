export interface OrderItem {
  id: number;
  order_id: number;
  cart_id: number;
  quantity: number;
  total_price: number;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  customer_phone: number;
  created_at: Date;
  updated_at: Date;
}

export interface Catelory {
  id: number;
  name: string;
}


