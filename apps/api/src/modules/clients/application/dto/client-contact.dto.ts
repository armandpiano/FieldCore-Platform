import { IsString, IsOptional, IsEnum, IsEmail, MaxLength } from 'class-validator';
import { ContactRole } from '../../domain/entities/client-contact.entity';

export class CreateClientContactDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string;

  @IsEnum(ContactRole)
  role!: ContactRole;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  mobilePhone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  position?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  department?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateClientContactDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  firstName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  lastName?: string;

  @IsEnum(ContactRole)
  @IsOptional()
  role?: ContactRole;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  mobilePhone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  position?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  department?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ClientContactResponseDto {
  id!: string;
  clientId!: string;
  organizationId!: string;
  firstName!: string;
  lastName!: string;
  fullName!: string;
  role!: string;
  email?: string;
  phone?: string;
  mobilePhone?: string;
  position?: string;
  department?: string;
  isPrimary!: boolean;
  notes?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
