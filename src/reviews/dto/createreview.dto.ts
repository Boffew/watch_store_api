import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateReviewDto {

    @ApiProperty({ example: 0, description: 'The ID of the User' })
    @IsNotEmpty()
    user_id: number;

    @ApiProperty({ example: 0, description: 'The ID of the order' })
    @IsNotEmpty()
    product_id: number;

    @ApiProperty({ example: 0, description: 'User ratings for the product' })
    @IsNotEmpty()
    rating: number;

    @ApiProperty({ example: "string", description: 'User comments on the product' })
    @IsNotEmpty()
    comment: string;
}