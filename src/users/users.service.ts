import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/createuser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
   
    constructor(@Inject('DATABASE_CONNECTION') private readonly connection: any ){}

    async getUserById(userId: number) {
        const [rows] = await this.connection.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return rows[0];
    }
    
    async getAll(page=1, searchTerm?: string){
        const perpage =20;
        let query= 'SELECT * FROM users';
        const params=[]
        if (searchTerm) {
            query+=' WHERE username like ? or email like ?'
            params.push(`%${searchTerm}%`, `%${searchTerm}%`)
    }
        const offset = (page -1)* perpage;
        const limit = perpage
        query+= ` LIMIT ${offset}, ${limit}`
        const [rows] = await this.connection.execute(query, params);
        return rows;
    }
    async createNew(userDto: CreateUserDto){
        if(userDto.password !== userDto.password_confirmation){
            throw new HttpException('password confirmation does not match', HttpStatus.CONFLICT)
        }
        try{
        const salt = await bcrypt.genSalt();
        const inputPass =userDto.password;
        const hashedPassword = await bcrypt.hash(inputPass, salt);
        const result= await this.connection.query('INSERT INTO users (username,password,email,full_name,phone,address,gender,birthday,role,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)', [userDto.username, hashedPassword, userDto.email, userDto.full_name, userDto.phone,userDto.address,userDto.gender,userDto.birthday,'Customer',new Date(),new Date()])
        const id = result[0].insertId;
        const [newUser] = await this.connection.query(
            'SELECT * FROM users WHERE id = ?',[id])
            return newUser[0];}
        catch (error){
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getByName(name:string){
        const [newUser] = await this.connection.query('SELECT * FROM users WHERE username = ?',[name])
        if(newUser[0]){
        return newUser[0]}

        else{ throw new HttpException('user is not found', HttpStatus.NOT_FOUND)}
    }
    async update(){
        
    }
}
