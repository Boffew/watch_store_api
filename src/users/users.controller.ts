import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/createuser.dto';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { Roles } from 'src/authorization/decorators/roles.decorator';
import { Role } from 'src/authorization/models/role.enum';
import { RolesGuard } from 'src/authorization/guards/roles.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
@Controller('api')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Get('admin/users')
    async getUsers(@Query('page') page:number, @Query('search') search: string){
        const users = await this.usersService.getAll(page, search);
        return users
    }

    @Post('users/register')
    @UsePipes(new ValidationPipe)
    async register(@Body() user: CreateUserDto){
       const newuser= this.usersService.createNew(user)
       return newuser
    }
    
}
