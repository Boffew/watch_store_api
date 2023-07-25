import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min, Max } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({ example: 4, description: 'Rating value (1-5)' })
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Good product!', description: 'Review comment' })
  @IsNotEmpty()
  comment: string;
}
