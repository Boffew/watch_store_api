import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateReviewDto {
  
    @ApiProperty({ example: 0, description: '' })
    @IsNotEmpty()
    @IsNumber()
    rating: number;

    @ApiProperty({ example: "string", description: '' })
    @IsNotEmpty()
    comment: string;
}

