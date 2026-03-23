import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken!: string;
}

export class RefreshTokenResponseDto {
  accessToken!: string;
  refreshToken!: string;
  expiresIn!: number;
  tokenType!: string;
}
