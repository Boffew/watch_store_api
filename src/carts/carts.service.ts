import { Inject, Injectable } from '@nestjs/common';
import { Cart } from './interfaces/cart.interface';

@Injectable()
export class CartsService {
    constructor (@Inject('DATABASE_CONNECTION') private readonly connection: any,){}

    async createNew(user_id:string): Promise<Cart>{
    const [existingCart] = await this.connection.query('SELECT * FROM Carts WHERE user_id = ?', [user_id]);
    if (existingCart[0]) {
        console.log(existingCart[0])
        return existingCart[0];
      }
    const cart= await this.connection.query('Insert into Carts (user_id , created_at , updated_at) values (?,?,?)', [user_id, new Date(), new Date()])
    const id = cart[0].insertId;
    const [newCart] = await this.connection.query(
    'SELECT * FROM Products WHERE id = ?',[id])
    console.log(newCart);
    return newCart[0];

}
    async getCart(user_id: string): Promise<Cart>{
        const [existingCart] = await this.connection.query('SELECT * FROM Carts WHERE user_id = ?', [user_id]);
        if (existingCart[0]) {
        console.log(existingCart[0])
        return existingCart[0];
          }
    }
}
