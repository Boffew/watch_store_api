import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dtos/createproduct.dto';
import { UpdateProductDto } from './dtos/updateproduct.dto';

@Injectable()
export class ProductsService {
    constructor(@Inject('DATABASE_CONNECTION') private readonly connection: any){
    }
    async getAll(page=1,searchTerm?: string){
        const perPage = 20;
        let query = 'SELECT * FROM Products';
        const params = [];
        if (searchTerm) {
          query += ' WHERE name LIKE ? OR description LIKE ?';
          params.push(`%${searchTerm}%`, `%${searchTerm}%`);
        }
        const offset = (page - 1) * perPage;
        const limit = perPage;
        query += ` LIMIT ${offset}, ${limit}`;
        const [rows] = await this.connection.execute(query, params);
        return rows;
    }
    async createNew(productDto: CreateProductDto){
        const result= await this.connection.execute('INSERT INTO Products (name, description, image_url, price, brand, color, material, quantity, category_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',[productDto.name, productDto.description, productDto.image_url, productDto.price, productDto.brand, productDto.color, productDto.material, productDto.quantity, productDto.category_id, new Date()])
        const id = result[0].insertId;
        const [newProduct] = await this.connection.query(
        'SELECT * FROM Products WHERE id = ?',[id])
        return newProduct;
    }
    async update(id: number, productDto: UpdateProductDto) {
        const result = await this.connection.execute('UPDATE Products SET name = ?, description = ?, image_url = ?, price = ?, brand = ?, color = ?, material = ?, quantity = ?, category_id = ?, updated_at = ? WHERE id = ?', [productDto.name,productDto.description,productDto.image_url,productDto.price,productDto.brand,productDto.color,productDto.material,productDto.quantity,productDto.category_id,new Date(),
          id,
        ]);
        const [updatedProduct] = await this.connection.query('SELECT * FROM Products WHERE id = ?', [id]);
        return updatedProduct;
      }
    async delete(id: number){
        const result = await this.connection.query('DELETE FROM products where id=?', [id]);
    }
    async getById(id: number){
        const [result] = await this.connection.query('SELECT * FROM Products WHERE id = ?', [id])
        return result;
    }
}
