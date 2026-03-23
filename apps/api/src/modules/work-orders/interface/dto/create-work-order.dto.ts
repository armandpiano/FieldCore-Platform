/**
 * CreateWorkOrderDto - DTO for creating work orders
 */

import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWorkOrderDto {
  @ApiProperty({ example: 'Instalación de aire acondicionado' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Instalar unidad de 2 toneladas en oficina del segundo piso' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'uuid-del-cliente' })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiPropertyOptional({ example: 'uuid-del-sitio' })
  @IsString()
  @IsOptional()
  clientSiteId?: string;

  @ApiProperty({ enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], example: 'MEDIUM' })
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

  @ApiProperty({ example: '2024-03-25T09:00:00Z' })
  @IsDateString()
  scheduledDate: string;

  @ApiPropertyOptional({ example: 120 })
  @IsNumber()
  @IsOptional()
  estimatedDuration?: number;

  @ApiPropertyOptional({ example: 'Cliente requiere acceso especial' })
  @IsString()
  @IsOptional()
  notes?: string;
}
