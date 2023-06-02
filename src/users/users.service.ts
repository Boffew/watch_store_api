import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    constructor(@Inject('DATABASE_CONNECTION') private readonly connection: any ){}


    
    async findAll() {
        const [rows] = await this.connection.execute('SELECT * FROM users');
        return rows;
    }
}
