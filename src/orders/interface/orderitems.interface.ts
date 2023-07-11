export interface OrderItem { 
    id: number;
    order_id: number;
    product_id:number;
    cart_id:number;
    quantity: number;
    total_price: number;
    customer_name : string;
    customer_email : string;
    shipping_address : string;
}