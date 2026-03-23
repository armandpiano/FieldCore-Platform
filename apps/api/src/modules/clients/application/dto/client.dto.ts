import { IsString, IsOptional, IsEnum, IsEmail, MaxLength, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ClientType, ClientStatus } from '../../domain/entities/client.entity';

export class CreateClientDto {
  @IsEnum(ClientType)
  type!: ClientType;

  // Company info
  @IsString()
  @IsOptional()
  @MaxLength(255)
  businessName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  tradeName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(13)
  rfc?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  taxRegime?: string;

  // Individual info
  @IsString()
  @IsOptional()
  @MaxLength(100)
  firstName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  lastName?: string;

  // Contact
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
  secondaryPhone?: string;

  // Address
  @IsString()
  @IsOptional()
  @MaxLength(255)
  street?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  exteriorNumber?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  interiorNumber?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  neighborhood?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  state?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  postalCode?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  country?: string;

  // Metadata
  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  internalCode?: string;
}

export class UpdateClientDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  businessName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  tradeName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(13)
  rfc?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  taxRegime?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  firstName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  lastName?: string;

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
  secondaryPhone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  street?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  exteriorNumber?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  interiorNumber?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  neighborhood?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  state?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  postalCode?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  internalCode?: string;
}

export class ClientResponseDto {
  id!: string;
  organizationId!: string;
  type!: string;
  status!: string;
  businessName?: string;
  tradeName?: string;
  rfc?: string;
  taxRegime?: string;
  firstName?: string;
  lastName?: string;
  displayName!: string;
  email?: string;
  phone?: string;
  secondaryPhone?: string;
  fullAddress!: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
  internalCode?: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class ClientListItemDto {
  id!: string;
  displayName!: string;
  type!: string;
  status!: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  internalCode?: string;
  createdAt!: Date;
}

export class ClientFilterDto {
  @IsEnum(ClientStatus)
  @IsOptional()
  status?: ClientStatus;

  @IsString()
  @IsOptional()
  search?: string;
}
