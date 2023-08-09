import { Module } from '@nestjs/common';
import { ReviewsController } from './review.controller';
import { ReviewsService } from './review.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [CloudinaryModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, UsersService,],
})
export class ReviewsModule {}
