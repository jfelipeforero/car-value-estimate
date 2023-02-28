import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    const salt = await bcrypt.genSalt();

    const hash = await bcrypt.hash(password, salt);

    const user: User = await this.usersService.create(email, hash);

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch: Boolean = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('bad password');
    }
    return user;
  }
}
