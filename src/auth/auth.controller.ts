import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshDto } from './dto/refresh.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { OtpDto } from './dto/otp.dto';
import {
  loginResponseDoc, otpResponseDoc,
  refreshResponseDoc, signupResponseDoc
} from './responses';
import { SignUpDTO } from './dto/signup.dto';
import { AllExceptionsFilter } from 'src/custom-exception/custom-exception.filter';

@UseFilters(AllExceptionsFilter)
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @signupResponseDoc()
  @Post('signup')
  async signup(@Body() signUpDto: SignUpDTO) {
    return await this.authService.signup(signUpDto);
  }
  @loginResponseDoc()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto.email);
  }

  @otpResponseDoc()
  @Post('otp')
  async verifyOtp(@Body() otpDto: OtpDto) {
    return await this.authService.verifyOtp(otpDto.otpId, otpDto.otp);
  }

  @refreshResponseDoc()
  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    return await this.authService.refresh(refreshDto.refreshToken);
  }
}