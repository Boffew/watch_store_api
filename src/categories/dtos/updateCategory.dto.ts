import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';
export class UpdateCategoryDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    name: string;
    @Length(20,100)
    @IsOptional()
    @ApiProperty()
    description: string;
    @ApiProperty()
    image_url: string;
}