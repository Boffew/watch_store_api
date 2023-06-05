import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dtos/updateorder.dto';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
    @Get()
    async getOrders(@Query('q') q: string, @Query('page') page=1){
       const orders = await this.ordersService.getAll(page,q)
       return orders;
    }

    @Get(':id')
    async getOrderById(@Param('id') id: number){
       const order = await this.ordersService.getById(id)
       return order
    }

    async updateOrder(@Param('id') id: number,@Body() orderData: UpdateOrderDto,@UploadedFile() image?: Express.Multer.File){

        const order = await this.ordersService.update(id,orderData)
        return order;
    }

    @Delete(':id')
    async deleteOrder(@Param('id') id: number){
        await this.ordersService.delete(id)
        return "Order has been deleted"
    }
   

    @Post()
    async createOrder(@Body() orderData: any) {
      // Lưu đơn hàng vào cơ sở dữ liệu
      const order = await this.ordersService.create(orderData);
  
      // Gửi email thông báo đến khách hàng
      await this.ordersService.sendOrderNotification(orderData.email, order);
  
      return order;
    }
}
