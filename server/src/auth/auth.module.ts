import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { getJwtSecret } from './secrtet';

@Module({
  imports: [UsersModule, JwtModule.register({
    global: true,
    secret: getJwtSecret(),
    signOptions: { expiresIn: '30d' },
  })],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {
}
