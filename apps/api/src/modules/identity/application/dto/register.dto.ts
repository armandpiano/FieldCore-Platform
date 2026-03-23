import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { UserRole } from '../../domain/entities/user.entity';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName!: string;

  @IsEnum(UserRole, { message: 'Invalid role' })
  @IsOptional()
  role?: UserRole;
}

export class RegisterResponseDto {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  role!: string;
  organizationId!: string;
  createdAt!: Date;
}
