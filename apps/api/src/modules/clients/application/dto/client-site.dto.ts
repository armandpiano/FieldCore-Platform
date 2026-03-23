import { IsString, IsOptional, IsEnum, IsNumber, MaxLength, Min, Max } from 'class-validator';
import { SiteType } from '../../domain/entities/client-site.entity';

export class CreateClientSiteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsEnum(SiteType)
  type!: SiteType;

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

  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  contactName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  contactPhone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  contactEmail?: string;

  @IsString()
  @IsOptional()
  accessInstructions?: string;

  @IsString()
  @IsOptional()
  securityInstructions?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  workingHours?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateClientSiteDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsEnum(SiteType)
  @IsOptional()
  type?: SiteType;

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

  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  contactName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  contactPhone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  contactEmail?: string;

  @IsString()
  @IsOptional()
  accessInstructions?: string;

  @IsString()
  @IsOptional()
  securityInstructions?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  workingHours?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ClientSiteResponseDto {
  id!: string;
  clientId!: string;
  organizationId!: string;
  name!: string;
  type!: string;
  isMain!: boolean;
  fullAddress!: string;
  street?: string;
  exteriorNumber?: string;
  interiorNumber?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  accessInstructions?: string;
  securityInstructions?: string;
  workingHours?: string;
  notes?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
