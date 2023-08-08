import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { CreateReviewDto } from './dto/createreview.dto';
import { UpdateReviewDto } from './dto/updatereview.dto';
import { Reviews } from './interfaces/reviews.interface';
import { User } from 'src/users/interface/User.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly connection: any,
    private readonly userService: UsersService,
  ) {}
  async createByProductId(
    productId: number,
    reviewDto: CreateReviewDto,
    user: User,
  ): Promise<Reviews> {
    try {
      // Check if product exists before inserting review
      const [[product]] = await this.connection.query(
        'SELECT * FROM products WHERE id = ?',
        [productId],
      );

      if (!product) {
        throw new HttpException(
          `Không tìm thấy sản phẩm có id ${productId}`,
          HttpStatus.NOT_FOUND,
        );
      }

      const [result] = await this.connection.execute(
        'INSERT INTO reviews (user_id, product_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?)',
        [user.id, productId, reviewDto.rating, reviewDto.comment, new Date()],
      );

      if (result.affectedRows !== 1) {
        throw new Error('Không thể tạo đánh giá');
      }

      const [newReview] = await this.connection.execute(
        'SELECT * FROM reviews WHERE id = ?',
        [result.insertId],
      );

      return newReview[0];
    } catch (error) {
      throw error;
    }
  }

  async updateByIdUserIdProductId(
    id: number,
    productId: number,
    user: User,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Reviews> {
    try {
      const [[existingReview]] = await this.connection.execute(
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
      const { user_id } = existingReview;
      if (user_id !== user.id) {
        throw new ForbiddenException(
          'Bạn không có quyền cập nhật đánh giá này',
        );
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
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Lỗi cập nhật đánh giá');
    }
  }

  // async getAllByProductId(productId: number): Promise<Reviews[]> {
  //   const statement = 'SELECT * FROM reviews WHERE product_id = ?';
  //   const [rows] = await this.connection.execute(statement, [productId]);

  //   if (rows.length === 0) {
  //     throw new NotFoundException(
  //       `Không tìm thấy reviews cho sản phẩm với id ${productId}`,
  //     );
  //   }

  //   return rows;
  // }

  async getAllByProductId(productId: number): Promise<Reviews[]> {
    const statement = 'SELECT * FROM reviews WHERE product_id = ?';
    const [rows] = await this.connection.execute(statement, [productId]);

    if (rows.length === 0) {
      throw new NotFoundException(
        `Không tìm thấy reviews cho sản phẩm với id ${productId}`,
      );
    }

    const reviews: Reviews[] = [];

    for (const row of rows) {
      const { user_id, ...reviewData } = row;
      const full_name = await this.getFullNameByUserId(user_id);
      const reviewWithFullName = { ...reviewData, full_name };
      reviews.push(reviewWithFullName);
    }

    return reviews;
  }

  async getFullNameByUserId(userId: number): Promise<string> {
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new NotFoundException(
          `Không tìm thấy người dùng với id ${userId}`,
        );
      }
      return user.full_name;
    } catch (error) {
      throw error;
    }
  }

  async deleteByUserId(id: number, userId: number): Promise<number> {
    try {
      const [[existingReview]] = await this.connection.query(
        'SELECT * FROM reviews WHERE id = ?',
        [id],
      );

      console.log('existingReview:', existingReview);
      console.log('userId:', userId);

      if (!existingReview) {
        throw new NotFoundException(`Không tìm thấy đánh giá với id ${id}`);
      }

      const { user_id } = existingReview;

      if (user_id !== userId) {
        console.log('existingReview.user_id:', user_id);
        console.log('userId:', userId);
        throw new HttpException(
          'Bạn không có quyền xóa đánh giá này',
          HttpStatus.FORBIDDEN,
        );
      }

      const result = await this.connection.query(
        'DELETE FROM reviews WHERE id = ? AND user_id = ?',
        [id, userId],
      );

      if (result.affectedRows === 0) {
        throw new NotFoundException(`Không tìm thấy đánh giá với id ${id}`);
      }

      return id;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  
  async getAllByUserId(userId: number): Promise<Reviews[]> {
    try {
      const statement = 'SELECT * FROM reviews WHERE user_id = ?';
      const [rows] = await this.connection.execute(statement, [userId]);

      if (rows.length === 0) {
        throw new NotFoundException(`Không tìm thấy đánh giá nào cho người dùng có ID ${userId}`);
      }

      return rows as Reviews[];
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
