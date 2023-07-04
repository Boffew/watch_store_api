import { Inject, Injectable } from '@nestjs/common';

import { OrderItem } from './interface/orderitems.interface';
import { Order } from './interface/orders.interface';
import { CreateOrderItemDto } from './dtos/createorderitem.dto';
import { UpdateOrderItemDto } from './dtos/updateorderitem.dto';
import { UpdateOrderDto } from './dtos/updateorder.dto';
import { OrderStatus, PaymentMethod } from './methor/OrderMethod';
import { CreateOrderDto } from './dtos/createorder.dto';


@Injectable()
export class OrdersService {
  constructor(@Inject('DATABASE_CONNECTION') private readonly connection: any){
  }
  async createNew(orderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const { order_id, cartitems_id, total_price, customer_name, customer_email, shipping_address } = orderItemDto;

    // Check if an order exists for the order_id
    // const order = await this.connection.getOrderById(order_id);

    // // If an order does not exist, throw an error
    // if (!order) {
    //   throw new Error(`Order with ID ${order_id} does not exist.`);
    // }

    // Create a new order item associated with the order
    const result = await this.connection.query(
      'INSERT INTO order_items (order_id, cartitems_id, total_price, customer_name, customer_email, shipping_address, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [order_id, cartitems_id, total_price, customer_name, customer_email, shipping_address, new Date(), new Date()],
    );

    const [newOrderItem] = await this.connection.query(
      'SELECT * FROM order_items WHERE id = ?',
      [result.insertId],
    );

    return newOrderItem;
  }
  
  async getOrderById(orderId: number) {
    const [rows] = await this.connection.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    return rows[0];
  }
  
  // other connection methods...

  async getOrderItemsByOrderId(order_id: number): Promise<OrderItem[]> {
    const orderItems = await this.connection.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [order_id],
    );
    return orderItems;
  }

  async updateOrderItem(orderItemId: number, updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItem> {
    const { total_price, customer_name, customer_email, shipping_address } = updateOrderItemDto;

    // Check if the order item exists
    const orderItem = await this.connection.query(
      'SELECT * FROM order_items WHERE id = ?',
      [orderItemId],
    );

    // If the order item does not exist, throw an error
    if (orderItem.length === 0) {
      throw new Error(`Order item with ID ${orderItemId} does not exist.`);
    }

    // Update the order item with the new values
    await this.connection.query(
      'UPDATE order_items SET total_price = ?, customer_name = ?, customer_email = ?, shipping_address = ?, updated_at = ? WHERE id = ?',
      [total_price, customer_name, customer_email, shipping_address, new Date(), orderItemId],
    );

    // Retrieve and return the updated order item
    const [updatedOrderItem] = await this.connection.query(
      'SELECT * FROM order_items WHERE id = ?',
      [orderItemId],
    );

    return updatedOrderItem;
  }

  async deleteOrderItemById(orderItemId: number): Promise<void> {
    await this.connection.query('DELETE FROM order_items WHERE id = ?', [orderItemId]);
  }
 
  async deleteOrderById(orderId: number): Promise<void> {
    await this.connection.query('DELETE FROM orders WHERE id = ?', [orderId]);
  }

  async updateOrder(orderId: number, updatedOrder: UpdateOrderDto): Promise<Order> {
    const { payment, status } = updatedOrder;
    
    // Check if the order exists
    const order = await this.connection.query('SELECT * FROM orders WHERE id = ?', [orderId]);
  
    // If the order does not exist, throw an error
    if (order.length === 0) {
      throw new Error(`Order with ID ${orderId} does not exist.`);
    }
  
    // Update the order with the new values
    await this.connection.query(
      'UPDATE orders SET payment = ?, status = ?, updated_at = ? WHERE id = ?', 
      [payment, status, new Date(), orderId],
    );
  
    // Retrieve and return the updated order
    const [updatedOrderRow] = await this.connection.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    return updatedOrderRow;
  }

  async createOrderNew(user_id: string, payment: PaymentMethod, status: OrderStatus): Promise<Order> {
    const [existingOrder] = await this.connection.query('SELECT * FROM orders WHERE user_id = ?', [user_id]);
  
    if (existingOrder) {
      throw new Error(`Order with user ID ${user_id} already exists.`);
    }
  
    const result = await this.connection.query(
      'INSERT INTO orders (user_id, payment, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      [user_id, payment, status, new Date(), new Date()],
    );
  
    const [newOrder] = await this.connection.query(
      'SELECT * FROM orders WHERE id = ?',
      [result.insertId],
    );
  
    return newOrder;
  }

  
}