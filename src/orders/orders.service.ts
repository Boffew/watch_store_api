import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
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
  async createNew(orderDto: CreateOrderDto, user: User): Promise<Order> {
    
    try {
      const { payment, status } = orderDto.order;
      const {
        cart_id,
        total_price,
        customer_name,
        customer_email,
        shipping_address,
        customer_phone,
      } = orderDto.orderItems;

      // Kiểm tra xem giỏ hàng có tồn tại không
      const [cart] = await this.connection.query(
        'SELECT * FROM carts WHERE id = ? AND user_id = ?',
        [cart_id, user.id],
      );

      if (!cart || cart.length === 0) {
        throw new NotFoundException('Cart does not exist');
      }

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
        'INSERT INTO order_items (order_id, cart_id, total_price, customer_name, customer_email, shipping_address, customer_phone,created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          newOrderId,
          cart_id,
          total_price,
          customer_name,
          customer_email,
          shipping_address,
          customer_phone,
          new Date(),
          new Date(),
        ],
      );

      const [newOrderItem] = await this.connection.query(
        'SELECT * FROM order_items WHERE id = ?',
        [orderItemResult.insertId],
      );

      const newOrder: Order = {
        id: newOrderId,
        status,
        payment,
        user_id: user.id,
        created_at: new Date(),
        updated_at: new Date(),
      };

      return newOrder;
    } catch (error) {
      console.error('Error creating new order:', error.status);
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
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

  async getOrderItemsByOrderId(order_id: number): Promise<OrderItem[]> {
    const [orderItems] = await this.connection.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [order_id],
    );
    if (!orderItems.length) {
      throw new NotFoundException(
        `Không tìm thấy order item với id ${order_id}`,
      );
    }
    return orderItems;
  }

  async updateOrderItem(
    orderId: number,
    orderItemId: number,
    updateOrderItemDto: UpdateOrderItemDto,
    userId: number,
  ): Promise<OrderItem> {
    const {
      total_price,
      customer_name,
      customer_email,
      shipping_address,
      customer_phone,
    } = updateOrderItemDto;

    const [[userOrder]] = await this.connection.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [orderId, userId],
    );
    if (!userOrder) {
      throw new ForbiddenException('Bạn không có quyền cập nhật đơn hàng này');
    }

    const [[order]] = await this.connection.query(
      'SELECT * FROM orders WHERE id = ?',
      [orderId],
    );
    if (!order) {
      throw new NotFoundException(
        `Không tìm thấy đơn hàng với id = ${orderId}`,
      );
    }

    const [[orderItem]] = await this.connection.query(
      'SELECT * FROM order_items WHERE id = ? AND order_id = ?',
      [orderItemId, orderId],
    );
    if (!orderItem) {
      throw new NotFoundException(
        `Không tìm thấy order item với id = ${orderItemId}`,
      );
    }

    const updateOrderItemQuery = `
      UPDATE order_items 
      SET total_price = ?, customer_name = ?, customer_email = ?, shipping_address = ?, customer_phone = ?, updated_at = ? 
      WHERE id = ? AND order_id = ?
    `;
    const [result] = await this.connection.query(updateOrderItemQuery, [
      total_price,
      customer_name,
      customer_email,
      shipping_address,
      customer_phone,
      new Date(),
      orderItemId,
      orderId,
    ]);

    if (result.affectedRows === 0) {
      throw new NotFoundException(
        `Không tìm thấy order item với id = ${orderItemId}`,
      );
    }

    const [[updatedOrderItem]] = await this.connection.query(
      'SELECT * FROM order_items WHERE id = ?',
      [orderItemId],
    );
    if (!updatedOrderItem) {
      throw new NotFoundException(
        `Không tìm thấy order item với id = ${orderItemId}`,
      );
    }

    return updatedOrderItem;
  }

  async deleteOrderById(
    orderId: number,
    userId: number,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const order = await this.getOrderById(orderId);

      if (!order) {
        return {
          success: false,
          message: `Không tìm thấy đơn hàng với id ${orderId}`,
        };
      }

      if (order.user_id !== userId) {
        return {
          success: false,
          message: `Bạn không có quyền xóa đơn hàng với id ${orderId}`,
        };
      }

      const deletedOrder = await this.connection.query(
        'DELETE FROM orders WHERE id = ? AND user_id = ?',
        [orderId, userId],
      );

      if (deletedOrder.affectedRows === 0) {
        return {
          success: false,
          message: `Không thể xóa đơn hàng với id ${orderId}`,
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting order:', error);
      throw new HttpException(
        'Could not delete order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOrder(
    orderId: number,
    updatedOrder: UpdateOrderDto,
  ): Promise<Order> {
    const { payment, status } = updatedOrder;

    const [[order]] = await this.connection.query(
      'SELECT * FROM orders WHERE id = ?',
      [orderId],
    );

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${orderId}`);
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

  async getAllOrders(): Promise<Order[]> {
    const query = `
      SELECT * FROM orders
    `;
    const [orders, _] = await this.connection.query(query);
    return orders;
  }
}
