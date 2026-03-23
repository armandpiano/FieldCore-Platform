import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../../application/services/user.service';
import { AuthService } from '../../application/services/auth.service';
import { RegisterDto, RegisterResponseDto } from '../../application/dto/register.dto';
import { UpdateProfileDto, UserProfileDto, ChangePasswordDto } from '../../application/dto/user-profile.dto';
import { UserProfileDto as UserProfileResponse } from '../../application/dto/user-profile.dto';
import { CurrentUser } from '../../../shared/interface/decorators/current-user.decorator';
import { Roles } from '../../../shared/interface/decorators/roles.decorator';
import { AuthenticatedUser } from '../strategies/jwt.strategy';
import { UserRole } from '../../domain/entities/user.entity';
import { PaginationDto } from '../../../shared/application/dto/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('profile')
  async getProfile(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserProfileDto> {
    return this.authService.getProfile(user.id);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateDto: UpdateProfileDto,
  ): Promise<UserProfileDto> {
    return this.userService.updateProfile(user.id, updateDto);
  }

  @Put('profile/password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() changeDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.userService.changePassword(user.id, changeDto);
    return { message: 'Password changed successfully' };
  }

  @Post()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async register(
    @Body() registerDto: RegisterDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<RegisterResponseDto> {
    return this.userService.register(registerDto, user.organizationId);
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR)
  async listUsers(
    @CurrentUser() user: AuthenticatedUser,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.userService.getUsersByOrganization(
      user.organizationId,
      paginationDto.page || 1,
      paginationDto.limit || 20,
    );
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR)
  async getUser(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserProfileDto> {
    const profile = await this.authService.getProfile(id);
    if (profile.organizationId !== user.organizationId) {
      throw new Error('User not found');
    }
    return profile;
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async deactivateUser(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ message: string }> {
    await this.userService.deactivateUser(id);
    return { message: 'User deactivated successfully' };
  }

  @Patch(':id/activate')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async activateUser(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ message: string }> {
    await this.userService.activateUser(id);
    return { message: 'User activated successfully' };
  }

  @Patch(':id/role')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async changeUserRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ message: string }> {
    const profile = await this.authService.getProfile(id);
    if (profile.organizationId !== user.organizationId) {
      throw new Error('User not found');
    }
    if (id === user.id) {
      throw new Error('Cannot change your own role');
    }
    await this.userService.activateUser(id);
    return { message: 'User role changed successfully' };
  }
}
