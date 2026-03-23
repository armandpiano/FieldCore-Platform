import { Injectable } from '@nestjs/common';
import { UserEntity, UserRole } from '../../domain/entities/user.entity';
import { UserRepositoryInterface } from '../../domain/repositories/user.repository.interface';
import { Email } from '../../domain/value-objects/email.value-object';
import { Password } from '../../domain/value-objects/password.value-object';
import { RegisterDto, RegisterResponseDto } from '../dto/register.dto';
import { UpdateProfileDto, UserProfileDto, ChangePasswordDto } from '../dto/user-profile.dto';
import { PaginationDto, PaginatedResult } from '../../../shared/application/dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async register(
    registerDto: RegisterDto,
    organizationId: string,
  ): Promise<RegisterResponseDto> {
    const email = Email.create(registerDto.email);

    const emailExists = await this.userRepository.existsByEmail(email, organizationId);
    if (emailExists) {
      throw new Error('Email already registered in this organization');
    }

    const hashedPassword = await Password.create(registerDto.password);

    const user = UserEntity.create({
      email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: registerDto.role || UserRole.TECHNICIAN,
      organizationId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      email: savedUser.email.value,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      role: savedUser.role,
      organizationId: savedUser.organizationId,
      createdAt: savedUser.props.createdAt,
    };
  }

  async updateProfile(userId: string, updateDto: UpdateProfileDto): Promise<UserProfileDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (updateDto.firstName) {
      user.props.firstName = updateDto.firstName;
    }
    if (updateDto.lastName) {
      user.props.lastName = updateDto.lastName;
    }
    user.props.updatedAt = new Date();

    const updatedUser = await this.userRepository.update(user);

    return {
      id: updatedUser.id,
      email: updatedUser.email.value,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      fullName: updatedUser.fullName,
      role: updatedUser.role,
      organizationId: updatedUser.organizationId,
      isActive: updatedUser.isActive,
      lastLoginAt: updatedUser.lastLoginAt || null,
      createdAt: updatedUser.props.createdAt,
      updatedAt: updatedUser.props.updatedAt,
    };
  }

  async changePassword(userId: string, changeDto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const currentPasswordValid = await user.password.compare(changeDto.currentPassword);
    if (!currentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const newPassword = await Password.create(changeDto.newPassword);
    user.updatePassword(newPassword);

    await this.userRepository.update(user);
  }

  async getUserById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }

  async getUsersByOrganization(
    organizationId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResult<UserProfileDto>> {
    const { users, total } = await this.userRepository.findByOrganizationPaginated(
      organizationId,
      page,
      limit,
    );

    return {
      data: users.map((user) => ({
        id: user.id,
        email: user.email.value,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        organizationId: user.organizationId,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt || null,
        createdAt: user.props.createdAt,
        updatedAt: user.props.updatedAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async deactivateUser(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.deactivate();
    await this.userRepository.update(user);
  }

  async activateUser(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.activate();
    await this.userRepository.update(user);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
