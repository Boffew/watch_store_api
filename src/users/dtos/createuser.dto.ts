import { IsEmail, IsNotEmpty, IsString }from "class-validator"
export class CreateUserDto{
    @IsNotEmpty()
    @IsString()
    username:string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsString()
    full_name:string;
    phone:string;
    address: string;
    gender:string;
    birthday: Date;
    @IsNotEmpty()
    @IsString()
    password:string;
    @IsNotEmpty()
    password_confirmation:string;
}