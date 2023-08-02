import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateReviewDto } from './dto/createreview.dto';
import { UpdateReviewDto } from './dto/updatereview.dto';
import { Reviews } from './interfaces/reviews.interface';
import { User } from 'src/users/interface/User.interface';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly connection: any,
    private readonly cloudinary: CloudinaryService,
  ) {}
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
        [user.id, productId, reviewDto.rating, reviewDto.comment, new Date()],
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

  async updateByIdUserIdProductId(
    id: number,
    productId: number,
    user: User,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Reviews> {
    try {
      const [existingReview] = await this.connection.execute(
        'SELECT * FROM reviews WHERE id = ? AND user_id = ? AND product_id = ?',
        [id, user.id, productId],
      );

      if (!existingReview) {
        const reviewNotFoundMsg = `Không tìm thấy đánh giá với id ${id}, user_id ${user.id}, và product_id ${productId}`;
        const reviewExists = await this.connection.execute(
          'SELECT * FROM reviews WHERE id = ?',
          [id],
        );
        const productExists = await this.connection.execute(
          'SELECT * FROM products WHERE id = ?',
          [productId],
        );
        if (!reviewExists[0].length) {
          throw new NotFoundException(`Không tìm thấy đánh giá với id ${id}`);
        } else if (!productExists[0].length) {
          throw new NotFoundException(
            `Không tìm thấy sản phẩm với id ${productId}`,
          );
        } else {
          throw new NotFoundException(reviewNotFoundMsg);
        }
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

      if (result[0].affectedRows === 0) {
        throw new NotFoundException(`Không tìm thấy đánh giá với id ${id}`);
      }

      return existingReview as Reviews;
    } catch (error) {
      // Handle errors and return an appropriate response
      console.error(error);
      throw new InternalServerErrorException('Lỗi cập nhật đánh giá');
    }
  }

  async getAllByProductId(productId: number): Promise<Reviews[]> {
    const statement = 'SELECT * FROM reviews WHERE product_id = ?';
    const [rows] = await this.connection.execute(statement, [productId]);
    return rows;
  }

  async deleteByUserId(id, userId) {
    try {
      const existingReview = await this.connection.query(
        'SELECT * FROM reviews WHERE id = ?',
        [id],
      );

      if (!existingReview.length) {
        throw new NotFoundException(`Không tìm thấy đánh giá với id ${id}`);
      }

      const review = existingReview[0];

      if (review.user_id !== userId) {
        throw new ForbiddenException('Bạn không có quyền xóa đánh giá này');
      }

      const result = await this.connection.query(
        'DELETE FROM reviews WHERE id = ? AND user_id = ?',
        [id, userId],
      );

      if (result.affectedRows === 0) {
        throw new NotFoundException(`Không tìm thấy đánh giá với id ${id}`);
      }

      return {
        message: `Đánh giá với id ${id} đã được xóa thành công`,
      };
    } catch (error) {
      // Handle errors and return an appropriate response
      console.error(error);
      throw new InternalServerErrorException('Lỗi xóa đánh giá');
    }
  }

  async getAllByUserId(userId: number): Promise<Reviews[]> {
    try {
      const [rows] = await this.connection.execute(
        'SELECT * FROM reviews WHERE user_id = ?',
        [userId],
      );
      if (rows.length === 0) {
        throw new NotFoundException(
          `Không tìm thấy đánh giá nào cho người dùng có ID ${userId}`,
        );
      }
      return rows;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
