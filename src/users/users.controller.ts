import { Body, Controller, Get, Post, Query, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/createuser.dto';

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}
    @Get()
    async getUsers(@Query('page') page:number, @Query('search') search: string){
        const users = await this.usersService.getAll(page, search);
        return users
    }
    @Post('register')
    @UsePipes(new ValidationPipe)
    async register(@Body() user: CreateUserDto){
       const newuser= this.usersService.createNew(user)
       return newuser
    }
}
