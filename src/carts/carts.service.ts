import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cart } from './interfaces/cart.interface';
import { CartItem } from './interfaces/cartitemsinterface';

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
    async getCart(cart_id: number): Promise<Cart>{
        const [existingCart] = await this.connection.query('SELECT * FROM Carts WHERE id = ?', [cart_id]);
        if (existingCart[0]) {
        return existingCart[0];
          }
    }
    async addToCart(cartId: number,productId: number,quantity: number) {
      const [product] = await this.connection.query(
        'SELECT * FROM products WHERE id = ?',
        [productId],
      );
      const [existingCartItem] = await this.connection.query('select * from cart_items where cart_id = ? AND product_id = ? ', [cartId, productId])
      if (existingCartItem[0]){
        await this.connection.query(
          'UPDATE cart_items SET quantity = quantity + ?, total = total + ? WHERE id = ?',
          [quantity, quantity * product[0].price, existingCartItem[0].id],
        );
      }
      else {
        await this.connection.query(
          'INSERT INTO cart_items (cart_id, product_id, quantity, price, total) VALUES (?, ?, ?, ?, ?)',
          [cartId, productId, quantity, product[0].price, quantity * product[0].price],
        );
      }
    } 
    async getCartItems(cartId: number): Promise<CartItem[]> {
      const [cartItems] = await this.connection.query('SELECT * FROM cart_items WHERE cart_id = ?', [cartId]);
      return cartItems;
    }   
    async updateItemQuantity(cartItemId: number, quantity: number): Promise<CartItem>{
      const [existingCartItem] = await this.connection.query('SELECT * FROM cart_items WHERE id = ?', [cartItemId]);
      if(existingCartItem[0]){
        const [updatedItem] = await this.connection.query('UPDATE cart_items SET quantity = ?, total = ? WHERE id = ?', [quantity, quantity * existingCartItem[0].price, cartItemId]);
        return existingCartItem[0];
      }
      else{throw new HttpException('item not found', HttpStatus.NOT_FOUND)}
    }
    async removeFromCart(cartItemId: number): Promise<string> {
      try{
      await this.connection.query('DELETE FROM cart_items WHERE id = ?', [cartItemId]);
      return `Cart item with id: ${cartItemId} has been removed from cart`
      }
      catch(err){
        throw new HttpException(err.message, HttpStatus.CONFLICT)
      }
    }
    async clearCart(cartId: number): Promise<string> {
      await this.connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
      return 'cart has been cleared'
    }
}
