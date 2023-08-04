import { Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { CreateReviewDto } from "./dto/createreview.dto";
import { UpdateReviewDto } from "./dto/updatereview.dto";
import { Reviews } from "./interfaces/reviews.interface";

@Injectable()
export class ReviewsService {
    constructor(@Inject('DATABASE_CONNECTION') private readonly connection: any, private readonly cloudinary: CloudinaryService){
    }

  
    
    async createByProductId(productId: number, reviewDto: CreateReviewDto): Promise<Reviews>{
      const result = await this.connection.execute(
        'INSERT INTO reviews (user_id, product_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?)',
        [
          
          productId,
          reviewDto.rating,
          reviewDto.comment,
          new Date()
        ],
      );
      const [newReview] = await this.connection.query(
        'SELECT * FROM reviews WHERE id = ?',
        [result[0].insertId],
      );
    
      return newReview;
    }

    async updateByIdUserIdProductId(id: number, userId: number, productId: number, updateReviewDto: UpdateReviewDto): Promise<Reviews> {
      const [existingReview] = await this.connection.query(
        'SELECT * FROM reviews WHERE id = ? AND user_id = ? AND product_id = ?',
        [id, userId, productId],
      );
      if (!existingReview) {
        throw new NotFoundException(`Không tìm thấy đánh giá với id ${id}, user_id ${userId}, và product_id ${productId}`);
      }
      const result = await this.connection.execute(
        'UPDATE reviews SET rating = ?, comment = ?, updated_at = ? WHERE id = ? AND user_id = ? AND product_id = ?',
        [
          updateReviewDto.rating,
          updateReviewDto.comment,
          new Date(),
          id,
          userId,
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
    

    async deleteByIdUserId(id: number, userId: number): Promise<void> {
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
  
  // async deleteByUserProductId(userId: number, productId: number): Promise<void> {
  //   const result = await this.connection.query(
  //     'DELETE FROM reviews WHERE user_id = ? AND product_id = ?',
  //     [userId, productId],
  //   );
  //   if (result.affectedRows === 0) {
  //     throw new NotFoundException(
  //       `Không tìm thấy đánh giá của user_id ${userId} cho sản phẩm có product_id ${productId}`,
  //     );
  //   }
  // }
}