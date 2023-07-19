import { BadRequestException, Body, Controller,Request, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UploadedFile, UseGuards, ValidationPipe, HttpStatus, HttpException } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ReviewsService } from "./review.service";
import { CreateReviewDto } from "./dto/createreview.dto";
import { UpdateReviewDto } from "./dto/updatereview.dto";
import { Reviews } from "./interfaces/reviews.interface";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { AuthGuard } from "@nestjs/passport";
import { Request as ExpressRequest } from 'express';
import { User } from "src/users/interface/User.interface";
import { Roles } from "src/authorization/decorators/roles.decorator";
import { Role } from "src/authorization/models/role.enum";
import { RolesGuard } from "src/authorization/guards/roles.guard";

@ApiTags('reviews')
@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new review for a product and a user' })
  @ApiResponse({ status: 201, description: 'The created review'})
  @ApiResponse({ status: 404, description: 'Product or user not found' })
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
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/product/:productId')
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

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all reviews for a product by ID' })
  @ApiResponse({ status: 200, description: 'All reviews for the specified product'})
  @Get(':id/reviews')
  async getReviewsByProductId(@Param('id') id: string): Promise<{ message: string, review: Reviews }> {
    const reviews = await this.reviewsService.getAllByProductId(+id);
    if (!reviews) {
      throw new BadRequestException('Unable to get review');
    }
    return { message: 'Review get successfully', review: reviews };
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a review by ID' })
  @ApiResponse({ status: 200, description: 'The review has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteReviewById(@Req() req, @Param('id') id: string): Promise<void> {
    const userId = req.user.id;
    await this.reviewsService.deleteByUserId(parseInt(id, 10), userId);
  }
  
  @ApiBearerAuth('JWT-auth')
  // @ApiBearerAuth()
  // @Roles(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('users/:userId/reviews')
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Lỗi máy chủ' })
  async getAllReviewsByUserId(@Param('userId') userId: number): Promise<Reviews[]> {
    try {
      const reviews = await this.reviewsService.getAllByUserId(userId);
      return reviews;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}


