import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/createproduct.dto';
import { UpdateProductDto } from './dtos/updateproduct.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
    @Get()
    async getProducts(@Query('search') search: string, @Query('page') page=1){
       const products = await this.productsService.getAll(page,search)
       return products;
    }
    @Get(':id')
    async getProductById(@Param('id') id: number){
       const product = await this.productsService.getById(id)
       return product
    }
    @Post()
    @UseInterceptors(FileInterceptor('image',{
        fileFilter: (req, file, cb) => {
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
          }
          cb(null, true);
        },
      }))
    @UsePipes(new ValidationPipe)
    async createProduct(@Body() productData: CreateProductDto,@UploadedFile() image: Express.Multer.File){
        const product = await this.productsService.createNew(productData,image)
        return product;
    }
    @Put(':id')
    @UseInterceptors(FileInterceptor('image',{
        fileFilter: (req, file, cb) => {
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
          }
          cb(null, true);
        },
      }))
    @UsePipes(new ValidationPipe)
    async updateProduct(@Param('id') id: number,@Body() productData: UpdateProductDto,@UploadedFile() image?: Express.Multer.File){

        const product = await this.productsService.update(id,productData,image)
        return product;
    }
    @Delete(':id')
    async deleteProduct(@Param('id') id: number){
        await this.productsService.delete(id)
        return "Product has been deleted"
    }


}
