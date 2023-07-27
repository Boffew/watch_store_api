import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { User } from 'src/users/interface/User.interface';
import { CreateOrderDto } from './dtos/createorder.dto';
import { UpdateOrderDto } from './dtos/updateorder.dto';
import { UpdateOrderItemDto } from './dtos/updateorderitem.dto';
import { OrderItem } from './interface/orderitems.interface';
import { Order } from './interface/orders.interface';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly connection: any,
  ) {}
  async createNew(orderDto: CreateOrderDto, user: User): Promise<OrderItem> {
    try {
      const { payment, status } = orderDto.order;
      const {
        cart_id,
        total_price,
        customer_name,
        customer_email,
        shipping_address,
      } = orderDto.orderItems;

      const newOrderResult = await this.connection.query(
        `INSERT INTO orders (user_id, payment, status) VALUES (?, ?, ?)`,
        [user.id, payment, status],
      );

      const newInsertOrderId = await this.connection.query(
        `SELECT LAST_INSERT_ID() as "insertId"`,
      );

      const newOrderId = newInsertOrderId[0][0].insertId;

      console.log(newInsertOrderId[0][0].insertId);

      const orderItemResult = await this.connection.query(
        'INSERT INTO order_items (order_id, cart_id, total_price, customer_name, customer_email, shipping_address, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          newOrderId,
          cart_id,
          total_price,
          customer_name,
          customer_email,
          shipping_address,
          new Date(),
          new Date(),
        ],
      );

      const [newOrderItem] = await this.connection.query(
        'SELECT * FROM order_items WHERE id = ?',
        [orderItemResult.insertId],
      );

      return newOrderItem;
    } catch (error) {
      console.error('Error creating new order:', error);
      throw new HttpException(
        'Could not create new order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderById(orderId: number) {
    const [rows] = await this.connection.query(
      'SELECT * FROM orders WHERE id = ?',
      [orderId],
    );
    return rows[0];
  }

  async getOrderItemsByOrderId(order_id: number): Promise<OrderItem> {
    const [orderItems] = await this.connection.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [order_id],
    );
    return orderItems;
  }

  async updateOrderItem(
    orderItemId: number,
    updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    const { total_price, customer_name, customer_email, shipping_address } =
      updateOrderItemDto;

    const orderItem = await this.connection.query(
      'SELECT * FROM order_items WHERE id = ?',
      [orderItemId],
    );

    if (orderItem.length === 0) {
      throw new Error(`Order item with ID ${orderItemId} does not exist.`);
    }

    await this.connection.query(
      'UPDATE order_items SET total_price = ?, customer_name = ?, customer_email = ?, shipping_address = ?, updated_at = ? WHERE id = ?',
      [
        total_price,
        customer_name,
        customer_email,
        shipping_address,
        new Date(),
        orderItemId,
      ],
    );

    const [updatedOrderItem] = await this.connection.query(
      'SELECT * FROM order_items WHERE id = ?',
      [orderItemId],
    );

    return updatedOrderItem;
  }

  // async deleteOrderItemById(orderItemId: number): Promise<void> {
  //   await this.connection.query('DELETE FROM order_items WHERE id = ?', [
  //     orderItemId,
  //   ]);
  // }

  async deleteOrderById(orderId: number): Promise<{ success: boolean }> {
    const order = await this.connection.query(
      'SELECT * FROM orders WHERE id = ?',
      [orderId],
    );
    if (order.length === 0) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với id ${orderId}`);
    }
    const result = await this.connection.query(
      'DELETE FROM orders WHERE id = ?',
      [orderId],
    );
    if (result.affectedRows === 0) {
      throw new InternalServerErrorException('Không thể xóa đơn hàng');
    }
    return { success: true };
  }

  async updateOrder(
    orderId: number,
    updatedOrder: UpdateOrderDto,
  ): Promise<Order> {
    const { payment, status } = updatedOrder;

    const order = await this.connection.query(
      'SELECT * FROM orders WHERE id = ?',
      [orderId],
    );

    if (order.length === 0) {
      throw new Error(`Order with ID ${orderId} does not exist.`);
    }

    await this.connection.query(
      'UPDATE orders SET payment = ?, status = ?, updated_at = ? WHERE id = ?',
      [payment, status, new Date(), orderId],
    );

    const [updatedOrderRow] = await this.connection.query(
      'SELECT * FROM orders WHERE id = ?',
      [orderId],
    );
    return updatedOrderRow;
  }

  // async getOrderByUserId(userId: number): Promise<Order[]> {
  //   const [orders] = await this.connection.query(
  //     'SELECT * FROM orders WHERE user_id = ?',
  //     [userId],
  //   );

  //   return orders;
  // }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    try {
      const [orders] = await this.connection.query(
        'SELECT * FROM orders WHERE user_id = ?',
        [userId],
      );

      if (orders.length === 0) {
        throw new NotFoundException(
          `Không tìm thấy đơn hàng nào của người dùng có ID ${userId}`,
        );
      }
      return orders;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // async getOrderItemsByOrderIdAndUserId(orderId: number, user: User): Promise<OrderItem[]> {
  //   const order = await this.orderRepository.findOne({ where: { id: orderId, userId: user.id }, relations: ['orderItems'] });

  //   if (!order) {
  //     throw new NotFoundException(`Order with ID ${orderId} not found`);
  //   }

  //   return order.orderItems;
  // }
}
