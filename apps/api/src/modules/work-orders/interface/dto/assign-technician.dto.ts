/**
 * AssignTechnicianDto - DTO for assigning technicians
 */

import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignTechnicianDto {
  @ApiProperty({ example: 'uuid-del-tecnico' })
  @IsString()
  @IsNotEmpty()
  technicianId: string;

  @ApiPropertyOptional({ example: 'Priorizar por urgencia' })
  @IsString()
  @IsOptional()
  notes?: string;
}
