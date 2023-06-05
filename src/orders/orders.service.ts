import { Inject, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateOrderDto } from './dtos/updateorder.dto';

@Injectable()
export class OrdersService {
  create(orderData: any) {
        throw new Error('Method not implemented.');
    }
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
        const [result] = await this.connection.query('SELECT * FROM Orders WHERE id = ?', [id])
        return result[0];
    }

    async update(id: number, orderDto: UpdateOrderDto,file?: Express.Multer.File) {

        const [existingProduct] = await this.connection.query('SELECT * FROM Orders WHERE id = ?', [id]);
        if (!existingProduct) {
          throw new Error(`Product with ID ${id} not found`);
        }
         
          const result = await this.connection.execute('UPDATE Orders SET user_id = ?, voucher_id = ? WHERE id = ?', [orderDto.user_id,orderDto.user_id,new Date(),
            id,
          ]);
          const [updateOrder] = await this.connection.query('SELECT * FROM Orders WHERE id = ?', [id]);
          return updateOrder[0];
    }

    async delete(id: number){
        const result = await this.connection.query('DELETE FROM Orders where id=?', [id]);
    }
   
    async sendOrderNotification(email: string, order: any) {
        await this.connection.sendMail({
          to: email,
          subject: 'Thông báo đặt hàng thành công',
          template: 'order-notification',
          context: {
            order,
          },
        });
    }
}
