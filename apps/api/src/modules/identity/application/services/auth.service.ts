import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserEntity, UserRole } from '../../domain/entities/user.entity';
import { SessionEntity } from '../../domain/entities/session.entity';
import { UserRepositoryInterface } from '../../domain/repositories/user.repository.interface';
import { SessionRepositoryInterface } from '../../domain/repositories/session.repository.interface';
import { LoginDto, LoginResponseDto } from '../dto/login.dto';
import { RefreshTokenDto, RefreshTokenResponseDto } from '../dto/refresh-token.dto';
import { UserProfileDto } from '../dto/user-profile.dto';
import { Email } from '../../domain/value-objects/email.value-object';
import { Password } from '../../domain/value-objects/password.value-object';
import * as crypto from 'crypto';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  organizationId: string;
  type: 'access' | 'refresh';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class AuthService {
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepositoryInterface,
    private readonly sessionRepository: SessionRepositoryInterface,
  ) {
    this.accessTokenExpiry = this.configService.get<string>('JWT_ACCESS_EXPIRES', '15m');
    this.refreshTokenExpiry = this.configService.get<string>('JWT_REFRESH_EXPIRES', '7d');
  }

  async login(
    loginDto: LoginDto,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<LoginResponseDto> {
    const email = Email.create(loginDto.email);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('User account is deactivated');
    }

    const passwordMatch = await user.password.compare(loginDto.password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    user.updateLastLogin();
    await this.userRepository.update(user);

    const tokens = await this.generateTokenPair(user);

    const session = SessionEntity.createNew(
      user.id,
      user.organizationId,
      tokens.refreshToken,
      userAgent,
      ipAddress,
    );
    await this.sessionRepository.save(session);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: this.parseExpiry(this.accessTokenExpiry),
      tokenType: 'Bearer',
      user: {
        id: user.id,
        email: user.email.value,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organizationId: user.organizationId,
      },
    };
  }

  async refreshSession(refreshDto: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
    const session = await this.sessionRepository.findByRefreshToken(refreshDto.refreshToken);

    if (!session) {
      throw new Error('Invalid refresh token');
    }

    if (!session.isValid()) {
      throw new Error('Session expired or revoked');
    }

    const user = await this.userRepository.findById(session.userId);
    if (!user || !user.isActive) {
      throw new Error('User not found or deactivated');
    }

    const newTokens = await this.generateTokenPair(user);

    session.updateRefreshToken(newTokens.refreshToken);
    await this.sessionRepository.update(session);

    return {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
      expiresIn: this.parseExpiry(this.accessTokenExpiry),
      tokenType: 'Bearer',
    };
  }

  async logout(sessionId?: string, refreshToken?: string): Promise<void> {
    if (sessionId) {
      await this.sessionRepository.revoke(sessionId);
    } else if (refreshToken) {
      const session = await this.sessionRepository.findByRefreshToken(refreshToken);
      if (session) {
        await this.sessionRepository.revoke(session.id);
      }
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await this.sessionRepository.revokeAllForUser(userId);
  }

  async getProfile(userId: string): Promise<UserProfileDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email.value,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      role: user.role,
      organizationId: user.organizationId,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt || null,
      createdAt: user.props.createdAt,
      updatedAt: user.props.updatedAt,
    };
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      if (payload.type !== 'access') {
        throw new Error('Invalid token type');
      }
      return payload;
    } catch {
      throw new Error('Invalid or expired token');
    }
  }

  private async generateTokenPair(user: UserEntity): Promise<TokenPair> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email.value,
      role: user.role,
      organizationId: user.organizationId,
      type: 'access',
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.accessTokenExpiry,
    });

    const refreshPayload: JwtPayload = {
      ...payload,
      type: 'refresh',
    };

    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: this.refreshTokenExpiry,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseExpiry(this.accessTokenExpiry),
    };
  }

  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 900;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      default: return 900;
    }
  }
}
