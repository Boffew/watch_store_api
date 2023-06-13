import { Inject, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateOrderDto } from './dtos/updateorder.dto';
import { CreateOrderDto } from './dtos/createorder.dto';
import { Connection } from 'mysql2';

@Injectable()
export class OrdersService {
  constructor(@Inject('DATABASE_CONNECTION') private readonly connection: any, private readonly cloudinary: CloudinaryService){
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
        'INSERT INTO orders (user_id, payment, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
        [
          orderDto.user_id,
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

    async delete(id: number){
        const result = await this.connection.query('DELETE FROM Orders where id=?', [id]);
    }
   
  
}
