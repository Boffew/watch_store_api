import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dtos/createproduct.dto';
import { UpdateProductDto } from './dtos/updateproduct.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
@Injectable()
export class ProductsService {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly connection: any,
    private readonly cloudinary: CloudinaryService,
  ) {}
  async getAll(page = 1, searchTerm?: string) {
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

  async createNew(productDto: CreateProductDto) {
    const result = await this.connection.execute(
      'INSERT INTO Products (name, description, image_url, price, color, material, quantity, category_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        productDto.name,
        productDto.description,
        productDto.image_url,
        productDto.price,
        productDto.color,
        productDto.material,
        productDto.quantity,
        productDto.category_id,
        new Date(),
      ],
    );
    const id = result[0].insertId;
    const [newProduct] = await this.connection.query(
      'SELECT * FROM Products WHERE id = ?',
      [id],
    );
    return newProduct[0];
  }
  async update(
    id: number,
    productDto: UpdateProductDto,
    file?: Express.Multer.File,
  ) {
    const [existingProduct] = await this.connection.query(
      'SELECT * FROM Products WHERE id = ?',
      [id],
    );
    if (!existingProduct) {
      throw new Error(`Product with ID ${id} not found`);
    }
    let image_url = await existingProduct[0].image_url;
    console.log(image_url); // use existing image_url by default
    if (file) {
      const uploadedImage = await this.cloudinary.uploadImage(file);
      image_url = uploadedImage.secure_url;
    }
    const result = await this.connection.execute(
      'UPDATE Products SET name = ?, description = ?, image_url = ?, price = ?, color = ?, material = ?, quantity = ?, category_id = ?, updated_at = ? WHERE id = ?',
      [
        productDto.name,
        productDto.description,
        image_url,
        productDto.price,
        productDto.color,
        productDto.material,
        productDto.quantity,
        productDto.category_id,
        new Date(),
        id,
      ],
    );
    const [updatedProduct] = await this.connection.query(
      'SELECT * FROM Products WHERE id = ?',
      [id],
    );
    return updatedProduct[0];
  }
  async delete(id: number) {
    const result = await this.connection.query(
      'DELETE FROM products where id=?',
      [id],
    );
  }
  async getById(id: number) {
    const [result] = await this.connection.query(
      'SELECT * FROM Products WHERE id = ?',
      [id],
    );
    return result[0];
  }
}
