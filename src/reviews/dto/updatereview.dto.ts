import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Min, Max, IsInt, IsString } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({ example: 4, description: 'Rating value (1-5)' })
  @IsInt()
  @Transform(({ value }) => Math.round(value)) //để làm tròn giá trị rating về kiểu số nguyên
  @Min(1, { message: 'Rating value must be between 1 and 5' })
  @Max(5, { message: 'Rating value must be between 1 and 5' })
  rating: number;

  @ApiProperty({ example: 'Good product!', description: 'Review comment' })
  @IsString()
  comment: string;
}
