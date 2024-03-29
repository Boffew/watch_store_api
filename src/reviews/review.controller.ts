import {
  BadRequestException,
  Body,
  Controller,
  Request,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  HttpStatus,
  HttpException,
  UsePipes,
  ValidationPipe,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReviewsService } from './review.service';
import { CreateReviewDto } from './dto/createreview.dto';
import { UpdateReviewDto } from './dto/updatereview.dto';
import { Reviews } from './interfaces/reviews.interface';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/interface/User.interface';
import { RolesGuard } from 'src/authorization/guards/roles.guard';

@ApiTags('reviews')
@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new review for a product and a user' })
  @ApiResponse({ status: 201, description: 'The created review' })
  @ApiResponse({ status: 404, description: 'Product or user not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard('jwt'))
  @Post(':productId')
  async create(
    @Param('productId') productId: string,
    @Body() reviewDto: CreateReviewDto,
    @Request() req,
  ) {
    const user = req.user;
    const review = await this.reviewsService.createByProductId(
      parseInt(productId),
      reviewDto,
      user,
    );
    return review;
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a review by ID, product ID, and user ID' })
  @ApiResponse({ status: 200, description: 'The updated review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard('jwt'))
  @Put(':id/product/:productId')
  async updateReview(
    @Param('id') id: number,
    @Param('productId') productId: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req: any,
  ) {
    const user: User = req.user;
    try {
      const updatedReview = await this.reviewsService.updateByIdUserIdProductId(
        id,
        productId,
        user,
        updateReviewDto,
      );
      return updatedReview;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // @ApiBearerAuth('JWT-auth')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiOperation({ summary: 'Get all reviews for a product by ID' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'All reviews for the specified product',
  // })
  @Get(':productId')
  async getAllByProductId(@Param('productId') productId: number): Promise<Reviews[]> {
    return this.reviewsService.getAllByProductId(productId);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a review by ID' })
  @ApiResponse({
    status: 200,
    description: 'The review has been successfully deleted.',
  })

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteReview(
    @Param('id') id: number,
    @Request() req,
  ): Promise<{ message: string }> {
    const userId = req.user.id;

    await this.reviewsService.deleteByUserId(id, userId);

    return { message: `Đã xoá đánh giá với id ${id}` };
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Lỗi máy chủ',
  })
  // @Get('user')
  // async getAllByUserId(@Req() req) {
  //   const userId = req.user.id; 
  //   const Reviews = await this.reviewsService.getAllByUserId(userId);
  //   return { Reviews };
  // }
  @Get('user/:userId')
  async getAllByUserId(@Req() req): Promise<Reviews[]> {
    try {
      const userId = req.user.id; 
      return await this.reviewsService.getAllByUserId(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException('An error occurred while retrieving reviews by user ID.');
      }
    }
  }
}
