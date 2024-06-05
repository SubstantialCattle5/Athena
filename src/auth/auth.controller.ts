import {
  Controller,
  Get,
  UseGuards,
  Request,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CheckTokenExpiryGuard } from './guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google Login' })
  @ApiResponse({ status: 302, description: 'Redirects to Google login page.' })
  googleLogin() { }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google Login Callback' })
  @ApiResponse({ status: 302, description: 'Handles Google login callback and redirects to profile.' })
  async googleLoginCallBack(@Request() req, @Res() res: Response) {
    const googleToken = req.user.accessToken;
    const googleRefreshToken = req.user.refreshToken;

    await this.authService.handleGoogleLogin(req.user);

    res.cookie('access_token', googleToken, { httpOnly: true });
    res.cookie('refresh_token', googleRefreshToken, { httpOnly: true });

    res.redirect('http://localhost:3000/auth/profile');
  }

  @UseGuards(CheckTokenExpiryGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get User Profile' })
  @ApiResponse({ status: 200, description: 'Returns the user profile.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req) {
    const accessToken = req.cookies['access_token'];
    if (accessToken)
      return (await this.authService.getProfile(accessToken)).data;
    throw new UnauthorizedException('No access token');
  }

  @Get('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 302, description: 'Clears cookies and redirects to homepage.' })
  logout(@Req() req, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    this.authService.revokeGoogleToken(refreshToken);
    res.redirect('http://localhost:3000/');
  }
}
