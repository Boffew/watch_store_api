import { HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { CreateReviewDto } from "./dto/createreview.dto";
import { UpdateReviewDto } from "./dto/updatereview.dto";
import { Reviews } from "./interfaces/reviews.interface";
import { User } from "src/users/interface/User.interface";

@Injectable()
export class ReviewsService {
    constructor(@Inject('DATABASE_CONNECTION') private readonly connection: any, private readonly cloudinary: CloudinaryService){
    }
    async createByProductId(
      productId: number,
      reviewDto: CreateReviewDto,
      user: User,
    ): Promise<Reviews> {
      try {
        const userReviewCount = await this.connection.query(
          'SELECT COUNT(*) as count FROM reviews WHERE user_id = ?',
          [user.id],
        );
  
        if (userReviewCount[0].count >= 3) {
          throw new HttpException(
            'User has already submitted 3 reviews',
            HttpStatus.BAD_REQUEST,
          );
        }
  
        const [result] = await this.connection.execute(
          'INSERT INTO reviews (user_id, product_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?)',
          [
            user.id,
            productId,
            reviewDto.rating,
            reviewDto.comment,
            new Date(),
          ],
        );
  
        if (result.affectedRows !== 1) {
          throw new Error('Failed to create review');
        }
  
        const [newReview] = await this.connection.execute(
          'SELECT * FROM reviews WHERE id = ?',
          [result.insertId],
        );
  
        return newReview[0];
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    async updateByIdUserIdProductId(id: number, productId: number, user: User, updateReviewDto: UpdateReviewDto): Promise<Reviews> {
      const [existingReview] = await this.connection.query(
        'SELECT * FROM reviews WHERE id = ? AND user_id = ? AND product_id = ?',
        [id, user.id, productId],
      );
      if (!existingReview) {
        throw new NotFoundException(`Không tìm thấy đánh giá với id ${id}, user_id ${user.id}, và product_id ${productId}`);
      }
      const result = await this.connection.execute(
        'UPDATE reviews SET rating = ?, comment = ?, updated_at = ? WHERE id = ? AND user_id = ? AND product_id = ?',
        [
          updateReviewDto.rating,
          updateReviewDto.comment,
          new Date(),
          id,
          user.id,
          productId,
        ],
      );
      
      const [updatedReview] = await this.connection.query('SELECT * FROM reviews WHERE id = ?', [id]);
      return updatedReview[0];
    }


  
    async getAllByProductId(productId: number) {
     
      let query = 'SELECT * FROM reviews WHERE product_id = ?';
      const params = [productId];
      
      
     
      const [rows] = await this.connection.execute(query, params);
      return rows;
    }
    

    async deleteByUserId(id: number, userId: number): Promise<void> {
      const result = await this.connection.query(
        'DELETE FROM reviews WHERE id = ? AND user_id = ?',
        [id, userId],
      );
      if (result.affectedRows === 0) {
        throw new NotFoundException(
          `Không tìm thấy đánh giá với id ${id} và user_id ${userId}`,
        );
      }
    }
  
    async getAllByUserId(userId: number): Promise<Reviews[]> {
      try {
        const [rows] = await this.connection.execute('SELECT * FROM reviews WHERE user_id = ?', [userId]);
        if (rows.length === 0) {
          throw new NotFoundException(`Không tìm thấy đánh giá nào cho người dùng có ID ${userId}`);
        }
        return rows;
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    }
}