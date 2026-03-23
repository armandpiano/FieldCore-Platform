import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUrl, MaxLength } from 'class-validator';
import { PlanType } from '../../domain/entities/organization.entity';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty({ message: 'Organization name is required' })
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Slug is required' })
  @MaxLength(50)
  slug!: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @Optional()
  timezone?: string;
}

export class UpdateOrganizationDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsOptional()
  timezone?: string;
}

export class OrganizationResponseDto {
  id!: string;
  name!: string;
  slug!: string;
  status!: string;
  plan!: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  timezone!: string;
  maxUsers!: number;
  maxTechnicians!: number;
  maxStorageMb!: number;
  currentStorageMb!: number;
  subscriptionExpiresAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}
