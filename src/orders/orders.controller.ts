import { Controller, Post, Body, Get, Param, Put, Delete, Req, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateOrderItemDto } from './dtos/createorderitem.dto';
import { OrdersService } from './orders.service';
import { UpdateOrderItemDto } from './dtos/updateorderitem.dto';
import { OrderItem } from './interface/orderitems.interface';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Order } from './interface/orders.interface';
import { UpdateOrderDto } from './dtos/updateorder.dto';
import { OrderStatus, PaymentMethod } from './methor/OrderMethod';
import { CreateOrderDto } from './dtos/createorder.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('order')
@Controller('order')
export class OrderController {
constructor(private readonly ordersService: OrdersService) {}

    @ApiOperation({ summary: 'Create new order item' })
    @ApiResponse({ status: 201, description: 'Order item created successfully' })
    @ApiBearerAuth() // Đánh dấu API endpoint này yêu cầu xác thực bằng JWT token
    @Post('create/orderitem')
    async createNew(@Body() orderItemDto: CreateOrderItemDto) {
        const newOrderItem = await this.ordersService.createNew(orderItemDto);

    return {
    message: 'Order item created successfully',
    data: newOrderItem,
    };
    }

    @ApiOperation({ summary: 'Create new order' })
    @ApiResponse({ status: 201, description: 'Order created successfully' })
    @ApiBearerAuth() // Đánh dấu API endpoint này yêu cầu xác thực bằng JWT token
    @Post('create')
    async createOrder(
    @Body('user_id') userId: string,
    @Body('payment') payment: PaymentMethod,
    @Body('status') status: OrderStatus,
    ): Promise<Order> {
    return this.ordersService.createOrderNew(userId, payment, status);
    }

  
    @Get(':order_id/items')
    async getOrderItemsByOrderId(@Param('order_id') orderId: number) {
        const orderItems = await this.ordersService.getOrderItemsByOrderId(orderId);
    return { message: 'Order items retrieved successfully', orderItems };
    }


    @ApiOperation({ summary: 'Update an order item' })
    @ApiResponse({ status: 200, description: 'Order item updated successfully' })
   
    @ApiBearerAuth() // Đánh dấu API endpoint này yêu cầu xác thực bằng JWT token
    @Put(':order_item_id')
    async updateOrderItem(@Param('order_item_id') orderItemId: number, @Body() updateOrderItemDto: UpdateOrderItemDto) {
        const updatedOrderItem = await this.ordersService.updateOrderItem(orderItemId, updateOrderItemDto);
    return { message: 'Order item updated successfully', updatedOrderItem };
    }

    
    @ApiOperation({ summary: 'Delete an order item' })
    
    @ApiBearerAuth() // Đáh dấu API endpoint này yêu cầu xác thực bằng JWT token
    @Delete(':id/items/:itemId')
    async deleteOrderItem(@Param('itemId') orderItemId: number): Promise<void> {
        await this.ordersService.deleteOrderItemById(orderItemId);
    }


      
    @ApiOperation({ summary: 'Delete an order' })
  
    @ApiBearerAuth() // Đánh dấu API endpoint này yêu cầu xác thực bằng JWT token
    @Delete(':id')
    async deleteOrder(@Param('id') orderId: number): Promise<void> {
        await this.ordersService.deleteOrderById(orderId);
    }

    @ApiOperation({ summary: 'Update an order' })
    @ApiResponse({ status: 200, description: 'Order updated successfully' })
    @ApiParam({ name: 'id', description: 'ID of the order to be updated' })
    @ApiBearerAuth() // Đánh dấu API endpoint này yêu cầu xác thực bằng JWT token
    @Put(':id')
    async updateOrder(@Param('id') orderId: number, @Body() updatedOrder: UpdateOrderDto): Promise<Order> {
        const order = await this.ordersService.getOrderById(orderId);
        if (!order) {
            throw new NotFoundException(`Order with ID ${orderId} not found`);
        }
        const updated = await this.ordersService.updateOrder(orderId, updatedOrder);
        return updated;
    }

}