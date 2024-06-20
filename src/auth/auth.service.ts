import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomInt, randomUUID } from 'crypto';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { UserInterface } from './interfaces/user.interface';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { otpCache } from './interfaces/otpCache.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { SignUpDTO } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    readonly jwtService: JwtService,
    readonly mailService: MailService,
    readonly configService: ConfigService,
  ) { }

  async signup(signUpDto: SignUpDTO) {
    const { age, birthday, contact, email, gender, location, name, picture, position } = signUpDto;
    try {
      const checkUser = await this.prisma.user.findUnique({
        where: {
          email
        }
      })
      if (checkUser) {
        return {
          error: "User exist",
          statusCode: 400,
          message: 'User already exists',
        };
      }
      return await this.prisma.user.create({
        data: {
          age,
          birthday,
          contact,
          email,
          gender,
          location,
          name,
          picture,
          position
        }
      })
    }
    catch (error) {
      return {
        statusCode: 501,
        message: 'An error occurred during signup',
        error: "unknown error occured",
      };
    }

  }
  async login(email: string) {
    try {
      let user: UserInterface;
      user = await this.prisma.user.findUniqueOrThrow({
        where: {
          email
        },
        select: {
          id: true,
          position: true
        }
      })

      const otp = randomInt(100000, 1000000); // 6 digit otp
      const otpId = randomUUID();

      this.mailService.sendUsersOtp(email, otp);

      this.cacheManager.set(otpId, { otp, user }, 0); // set for 5 minutes
      return { otpId };
    } catch (error) {
      if (error == 'NotFoundError') {
        throw new UnauthorizedException(['Invalid Email']);
      }
      throw error;
    }
  }

  async verifyOtp(otpId: string, otpNew: number) {
    const otpObject = <otpCache>await this.cacheManager.get(otpId);
    if (otpObject === undefined) {
      throw new UnauthorizedException(['Invalid OTP ID']);
    }
    const { otp, user } = otpObject;
    if (otpNew === otp) {
      this.cacheManager.del(otpId);
      const { accessToken, refreshToken } = await this.generateToken(user);
      this.cacheManager.set(refreshToken, user, 0); //* set for 30 days
      return { accessToken, refreshToken };
    }
    throw new UnauthorizedException(['Invalid OTP']);
  }

  async refresh(refreshToken: string) {
    const user = <UserInterface>await this.cacheManager.get(refreshToken);
    if (user === undefined) {
      throw new UnauthorizedException(['Invalid refresh token']);
    }
    this.cacheManager.del(refreshToken);
    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateToken(user);
    this.cacheManager.set(newRefreshToken, user, 0); //* set for 30 days
    return { accessToken, refreshToken: newRefreshToken };
  }

  async generateToken(user: UserInterface) {
    const accessToken = this.jwtService.sign(user, {
      expiresIn: await this.configService.get('ACCESS_TOKEN_EXPIRY'),
      secret: await this.configService.get('ACCESS_TOKEN_SECRET'),
    });

    const refreshToken = this.jwtService.sign(user, {
      expiresIn: await this.configService.get('REFRESH_TOKEN_EXPIRY'),
      secret: await this.configService.get('REFRESH_TOKEN_SECRET'),
    });

    return { accessToken, refreshToken };
  }
}