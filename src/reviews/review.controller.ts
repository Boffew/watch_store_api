import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ReviewsService } from "./review.service";
import { CreateReviewDto } from "./dto/createreview.dto";
import { UpdateReviewDto } from "./dto/updatereview.dto";
import { Reviews } from "./interfaces/reviews.interface";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";


@ApiTags('reviews')
@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new review for a product and a user' })
  @ApiResponse({ status: 201, description: 'The created review'})
  @ApiResponse({ status: 404, description: 'Product or user not found' })
  @Post('/:productId/user/:userId')
  async createReview(
    @Param('productId', ParseIntPipe) productId: number,
    // @Param('userId', ParseIntPipe) userId: number,
    @Body() reviewDto: CreateReviewDto,
  ) {
    const newReview = await this.reviewsService.createByProductId(productId, reviewDto);
    if (!newReview) {
      throw new NotFoundException(`Cannot create review for product with ID ${productId}`);
    }
    return newReview;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing review by ID, user ID, and product ID' })
  @ApiResponse({ status: 200, description: 'The updated review' })
  @ApiResponse({ status: 400, description: 'Unable to update review' })
  @Put(':id/user/:userId/product/:productId')
  async updateByIdUserIdProductId(
    @Param('id') id: number,
    @Param('userId') userId: number,
    @Param('productId') productId: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<{ message: string, review: Reviews }> {
    const updatedReview = await this.reviewsService.updateByIdUserIdProductId(id, userId, productId, updateReviewDto);
    if (!updatedReview) {
      throw new BadRequestException('Unable to update review');
    }
    return { message: 'Review updated successfully', review: updatedReview };
  }

 
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteReviewById(@Req() req, @Param('id') id: string): Promise<void> {
    const userId = req.user.id;
    await this.reviewsService.deleteByIdUserId(parseInt(id, 10), userId);
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Delete(':productId')
  // async deleteReviewByUserAndProduct(
  //   @Req() req,
  //   @Param('productId') productId: string,
  // ): Promise<void> {
  //   const userId = req.user.id;
  //   await this.reviewsService.deleteByUserProductId(userId, parseInt(productId, 10));
  // }

  // @Post()
  // @UseInterceptors(FileInterceptor('photo', {
  //   storage: diskStorage({
  //     destination: './uploads',
  //     filename: (req, file, cb) => {
  //       const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
  //       return cb(null, `${randomName}${extname(file.originalname)}`);
  //     },
  //   }),
  //   fileFilter: (req, file, cb) => {
  //     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
  //       return cb(new Error('Chỉ được phép tải lên tệp tin ảnh'));
  //     }
  //     cb(null, true);
  //   },
  // }))
  // async uploadPhoto(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  //   // Lưu thông tin file vào cơ sở dữ liệu hoặc làm bất kỳ điều gì khác tùy thuộc vào ứng dụng của bạn
  //   return { message: 'Tải ảnh lên thành công' };
  // }
}