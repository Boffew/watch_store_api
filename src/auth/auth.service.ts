import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CartsService } from 'src/carts/carts.service';
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,private jwtService: JwtService, private cartService: CartsService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getByName(username);
    const isMatch = await bcrypt.compare(pass, user.password);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;

    }
    return null;
  }
  async login(user: any) {
    const payload = user
    const cart=  await this.cartService.createNew(user.id)
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}