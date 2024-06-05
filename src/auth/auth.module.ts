import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './stratergies/google.stratergy';

@Module({
  imports:[PassportModule],
  controllers: [AuthController],
  providers: [AuthService,GoogleStrategy],
})
export class AuthModule {}
