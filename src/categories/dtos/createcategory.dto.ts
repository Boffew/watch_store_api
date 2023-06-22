import { IsNotEmpty, IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';
export class CreateCategoryDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @ApiProperty()
    @Length(20,100)
    description: string;
    @ApiProperty()
    image_url: string;
}