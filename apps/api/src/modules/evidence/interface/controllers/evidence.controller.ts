import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EvidenceService } from '../../application/services/evidence.service';
import { CreatePhotoDto, CreateSignatureDto, CreateCommentDto, EvidenceFilterDto } from '../../application/dto/evidence.dto';
import { CurrentUser } from '../../../shared/interface/decorators/current-user.decorator';
import { Roles } from '../../../shared/interface/decorators/roles.decorator';
import { AuthenticatedUser } from '../../identity/interface/strategies/jwt.strategy';
import { UserRole } from '../../identity/domain/entities/user.entity';
import { PaginationDto } from '../../../shared/application/dto/pagination.dto';

@Controller('work-orders/:workOrderId/evidence')
export class EvidenceController {
  constructor(private readonly evidenceService: EvidenceService) {}

  @Post('photos')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  }))
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.TECHNICIAN)
  @HttpCode(HttpStatus.CREATED)
  async uploadPhoto(
    @Param('workOrderId') workOrderId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createPhotoDto: CreatePhotoDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.evidenceService.uploadPhoto(
      user.organizationId,
      user.id,
      workOrderId,
      {
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        buffer: file.buffer,
      },
      {
        latitude: createPhotoDto.latitude,
        longitude: createPhotoDto.longitude,
        locationAddress: createPhotoDto.locationAddress,
      },
    );
  }

  @Post('files')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  }))
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.TECHNICIAN)
  @HttpCode(HttpStatus.CREATED)
  async uploadFile(
    @Param('workOrderId') workOrderId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.evidenceService.uploadFile(
      user.organizationId,
      user.id,
      workOrderId,
      {
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        buffer: file.buffer,
      },
    );
  }

  @Post('signature')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.TECHNICIAN)
  @HttpCode(HttpStatus.CREATED)
  async registerSignature(
    @Param('workOrderId') workOrderId: string,
    @Body() createSignatureDto: CreateSignatureDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    createSignatureDto.workOrderId = workOrderId;
    return this.evidenceService.registerSignature(
      user.organizationId,
      user.id,
      createSignatureDto,
    );
  }

  @Post('comments')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.TECHNICIAN)
  @HttpCode(HttpStatus.CREATED)
  async addComment(
    @Param('workOrderId') workOrderId: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    createCommentDto.workOrderId = workOrderId;
    return this.evidenceService.addComment(
      user.organizationId,
      user.id,
      createCommentDto,
    );
  }

  @Get()
  async listEvidence(
    @Param('workOrderId') workOrderId: string,
    @Query() filterDto: EvidenceFilterDto,
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.evidenceService.listWorkOrderEvidence(
      workOrderId,
      user.organizationId,
      filterDto,
      paginationDto.page || 1,
      paginationDto.limit || 50,
    );
  }

  @Get('stats')
  async getEvidenceStats(@Param('workOrderId') workOrderId: string) {
    return this.evidenceService.getWorkOrderEvidenceStats(workOrderId);
  }

  @Get('comments')
  async getComments(
    @Param('workOrderId') workOrderId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.evidenceService.getComments(
      workOrderId,
      paginationDto.page || 1,
      paginationDto.limit || 20,
    );
  }

  @Get('signatures')
  async getSignatures(@Param('workOrderId') workOrderId: string) {
    return this.evidenceService.getSignatures(workOrderId);
  }

  @Get(':id')
  async getEvidenceDetail(
    @Param('workOrderId') workOrderId: string,
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.evidenceService.getEvidenceDetail(id, user.organizationId);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEvidence(
    @Param('workOrderId') workOrderId: string,
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.evidenceService.deleteEvidence(id, user.organizationId);
  }
}

@Controller('evidence')
export class EvidenceDirectController {
  constructor(private readonly evidenceService: EvidenceService) {}

  @Get(':id')
  async getEvidence(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.evidenceService.getEvidenceDetail(id, user.organizationId);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEvidence(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.evidenceService.deleteEvidence(id, user.organizationId);
  }
}
