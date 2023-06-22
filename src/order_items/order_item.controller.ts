import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { OrderItemsService } from "./order_items.service";
import { get } from "http";
import { CreateOrderItemDto } from "./dtos/createorderitem.dto";
import { UpdateOrderItemDto } from "./dtos/updateorderitem.dto";
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";


@ApiTags('order-items')
@Controller('api/orderItems')
export class OrderItemsController {
    constructor(private readonly orderItemsService: OrderItemsService) {}

    @ApiOperation({ summary: 'Get all order items' })
    @ApiResponse({ status: 200, description: 'All order items' })
    @Get()
    async getOrderitems(@Query('q') q: string, @Query('page') page=1){
        const orders = await this.orderItemsService.getAll(page,q)
        return orders;
    }

    @ApiOperation({ summary: 'Get order item by ID' })
    @ApiNotFoundResponse({ description: 'Order item not found' })
    @ApiResponse({status:200,description:'all order item'})
    @Get(':id')
    async getOrderitem(@Param('id') id: number) {
        const orderitem = await this.orderItemsService.getById(id)
        // return orderitem;
        if (!orderitem) {
            throw new NotFoundException('Order Item not found');
          }
        return orderitem;
    }
    
    @ApiOperation({ summary: 'Create new order item' })
    @ApiResponse({ status: 201, description: 'Order item created successfully' })
    @ApiBadRequestResponse({ description: 'Invalid order item data' })
    @Post()
    async create(@Body() orderitemData: CreateOrderItemDto) {
        const orderitem = await this.orderItemsService.createNew(orderitemData)
        return  orderitem ;
    }

    @ApiOperation({ summary: 'Update an order item' })
    @ApiResponse({ status: 200, description: 'Order item updated successfully' })
    @ApiBadRequestResponse({ description: 'Invalid order item data' })
    @ApiNotFoundResponse({ description: 'Order item not found' })
    @Put(':id')
    @UsePipes(new ValidationPipe())
    async updateOrderitem(@Param('id') id: number, @Body() orderitemData: UpdateOrderItemDto) {
      try {
        const orderitem = await this.orderItemsService.update(id, orderitemData);
        return orderitem;
      } catch (e) {
        console.log(e); // In ra thông tin lỗi cụ thể
        throw new BadRequestException('Unable to update order item');
      }
    }

    @ApiOperation({ summary: 'Delete an order item' })
    @ApiResponse({ status: 200, description: 'Order item deleted successfully' })
    @ApiNotFoundResponse({ description: 'Order item not found' })
    @Delete(':id')
    async deleteOrder(@Param('id') id: number){
        try {
            await this.orderItemsService.delete(id);
            return { message: 'Order has been deleted' };
          } catch (e) {
            return { error: 'Unable to delete order' };
        }
    }
}