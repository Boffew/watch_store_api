import { Controller, Post, Body, Get, Param, Put, Delete, Req, NotFoundException, UseGuards,Request } from '@nestjs/common';
import { CreateOrderItemDto } from './dtos/createorderitem.dto';
import { OrdersService } from './orders.service';
import { UpdateOrderItemDto } from './dtos/updateorderitem.dto';
import { OrderItem } from './interface/orderitems.interface';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Order } from './interface/orders.interface';
import { UpdateOrderDto } from './dtos/updateorder.dto';
import { OrderStatus, PaymentMethod } from './methor/OrderMethod';
import { CreateOrderDto } from './dtos/createorder.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { User } from 'src/users/interface/User.interface';

@UseGuards(JwtAuthGuard)
@ApiTags('order')
@Controller('order')
export class OrderController {
constructor(private readonly ordersService: OrdersService) {}

    @ApiOperation({ summary: 'Create new order item' })
    @ApiResponse({ status: 201, description: 'Order item created successfully' })
    @ApiBearerAuth('JWT-auth') // Đánh dấu API endpoint này yêu cầu xác thực bằng JWT token
    @UseGuards(JwtAuthGuard)
  
    @Post()
    @ApiBody({ 
        description: '', 
        type: CreateOrderDto 
      })
    async createNew(
        @Body() orderDto: CreateOrderDto,
        @Req() req,
    ): Promise<OrderItem> {
        const user = req.user as User;
        return await this.ordersService.createNew(orderDto, user);
    }

    // @ApiOperation({ summary: 'Create new order' })
    // @ApiResponse({ status: 201, description: 'Order created successfully' })
    // @ApiBearerAuth() // Đánh dấu API endpoint này yêu cầu xác thực bằng JWT token
    // @Post('create')
    // async createOrder(
    // @Body('user_id') userId: string,
    // @Body('payment') payment: PaymentMethod,
    // @Body('status') status: OrderStatus,
    // ): Promise<Order> {
    // return this.ordersService.createOrderNew(userId, payment, status);
    // }
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    @Get(':order_id/items')
    async getOrderItemsByOrderId(@Param('order_id') orderId: number) {
        const orderItems = await this.ordersService.getOrderItemsByOrderId(orderId);
    return { message: 'Order items retrieved successfully', orderItems };
    }


    @ApiOperation({ summary: 'Update an order item' })
    @ApiResponse({ status: 200, description: 'Order item updated successfully' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth') // Đánh dấu API endpoint này yêu cầu xác thực bằng JWT token
    @Put(':order_item_id')
    async updateOrderItem(@Param('order_item_id') orderItemId: number, @Body() updateOrderItemDto: UpdateOrderItemDto) {
        const updatedOrderItem = await this.ordersService.updateOrderItem(orderItemId, updateOrderItemDto);
    return { message: 'Order item updated successfully', updatedOrderItem };
    }

    
    @ApiOperation({ summary: 'Delete an order item' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth') // Đáh dấu API endpoint này yêu cầu xác thực bằng JWT token
    @Delete(':id/items/:itemId')
    async deleteOrderItem(@Param('itemId') orderItemId: number): Promise<void> {
        await this.ordersService.deleteOrderItemById(orderItemId);
    }


      
    @ApiOperation({ summary: 'Delete an order' })
  
    @ApiBearerAuth('JWT-auth') // Đánh dấu API endpoint này yêu cầu xác thực bằng JWT token
    @Delete(':id')
    async deleteOrder(@Param('id') orderId: number): Promise<void> {
        await this.ordersService.deleteOrderById(orderId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update an order' })
    @ApiResponse({ status: 200, description: 'Order updated successfully' })
    @ApiParam({ name: 'id', description: 'ID of the order to be updated' })
    @ApiBearerAuth('JWT-auth')// Đánh dấu API endpoint này yêu cầu xác thực bằng JWT token
    @Put(':id')
    async updateOrder(@Param('id') orderId: number, @Body() updatedOrder: UpdateOrderDto): Promise<Order> {
        const order = await this.ordersService.getOrderById(orderId);
        if (!order) {
            throw new NotFoundException(`Order with ID ${orderId} not found`);
        }
        const updated = await this.ordersService.updateOrder(orderId, updatedOrder);
        return updated;
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Get(':userId/orders')
    async getOrdersByUserId(@Param('userId') userId: number): Promise<Order[]> {
    const orders = await this.ordersService.getOrdersByUserId(userId);
    return orders;
  }

}