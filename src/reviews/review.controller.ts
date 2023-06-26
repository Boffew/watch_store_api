import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ReviewsService } from "./review.service";
import { CreateReviewDto } from "./dto/createreview.dto";
import { UpdateReviewDto } from "./dto/updatereview.dto";

@ApiTags('reviews')
@Controller('api/reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @ApiOperation({ summary: 'Get all Reviews' })
    @ApiResponse({ status: 200, description: 'All Reviews' })
    @Get()
    async getReviews(@Query('q') q: string, @Query('page') page=1){
        const Reviews= await this.reviewsService.getAll(page,q)
        return Reviews;
    }

    @Get(':id')
    async getReview(@Param('id') id: number) {
        const review = await this.reviewsService.getById(id)
        // return orderitem;
        if (!review) {
            throw new NotFoundException('Reviews not found');
          }
        return review;
    }

    @Post()
    async create(@Body() reviewsData: CreateReviewDto) {
        const review = await this.reviewsService.createNew(reviewsData)
        return  review ;
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    async updateReview(@Param('id') id: number, @Body() reviewsData: UpdateReviewDto) {
      try {
        const review = await this.reviewsService.update(id, reviewsData);
        return review;
      } catch (e) {
        console.log(e); // In ra thông tin lỗi cụ thể
        throw new BadRequestException('Unable to update review');
      }
    }

    @Delete(':id')
    async deleteReview(@Param('id') id: number){
        try {
            await this.reviewsService.delete(id);
            return { message: 'Order has been deleted' };
          } catch (e) {
            return { error: 'Unable to delete order' };
        }
    }
    
}