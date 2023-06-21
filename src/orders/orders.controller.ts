import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Query, Res,  } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Response } from 'express';
import { CreateOrderDto } from './dtos/createorder.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('api/orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}
    @Get()
    @ApiResponse({status:200,description:'all order'})
    async getOrders(@Query('q') q: string, @Query('page') page=1){
       const orders = await this.ordersService.getAll(page,q)
       return orders;
    }

    @Get(':id')
    async getOrder(@Param('id') id: number) {
        const order = await this.ordersService.getById(id)
        if (!order) {
            throw new NotFoundException('Order not found');
          }
        return order;
    }
    
    @Post()
    async create(@Body() orderData: CreateOrderDto,@Res() res: Response) {    
    try {
        const order = await this.ordersService.createNew(orderData)
        res.status(HttpStatus.CREATED).json(order);
    } catch (e) {
        if (e instanceof TypeError) {
            
            res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid status' });
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
        }
      }
    }

  
    @Delete(':id')
    async deleteOrder(@Param('id') id: number){
        try {
            await this.ordersService.delete(id);
            return { message: 'Order has been deleted' };
          } catch (e) {
            return { error: 'Unable to delete order' };
        }
    }
}
