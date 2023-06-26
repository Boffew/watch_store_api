import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

import { CreateOrderDto } from './dtos/createorder.dto';
import { UpdateOrderDto } from './dtos/updateorder.dto';
import { orders } from './interfaces/orders.interface';


@Injectable()
export class OrdersService {
  constructor(@Inject('DATABASE_CONNECTION') private readonly connection: any){
  }

    async getAll(page=1,searchTerm?: string){
        const perPage = 20;
        let query = 'SELECT * FROM Orders';
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
        const [result] = await this.connection.query(`SELECT * FROM Orders WHERE id = ?`, [id])
        return result[0];
    }

    async createNew(orderDto: CreateOrderDto) {
      // console.log("test service")
      const result = await this.connection.query(
        'INSERT INTO orders ( payment, status, created_at, updated_at) VALUES ( ?, ?, ?, ?)',
        [
          orderDto.payment,
          orderDto.status,
          new Date(),
          new Date()
        ],
      );
      
      const [newOrder] =  await this.connection.query (
        'SELECT * FROM orders WHERE id = ?',
        [result[0].insertId],
       
      );
      return newOrder;
    }

    async update(id: number, orderDto: UpdateOrderDto) {

      const [existingOrder]= await this.connection.query('SELECT * FROM orders WHERE id = ?', [id]);
      if (!existingOrder) {
        throw new NotFoundException(`ID ${id} không tồn tại`);
      }
      const result = await this.connection.execute(
        'UPDATE orders SET user_id = ?, payment = ?,status = ?, updated_at = ? WHERE id = ?', 
        [
          orderDto.user_id,
          orderDto.payment,
          orderDto.status,
          new Date(),
         
        id,
      ]);
        try {
          const [updateOrderitem] = await this.connection.query('SELECT * FROM orders WHERE id = ?', [id]);
          return updateOrderitem[0];
        } catch (e) {
          throw new InternalServerErrorException('Unable to update order');
        }
      }

    async delete(id: number){
        const result = await this.connection.query('DELETE FROM Orders where id=?', [id]);
    }
   
    async getByUserId(userId: number): Promise<orders[]> {
      const query = `SELECT * FROM orders WHERE user_id = ?`;
      const [rows] = await this.connection.query(query, [userId]);
      return rows; 
    }
  
}
