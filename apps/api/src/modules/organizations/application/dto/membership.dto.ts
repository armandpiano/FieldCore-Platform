import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../../identity/domain/entities/user.entity';
import { MembershipStatus } from '../../domain/entities/membership.entity';

export class CreateMembershipDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;

  @IsEnum(UserRole)
  @IsNotEmpty({ message: 'Role is required' })
  role!: UserRole;
}

export class InviteUserDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsEnum(UserRole)
  @IsNotEmpty({ message: 'Role is required' })
  role!: UserRole;
}

export class UpdateMembershipDto {
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  suspendedReason?: string;
}

export class MembershipResponseDto {
  id!: string;
  userId!: string;
  organizationId!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  fullName!: string;
  role!: string;
  status!: string;
  isActive!: boolean;
  invitedAt?: Date;
  acceptedAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}

export class AcceptInvitationDto {
  @IsString()
  @IsNotEmpty({ message: 'Token is required' })
  token!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName!: string;
}
