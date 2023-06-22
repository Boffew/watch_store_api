import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/createcategory.dto';
import { UpdateCategoryDto } from './dtos/updateCategory.dto';
import { Roles } from 'src/authorization/decorators/roles.decorator';
import { Role } from 'src/authorization/models/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/authorization/guards/roles.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
@Controller('api/categories')
@ApiTags('categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService){}
    @Get()
    async getCategory(){
        return 'hello category'
    }
    @Post()
    @UsePipes(new ValidationPipe)
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard,RolesGuard)
    async createCategory(@Body() categoryData: CreateCategoryDto){
       const newCategory= this.categoriesService.create(categoryData)
       return newCategory;
    }
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Put(':id')
    @UsePipes(new ValidationPipe)
    async updateCategory(@Param('id') id: number, @Body() categoryData: UpdateCategoryDto){
        const updatedCategory= this.categoriesService.update(id,categoryData)
        return updatedCategory;
    }
    @Get(':id')
    async getCategoryById(@Param('id') id: number){
        const categoryData= this.categoriesService.getCategoryById(id)
        return categoryData
    }
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Delete(':id')
    async deleteCategoryById(@Param('id') id: number){
        return this.categoriesService.deleteCategory(id)
    }
}
