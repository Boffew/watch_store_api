import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto
{
    @ApiProperty({
        description: 'The username of the user',
        example: 'name',
      })
    @IsString()
    username:string;
    @ApiProperty({
        description: 'The password of the user',
        example: 'pass',
      })
    @IsString()
    password:string;
}