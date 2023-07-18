import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty, IsNumber } from "class-validator";

export class CreateReviewDto {

    // @ApiProperty({ example: 0, description: 'The ID of the User' })
    // @IsNotEmpty()
    // user_id: number;

    // @ApiProperty({ example: 0, description: 'The ID of the order' })
    // @IsNotEmpty()
    // product_id: number;

    @ApiProperty({ example: 0, description: '' })
    @IsNotEmpty()
    @IsNumber()
    rating: number;

    @ApiProperty({ example: "string", description: '' })
    @IsEmpty()
    comment: string;
}