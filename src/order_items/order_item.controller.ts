import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { OrderItemsService } from "./order_items.service";
import { get } from "http";
import { CreateOrderItemDto } from "./dtos/createorderitem.dto";
import { UpdateOrderItemDto } from "./dtos/updateorderitem.dto";
import { ApiResponse } from "@nestjs/swagger";

@Controller('api/orderItem')
export class OrderItemsController {
    constructor(private readonly orderItemsService: OrderItemsService) {}

    @Get()
    @ApiResponse({status:200,description:'all order'})
    async getOrderitems(@Query('q') q: string, @Query('page') page=1){
        const orders = await this.orderItemsService.getAll(page,q)
        return orders;
    }

    @Get(':id')
    async getOrderitem(@Param('id') id: number) {
        const orderitem = await this.orderItemsService.getById(id)
        // return orderitem;
        if (!orderitem) {
            throw new NotFoundException('Order Item not found');
          }
        return orderitem;
    }

    @Post()
    async create(@Body() orderitemData: CreateOrderItemDto) {
        const orderitem = await this.orderItemsService.createNew(orderitemData)
        return  orderitem ;
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    async updateOrderitem(@Param('id') id: number, @Body() orderitemData: UpdateOrderItemDto) {
      try {
        const orderitem = await this.orderItemsService.update(id, orderitemData);
        return orderitem;
      } catch (e) {
        throw new BadRequestException('Unable to update order item');
      }
    }


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