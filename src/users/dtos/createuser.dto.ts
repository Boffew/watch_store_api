import { IsEmail, IsNotEmpty, IsString }from "class-validator"
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username:string;
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    full_name:string;
    @ApiProperty()
    phone:string;
    @ApiProperty()
    address: string;
    @ApiProperty()
    gender:string;
    @ApiProperty()
    birthday: Date;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password:string;
    @ApiProperty()
    @IsNotEmpty()
    password_confirmation:string;
}