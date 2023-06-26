import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { CreateReviewDto } from "./dto/createreview.dto";
import { UpdateReviewDto } from "./dto/updatereview.dto";

@Injectable()
export class ReviewsService {
    constructor(@Inject('DATABASE_CONNECTION') private readonly connection: any, private readonly cloudinary: CloudinaryService){
    }

    async getAll(page=1,searchTerm?: string){
        const perPage = 20;
        let query = 'SELECT * FROM Reviews';
        const params = [];
        if (searchTerm) {
          query += ' WHERE id LIKE ? OR user_id LIKE ?';
          params.push(`%${searchTerm}%`, `%${searchTerm}%`);
        }
        const offset = (page - 1) * perPage;
        const limit = perPage;
        query += ` LIMIT ${offset}, ${limit}`;
        const [rows] = await this.connection.execute(query, params);
        return rows;
    }

    async getById(id: number){
        const [result] = await this.connection.query(`SELECT * FROM reviews WHERE id = ?`, [id])
        return result[0];
    }

    async createNew(reviewDto: CreateReviewDto) {
        // console.log("test service")
        const result = await this.connection.query(
          'INSERT INTO reviews (user_id, product_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?)',
          [
            reviewDto.user_id,
            reviewDto.product_id,
            reviewDto.rating,
            reviewDto.comment,
            new Date()
           
          ],
        );
        
        const [newReview] =  await this.connection.query (
          'SELECT * FROM reviews WHERE id = ?',
          [result[0].insertId],
         
        );
        return newReview;
    }

    async update(id: number, reviewDto: UpdateReviewDto) {

        const [existingReview]= await this.connection.query('SELECT * FROM reviews WHERE id = ?', [id]);
        if (!existingReview) {
          throw new NotFoundException(`ID ${id} không tồn tại`);
        }
        const result = await this.connection.execute(
          'UPDATE reviews SET user_id = ?, product_id = ?, rating = ?, comment = ?, updated_at = ? WHERE id = ?', 
          [
            reviewDto.user_id,
            reviewDto.product_id,
            reviewDto.rating,
            reviewDto.comment,
            new Date(),
          id,
        ]);
          try {
            const [updateReview] = await this.connection.query('SELECT * FROM reviews WHERE id = ?', [id]);
            return updateReview[0];
          } catch (e) {
            throw new InternalServerErrorException('Unable to update review');
        }
    }
    
    async delete(id: number){
        const result = await this.connection.query('DELETE FROM reviews where id=?', [id]);
    }
        
}