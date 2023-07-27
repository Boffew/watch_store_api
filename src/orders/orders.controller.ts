import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Req,
  NotFoundException,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderItemDto } from './dtos/updateorderitem.dto';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateOrderDto } from './dtos/updateorder.dto';
import { CreateOrderDto } from './dtos/createorder.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { User } from 'src/users/interface/User.interface';
import { RolesGuard } from 'src/authorization/guards/roles.guard';
import { OrderItem } from './interface/orderitems.interface';

@UseGuards(JwtAuthGuard)
@ApiTags('orders')
@Controller('order')
export class OrderController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateOrderDto, description: 'Create a new order item' })
  @Post()
  async createNew(
    @Body() orderDto: CreateOrderDto,
    @Req() req,
  ): Promise<OrderItem> {
    const user = req.user as User;
    const newOrderItem: OrderItem = await this.ordersService.createNew(
      orderDto,
      user,
    );
    return newOrderItem;
  }

  @ApiOperation({ summary: 'Get all order items in an order' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  // @ApiResponse({ status: 200, description: 'Order items retrieved successfully', type: MyNamespace.OrderItem, isArray: true })
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
  async updateOrderItem(
    @Param('order_item_id') orderItemId: number,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    const updatedOrderItem = await this.ordersService.updateOrderItem(
      orderItemId,
      updateOrderItemDto,
    );
    return { message: 'Order item updated successfully', updatedOrderItem };
  }

  // @ApiOperation({ summary: 'Delete an order item' })
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('JWT-auth') // Đáh dấu API endpoint này yêu cầu xác thực bằng JWT token
  // @Delete(':id/items/:itemId')
  // async deleteOrderItem(@Param('itemId') orderItemId: number): Promise<void> {
  //   await this.ordersService.deleteOrderItemById(orderItemId);
  // }

  @ApiOperation({ summary: 'Delete an order' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth') // Đánh dấu API endpoint này yêu cầu xác thực bằng JWT token
  @Delete(':id')
  async deleteOrderById(
    @Param('id') orderId: number,
  ): Promise<{ message: string }> {
    await this.ordersService.deleteOrderById(orderId);
    return { message: `Đã xóa đơn hàng với id ${orderId}` };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an order' })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @ApiParam({ name: 'id', description: 'ID of the order to be updated' })
  @ApiBearerAuth('JWT-auth') // Đánh dấu API endpoint này yêu cầu xác thực bằng JWT token
  @Put(':id')
  async updateOrder(
    @Param('id') orderId: number,
    @Body() updatedOrderDto: UpdateOrderDto,
  ) {
    const order = await this.ordersService.getOrderById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    const updatedOrder = await this.ordersService.updateOrder(
      orderId,
      updatedOrderDto,
    );
    return { message: 'Order updated successfully', updatedOrder };
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Lỗi máy chủ',
  })
  @Get('user')
  async getAllByUserId(@Req() req) {
    const userId = req.user.id;
    const orders = await this.ordersService.getOrdersByUserId(userId);
    return { orders };
  }
}
