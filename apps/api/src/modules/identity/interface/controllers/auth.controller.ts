import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../../application/services/auth.service';
import { LoginDto, LoginResponseDto } from '../../application/dto/login.dto';
import { RefreshTokenDto, RefreshTokenResponseDto } from '../../application/dto/refresh-token.dto';
import { Public } from '../../../shared/interface/decorators/public.decorator';
import { CurrentUser } from '../../../shared/interface/decorators/current-user.decorator';
import { AuthenticatedUser } from '../strategies/jwt.strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Req() request: Request,
  ): Promise<LoginResponseDto> {
    const userAgent = request.headers['user-agent'];
    const ipAddress = request.ip || request.socket.remoteAddress;

    try {
      return await this.authService.login(loginDto, userAgent, ipAddress);
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() refreshDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    try {
      return await this.authService.refreshSession(refreshDto);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Body() refreshDto: RefreshTokenDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ message: string }> {
    await this.authService.logout(undefined, refreshDto.refreshToken);
    return { message: 'Logged out successfully' };
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAll(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ message: string }> {
    await this.authService.logoutAll(user.id);
    return { message: 'All sessions logged out successfully' };
  }

  @Post('me')
  @HttpCode(HttpStatus.OK)
  async getProfile(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AuthenticatedUser> {
    return user;
  }
}
