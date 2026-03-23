import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../../identity/domain/entities/user.entity';

export class CreateInvitationDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsEnum(UserRole)
  @IsNotEmpty({ message: 'Role is required' })
  role!: UserRole;
}

export class InvitationResponseDto {
  id!: string;
  email!: string;
  organizationId!: string;
  organizationName!: string;
  role!: string;
  status!: string;
  expiresAt!: Date;
  invitedAt!: Date;
  createdAt!: Date;
}

export class AcceptInvitationDto {
  @IsNotEmpty({ message: 'Token is required' })
  token!: string;

  @IsNotEmpty({ message: 'Password is required' })
  password!: string;

  @IsNotEmpty({ message: 'First name is required' })
  firstName!: string;

  @IsNotEmpty({ message: 'Last name is required' })
  lastName!: string;
}
