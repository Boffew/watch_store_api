import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CartsService } from './carts.service';
import { Cart } from './interfaces/cart.interface';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CartItem } from './interfaces/cartitemsinterface';
import { AddItemToCart } from './dtos/addItemToCart.dto';
import { UpdateCartQuantity } from './dtos/updateItemQuantity.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
@Controller('api/users/carts')
@UseGuards(JwtAuthGuard)
@ApiTags('carts')
@UsePipes(new ValidationPipe)
export class CartsController {
    constructor(private cartsService: CartsService){
    }
    
@ApiBearerAuth('JWT-auth')
 @Get()
 async getCart(@Req()req): Promise<Cart>{
    const cart_id= req.user.cart_id;
    console.log(cart_id)
    const cart = await this.cartsService.getCart(cart_id);
    return cart;
 }

 @ApiBearerAuth('JWT-auth')
 @Post('items')
 async addItemToCart(@Req() req, @Body() cartItemData: AddItemToCart) : Promise<string> {
   const cartId = await req.user.cart_id;
   await this.cartsService.addToCart(cartId, cartItemData.product_id, cartItemData.quantity);
   return "item added successfully"
 }

 @ApiBearerAuth('JWT-auth')
@Get('items')
async getCartItems(@Req()req): Promise<CartItem[]>{
   const cartId = await req.user.cart_id;
   const cartItems = await this.cartsService.getCartItems(cartId)
   return cartItems;
}

@ApiBearerAuth('JWT-auth')
@Put('items/:id')
async updateCartItems(@Param('id') id: number, @Body() cartItemData: UpdateCartQuantity):Promise<CartItem>{
    const cartItem=await this.cartsService.updateItemQuantity(id,cartItemData.quantity)
    return cartItem
}

@ApiBearerAuth('JWT-auth')
@Delete('items/:id')
async deleteCartItems(@Param('id') id: number): Promise<string>{
return this.cartsService.removeFromCart(id)
}

@ApiBearerAuth('JWT-auth')
@Delete('/clear')
async deleteAll(@Req() req): Promise<string>{
return this.cartsService.clearCart(req.user.cart_id)
}

@ApiBearerAuth('JWT-auth')
@Get('total')
async getTotal(@Req() req): Promise<number>{
   return this.cartsService.getCartTotal(req.user.cart_id)
}
}
