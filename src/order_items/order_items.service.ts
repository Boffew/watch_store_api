import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";

import { CreateOrderItemDto } from "./dtos/createorderitem.dto";
import { UpdateOrderItemDto } from "./dtos/updateorderitem.dto";
import { order_items } from "./interfaces/order_items.interface";

@Injectable()
export class OrderItemsService {
    constructor(@Inject('DATABASE_CONNECTION') private readonly connection: any){
    }

    async getAll(page=1,searchTerm?: string){
        const perPage = 20;
        let query = 'SELECT * FROM order_items';
        const params = [];
        if (searchTerm) {
          query += ' WHERE id LIKE ? OR user_id LIKE ?';
          params.push(`%${searchTerm}%`, `%${searchTerm}%`);
        }
        const offset = (page - 1) * perPage;
        const limit = perPage;
        query += ` LIMIT ${offset}, ${limit}`;
        const [rows] = await this.connection.execute(query, params);
        return rows;
    }

    async getById(id: number){
        const [result] = await this.connection.query(`SELECT * FROM order_items WHERE id = ?`, [id])
        return result[0];
    }
    
    async createNew(orderitemDto: CreateOrderItemDto) {
        // console.log("test service")
        const result = await this.connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity,price, created_at, updated_at) VALUES (?, ?, ?, ?,?,?)',
          [
            orderitemDto.order_id,
            orderitemDto.product_id,
            orderitemDto.quantity,
            orderitemDto.price,
            new Date(),
            new Date()
          ],
        );
        
        const [newOrderitem] =  await this.connection.query (
          'SELECT * FROM order_items WHERE id = ?',
          [result[0].insertId],
         
        );
        return newOrderitem;
    }

    async update(id: number, orderitemDto: UpdateOrderItemDto) {

      const [existingOrderitem]= await this.connection.query('SELECT * FROM order_items WHERE id = ?', [id]);
      if (!existingOrderitem) {
        throw new NotFoundException(`ID ${id} không tồn tại`);
      }
      const result = await this.connection.execute(
        'UPDATE order_items SET order_id = ?, product_id = ?,quantity = ?,price = ?, updated_at = ? WHERE id = ?', 
        [
          orderitemDto.order_id,
          orderitemDto.product_id,
          orderitemDto.quantity,
          orderitemDto.price,
          new Date(),
        id,
      ]);
        try {
          const [updateOrderitem] = await this.connection.query('SELECT * FROM order_items WHERE id = ?', [id]);
          return updateOrderitem[0];
        } catch (e) {
          throw new InternalServerErrorException('Unable to update order item');
        }
      }

    
    async delete(id: number){
      const result = await this.connection.query('DELETE FROM order_items where id=?', [id]);
    }

    async getTotalOrderItemPrice() {
      const [result] = await this.connection.query('SELECT SUM(price) as total_price FROM order_items');
      return result.total_price;
    }

    async getByOrderId(orderId: number): Promise<order_items[]> {
      const query = `SELECT * FROM order_items WHERE order_id = ?`;
      const [rows] = await this.connection.query(query, [orderId]);
      return rows;
    }

    async getByProductId(productId: number): Promise<order_items[]> {
      const query = `SELECT * FROM order_items WHERE product_id = ?`;
      const [rows] = await this.connection.query(query, [productId]);
      return rows;
    }

    async getTotalPrice(orderItemId: number): Promise<number> {
      
      const orderItem = await this.connection.findOne(orderItemId);
      if (!orderItem) {
        throw new NotFoundException(`Order item with ID ${orderItemId} not found`);
      }
      const totalPrice = orderItem.price * orderItem.quantity;
      return totalPrice;
    }
 
}