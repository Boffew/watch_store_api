import { Inject, Injectable } from "@nestjs/common";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { CreateOrderItemDto } from "./dtos/createorderitem.dto";
import { UpdateOrderItemDto } from "./dtos/updateorderitem.dto";

@Injectable()
export class OrderItemsService {
    constructor(@Inject('DATABASE_CONNECTION') private readonly connection: any, private readonly cloudinary: CloudinaryService){
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

      const [existingOrderitem] = await this.connection.query('SELECT * FROM order_items WHERE id = ?', [id]);
      if (!existingOrderitem) {
        throw new Error(`Order_item with ID ${id} not found`);
      }
      const result = await this.connection.execute
      (
        'UPDATE order_items SET order_id = ?, product_id = ?,quantity = ?,price = ?, updated_at = ? WHERE id = ?', 
        [
          orderitemDto.order_id,
          orderitemDto.product_id,
          orderitemDto.quantity,
          orderitemDto.price,
          new Date(),
          new Date(),
        id,
      ]);
        const [updatedOrderitem] = await this.connection.query('SELECT * FROM order_items WHERE id = ?', [id]);
        return updatedOrderitem[0];
      }

    async delete(id: number){
      const result = await this.connection.query('DELETE FROM order_items where id=?', [id]);
    }
 
}