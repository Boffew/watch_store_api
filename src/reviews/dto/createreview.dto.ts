import { ApiProperty } from '@nestjs/swagger';

import { IsInt, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 4, description: 'Rating value (1-5)' })
  @IsInt()
  @Min(1, { message: 'Rating value must be between 1 and 5' })
  @Max(5, { message: 'Rating value must be between 1 and 5' })
  rating: number;

  @ApiProperty({ example: 'Good product!', description: 'Review comment' })
  comment: string;
}
