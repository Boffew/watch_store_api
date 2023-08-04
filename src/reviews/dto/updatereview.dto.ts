import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateReviewDto {
  
    @ApiProperty({ example: 0, description: 'User ratings for the product' })
    @IsNotEmpty()
    rating: number;

    @ApiProperty({ example: "string", description: 'User comments on the product' })
    @IsNotEmpty()
    comment: string;
}