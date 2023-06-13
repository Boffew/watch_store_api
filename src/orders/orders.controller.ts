import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UploadedFile, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dtos/updateorder.dto';
import { CreateOrderDto } from './dtos/createorder.dto';

@Controller('api/orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}
    @Get()
    async getOrders(@Query('q') q: string, @Query('page') page=1){
       const orders = await this.ordersService.getAll(page,q)
       return orders;
    }

    @Get(':id')
    async getOrder(@Param('id') id: number) {
        const order = await this.ordersService.getById(id)
        return order;
    }



    
    @Post()
    async create(@Body() orderData: CreateOrderDto) {
        const order = await this.ordersService.createNew(orderData)
        return  order ;
    }
    @Delete(':id')
    async deleteOrder(@Param('id') id: number){
        await this.ordersService.delete(id)
        return "Order has been deleted";
    }
   


    
}
