import {HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/createcategory.dto';
import { UpdateCategoryDto } from './dtos/updateCategory.dto';

@Injectable()
export class CategoriesService {
    constructor(@Inject('DATABASE_CONNECTION') private readonly connection: any){

    }
    async create(categoryDto: CreateCategoryDto){
        const result = await this.connection.query('INSERT INTO categories (name,description,image_url,created_at,updated_at) VALUES(?,?,?,?,?)',[categoryDto.name,categoryDto.description,categoryDto.image_url,new Date(),new Date()])
        const id = result[0].insertId
        const [createdCategory] = await this.connection.query('SELECT * FROM categories WHERE id = ?',[id])
        return createdCategory[0]
    }
    async update(id: number, categoryDto: UpdateCategoryDto){
        const [existingCategory]= await this.connection.query('SELECT * FROM categories WHERE id = ?',[id])
        if (!existingCategory[0]){
            throw new HttpException(`category with id: ${id} doesn't exit`, HttpStatus.INTERNAL_SERVER_ERROR);}
        const result = await this.connection.query('UPDATE categories SET name = ?, description = ?, image_url = ?, updated_at = ? where id = ?',[categoryDto.name, categoryDto.description, categoryDto.image_url,new Date(),id])
        const [updatedCategory] = await this.connection.query('SELECT * FROM categories WHERE id = ?', [id]);
        return updatedCategory[0];
    }
    async getCategoryById(id: number){
        const [existingCategory]= await this.connection.query('SELECT * FROM categories WHERE id = ?',[id])
        if (!existingCategory[0]){
            throw new HttpException(`category with id: ${id} doesn't exit`, HttpStatus.INTERNAL_SERVER_ERROR);}
            return existingCategory[0];
    }
    async deleteCategory(id: number){
        const [category]= await this.connection.query('DELETE FROM categories WHERE id = ?',[id])
        if (!category[0]){
            throw new HttpException(`category with id: ${id} doesn't exit`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return 'Category has been deleted successfully'
    }
}
