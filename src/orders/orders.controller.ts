import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Query, Res, UsePipes, ValidationPipe,  } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Response } from 'express';
import { CreateOrderDto } from './dtos/createorder.dto';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateOrderDto } from './dtos/updateorder.dto';
import { OrderStatus, PaymentMethod } from './method/OrderMethod';

@ApiTags('orders')
@Controller('api/orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @ApiOperation({ summary: 'Get all orders' })
    @ApiResponse({ status: 200, description: 'All orders' })
    @Get()
    @ApiResponse({status:200,description:'all order'})
    async getOrders(@Query('q') q: string, @Query('page') page=1){
       const orders = await this.ordersService.getAll(page,q)
       return orders;
    }

    @ApiOperation({ summary: 'Get order by ID' })
    @ApiNotFoundResponse({ description: 'Order not found' })
    @ApiResponse({ status: 200, description: 'Order' })
    @Get(':id')
    async getOrder(@Param('id') id: number) {
        const order = await this.ordersService.getById(id)
        if (!order) {
            throw new NotFoundException('Order not found');
          }
        return order;
    }
    
    @ApiOperation({ summary: 'Create a new order' })
    @ApiResponse({ status: 201, description: 'Order created successfully' })
    @ApiBadRequestResponse({ description: 'Invalid order data' })
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

    @ApiOperation({ summary: 'Update an order' })
    @ApiResponse({ status: 200, description: 'Order updated successfully' })
    @ApiBadRequestResponse({ description: 'Invalid order data' })
    @ApiNotFoundResponse({ description: 'Order not found' })
    @Put(':id')
    @UsePipes(new ValidationPipe())
    async updateOrder(@Param('id') id: number, @Body() orderitemData: UpdateOrderDto ) {
      try {
        const orderitem = await this.ordersService.update(id, orderitemData);
        return orderitem;
      } catch (e) {
        console.log(e); // In ra thông tin lỗi cụ thể
        throw new BadRequestException('Unable to update order item');
      }
    }


    @ApiOperation({ summary: 'Delete an order' })
    @ApiResponse({ status: 200, description: 'Order deleted successfully' })
    @ApiNotFoundResponse({ description: 'Order not found' })
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
