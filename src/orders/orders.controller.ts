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
  UnauthorizedException,
  InternalServerErrorException,
  Patch,
  UsePipes,
  ValidationPipe,
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
import { Order } from './interface/orders.interface';
import {
  InternalServerErrorResponse,
  NotFoundResponse,
  SuccessResponse,
  UnauthorizedResponse,
} from './dtos/response.dto';
import { throwError } from 'rxjs';

@UseGuards(JwtAuthGuard)
@ApiTags('orders')
@Controller('order')
export class OrderController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateOrderDto, description: 'Create a new order item' })
  @UsePipes(new ValidationPipe())
  @Post()
  async createNew(
    @Body() orderDto: CreateOrderDto,
    @Req() req,
  ): Promise<Order> {
    const user = req.user as User;
    return this.ordersService.createNew(orderDto, user).then((order) => {
      return order;
    }).catch((e) => {
      return throwError(() => e).toPromise();
    });
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
  @UsePipes(new ValidationPipe())
  @Put(':orderId/items/:orderItemId')
  async updateOrderItem(
    @Param('orderId') orderId: number,
    @Param('orderItemId') orderItemId: number,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
    @Req() req,
  ): Promise<OrderItem> {
    const userId = req.user.id; // Giả sử userId được lưu trong biến `id` của `user` object trong `req`
    return this.ordersService.updateOrderItem(
      orderId,
      orderItemId,
      updateOrderItemDto,
      userId,
    );
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
  async deleteOrder(
    @Param('id') orderId: number,
    @Req() req,
  ): Promise<{ success: boolean; message?: string }> {
    const userId = req.user.id;
    const result = await this.ordersService.deleteOrderById(orderId, userId);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an order' })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @ApiParam({ name: 'id', description: 'ID of the order to be updated' })
  @ApiBearerAuth('JWT-auth') // Đánh dấu API endpoint này yêu cầu xác thực bằng JWT token
  @UsePipes(new ValidationPipe())
  @Put(':id')
  async updateOrder(
    @Param('id') orderId: number,
    @Body() updatedOrder: UpdateOrderDto,
  ): Promise<any> {
    try {
      const updatedOrderResult = await this.ordersService.updateOrder(
        orderId,
        updatedOrder,
      );
      return {
        message: 'Đơn hàng đã được cập nhật',
        order: updatedOrderResult,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          message: 'Không tìm thấy đơn hàng',
        };
      }
      throw error;
    }
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

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.ordersService.getAllOrders();
  }

  // @ApiBearerAuth('JWT-auth')
  // @UseGuards(JwtAuthGuard)
  // @Get('user/order/:orderId/items')
  // async getOrderItemsByUserAndOrderId(
  //   @Req() req,
  //   @Param('orderId') orderId: number,
  // ): Promise<OrderItem> {
  //   const userId = req.user.id; // Extract the user ID from the JWT token
  //   return this.ordersService.getOrderItemsByUserAndOrderId(orderId, userId);
  // }

  // @ApiBearerAuth('JWT-auth')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Patch(':userId/:orderId/payment')
  // async updateOrderPaymentByUser(
  //
  //   @Param('orderId') orderId: number,
  //   @Body('payment') payment: string,
  // ): Promise<Order> {
  //
  //   return this.ordersService.updateOrderPaymentByUser(userId, orderId, payment);
  // }
}
