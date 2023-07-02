import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { UsersService } from '../users/users.service';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {
  }

  async signIn(username: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.usersService.tryFindOne(username);

    if (user == null) throw new UnauthorizedException();
    const passwordsAreMatched = await compare(password, user?.password);
    if (!passwordsAreMatched) throw new UnauthorizedException();

    const payload: JwtPayload = { sub: user.id, username: user.username };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(username: string, password: string): Promise<void> {
    const hashed = await hash(password, SALT_ROUNDS);
    await this.usersService.save(username, hashed);
  }
}
