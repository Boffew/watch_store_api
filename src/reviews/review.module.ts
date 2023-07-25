import { Module } from '@nestjs/common';
import { ReviewsController } from './review.controller';
import { ReviewsService } from './review.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
