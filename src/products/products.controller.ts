import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/createproduct.dto';
import { UpdateProductDto } from './dtos/updateproduct.dto';

@Controller('api/products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
    @Get()
    async getProducts(@Query('q') q: string, @Query('page') page=1){
       const products = await this.productsService.getAll(page,q)
       return products;
    }
    @Get(':id')
    async getProductById(@Param('id') id: number){
       const product = await this.productsService.getById(id)
       return product
    }
    @Post()
    @UsePipes(new ValidationPipe)
    async createProduct(@Body() productData: CreateProductDto){
        const product = await this.productsService.createNew(productData)
        return product;
    }
    @Put(':id')
    @UsePipes(new ValidationPipe)
    async updateProduct(@Param('id') id: number,@Body() productData: UpdateProductDto){
        const product = await this.productsService.update(id,productData)
        return product;
    }
    @Delete(':id')
    async deleteProduct(@Param('id') id: number){
        await this.productsService.delete(id)
        return "Product has been deleted"
    }


}
