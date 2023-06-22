import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { Cart } from './interfaces/cart.interface';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@Controller('carts')
@UseGuards(JwtAuthGuard)
export class CartsController {
    constructor(private cartsService: CartsService){
    }
 @Get()
 async getCart(@Req()req): Promise<Cart>{
    const userId = req.user.id;
    const cart = await this.cartsService.getCart(userId);
    return cart;
 }

}
