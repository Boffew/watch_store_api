import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/createproduct.dto';
import { UpdateProductDto } from './dtos/updateproduct.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('api/products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @ApiOperation({ summary: 'Get all products' })
    @ApiResponse({ status: 200, description: 'All products' })
    @Get()
    async getProducts(@Query('q') q: string, @Query('page') page=1){
       const products = await this.productsService.getAll(page,q)
       return products;
    }

    @ApiOperation({ summary: 'Get product by ID' })
    @ApiNotFoundResponse({ description: 'Product not found' })
    @ApiResponse({ status: 200, description: 'Product' })
    @Get(':id')
    async getProductById(@Param('id') id: number){
       const product = await this.productsService.getById(id)
       return product
    }

    @ApiOperation({ summary: 'Create a new product' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      description: 'Product data with optional image file',
      type: CreateProductDto,
    })
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    @ApiBadRequestResponse({ description: 'Invalid product data' })
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

    @ApiOperation({ summary: 'Update an existing product' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      description: 'Product data with optional image file',
      type: UpdateProductDto,
    })
    @ApiResponse({ status: 200, description: 'Product updated successfully' })
    @ApiBadRequestResponse({ description: 'Invalid product data' })
    @ApiNotFoundResponse({ description: 'Product not found' })
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

    @ApiOperation({ summary: 'Delete an existing product' })
    @ApiResponse({ status: 200, description: 'Product deleted successfully' })
    @ApiNotFoundResponse({ description: 'Product not found' })
    @Delete(':id')
    async deleteProduct(@Param('id') id: number){
        await this.productsService.delete(id)
        return "Product has been deleted"
    }


}
