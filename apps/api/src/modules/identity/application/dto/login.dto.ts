import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password!: string;
}

export class LoginResponseDto {
  accessToken!: string;
  refreshToken!: string;
  expiresIn!: number;
  tokenType!: string;
  user!: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    organizationId: string;
  };
}
