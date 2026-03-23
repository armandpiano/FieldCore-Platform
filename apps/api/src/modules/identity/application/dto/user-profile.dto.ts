export class UserProfileDto {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  fullName!: string;
  role!: string;
  organizationId!: string;
  isActive!: boolean;
  lastLoginAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}

export class UpdateProfileDto {
  firstName?: string;
  lastName?: string;
}

export class ChangePasswordDto {
  currentPassword!: string;
  newPassword!: string;
}
