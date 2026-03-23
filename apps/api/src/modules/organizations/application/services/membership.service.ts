import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import * as crypto from 'crypto';
import { MembershipEntity, MembershipStatus } from '../../domain/entities/membership.entity';
import { InvitationEntity, InvitationStatus } from '../../domain/entities/invitation.entity';
import { UserEntity, UserRole } from '../../../identity/domain/entities/user.entity';
import { MembershipRepositoryInterface } from '../../domain/repositories/membership.repository.interface';
import { InvitationRepositoryInterface } from '../../domain/repositories/invitation.repository.interface';
import { UserRepositoryInterface } from '../../../identity/domain/repositories/user.repository.interface';
import { OrganizationRepositoryInterface } from '../../domain/repositories/organization.repository.interface';
import { CreateMembershipDto, InviteUserDto, MembershipResponseDto } from '../dto/membership.dto';
import { Password } from '../../../identity/domain/value-objects/password.value-object';
import { Email } from '../../../identity/domain/value-objects/email.value-object';

@Injectable()
export class MembershipService {
  constructor(
    private readonly membershipRepository: MembershipRepositoryInterface,
    private readonly invitationRepository: InvitationRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly organizationRepository: OrganizationRepositoryInterface,
  ) {}

  async createUser(
    createDto: CreateMembershipDto,
    organizationId: string,
    createdBy: string,
  ): Promise<{ user: UserEntity; membership: MembershipEntity }> {
    // Check organization limits
    const organization = await this.organizationRepository.findById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const currentUserCount = await this.membershipRepository.countByOrganization(organizationId);
    if (!organization.canAddUser(currentUserCount)) {
      throw new BadRequestException(
        `Organization has reached the maximum number of users (${organization.maxUsers})`,
      );
    }

    // Check if user already exists in organization
    const email = Email.create(createDto.email);
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      const existingMembership = await this.membershipRepository.findByUserAndOrganization(
        existingUser.id,
        organizationId,
      );
      if (existingMembership) {
        throw new BadRequestException('User already exists in this organization');
      }
    }

    // Create user
    const password = await Password.create(createDto.password);
    const user = UserEntity.create({
      email,
      password,
      firstName: createDto.firstName,
      lastName: createDto.lastName,
      role: createDto.role,
      organizationId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedUser = await this.userRepository.save(user);

    // Create membership
    const membership = MembershipEntity.create({
      userId: savedUser.id,
      organizationId,
      role: createDto.role,
      status: MembershipStatus.ACTIVE,
      acceptedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedMembership = await this.membershipRepository.save(membership);

    return { user: savedUser, membership: savedMembership };
  }

  async inviteUser(
    inviteDto: InviteUserDto,
    organizationId: string,
    invitedBy: string,
  ): Promise<InvitationEntity> {
    // Check organization limits
    const organization = await this.organizationRepository.findById(organizationId);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const currentUserCount = await this.membershipRepository.countByOrganization(organizationId);
    if (!organization.canAddUser(currentUserCount)) {
      throw new BadRequestException(
        `Organization has reached the maximum number of users (${organization.maxUsers})`,
      );
    }

    // Check if email already invited
    const email = Email.create(inviteDto.email);
    const pendingInvitations = await this.invitationRepository.findPendingByEmail(email.value);
    const existingInOrg = pendingInvitations.find(i => i.organizationId === organizationId);
    if (existingInOrg) {
      throw new BadRequestException('There is already a pending invitation for this email');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      const existingMembership = await this.membershipRepository.findByUserAndOrganization(
        existingUser.id,
        organizationId,
      );
      if (existingMembership) {
        throw new BadRequestException('User already belongs to this organization');
      }
    }

    // Create invitation
    const token = crypto.randomBytes(32).toString('hex');
    const invitation = InvitationEntity.create(
      inviteDto.email,
      organizationId,
      organization.name,
      inviteDto.role,
      invitedBy,
      token,
    );

    return this.invitationRepository.save(invitation);
  }

  async acceptInvitation(
    token: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<{ user: UserEntity; membership: MembershipEntity }> {
    const invitation = await this.invitationRepository.findByToken(token);
    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (!invitation.isPending) {
      throw new BadRequestException('Invitation is no longer valid');
    }

    if (invitation.isExpired) {
      invitation.expire();
      await this.invitationRepository.update(invitation);
      throw new BadRequestException('Invitation has expired');
    }

    // Check if user already exists
    const email = Email.create(invitation.email);
    let user = await this.userRepository.findByEmail(email);
    let membership: MembershipEntity;

    if (user) {
      // User exists, create membership
      membership = MembershipEntity.createFromInvite(
        user.id,
        invitation.organizationId,
        invitation.role,
        invitation.invitedBy,
      );
      membership.accept();
    } else {
      // Create new user
      const hashedPassword = await Password.create(password);
      user = UserEntity.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: invitation.role,
        organizationId: invitation.organizationId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      user = await this.userRepository.save(user);

      membership = MembershipEntity.createFromInvite(
        user.id,
        invitation.organizationId,
        invitation.role,
        invitation.invitedBy,
      );
      membership.accept();
    }

    // Mark invitation as accepted
    invitation.accept();
    await this.invitationRepository.update(invitation);

    // Save membership
    const savedMembership = await this.membershipRepository.save(membership);

    return { user, membership: savedMembership };
  }

  async listMemberships(
    organizationId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ memberships: MembershipEntity[]; total: number }> {
    return this.membershipRepository.findByOrganizationPaginated(organizationId, page, limit);
  }

  async changeUserRole(
    membershipId: string,
    newRole: UserRole,
    changedBy: string,
  ): Promise<MembershipEntity> {
    const membership = await this.membershipRepository.findById(membershipId);
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    if (newRole === UserRole.OWNER) {
      throw new BadRequestException('Cannot assign OWNER role');
    }

    membership.changeRole(newRole);
    return this.membershipRepository.update(membership);
  }

  async deactivateUser(
    membershipId: string,
    deactivatedBy: string,
    reason?: string,
  ): Promise<MembershipEntity> {
    const membership = await this.membershipRepository.findById(membershipId);
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    if (membership.isOwner()) {
      throw new ForbiddenException('Cannot deactivate organization owner');
    }

    if (membershipId === deactivatedBy) {
      throw new ForbiddenException('Cannot deactivate yourself');
    }

    membership.suspend(reason);
    return this.membershipRepository.update(membership);
  }

  async reactivateUser(
    membershipId: string,
    reactivatedBy: string,
  ): Promise<MembershipEntity> {
    const membership = await this.membershipRepository.findById(membershipId);
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    membership.reactivate();
    return this.membershipRepository.update(membership);
  }

  async removeUser(
    membershipId: string,
    removedBy: string,
  ): Promise<void> {
    const membership = await this.membershipRepository.findById(membershipId);
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    if (membership.isOwner()) {
      throw new ForbiddenException('Cannotremove organization owner');
    }

    await this.membershipRepository.delete(membershipId);
  }

  async getMembershipWithUser(membershipId: string): Promise<{
    membership: MembershipEntity;
    user: UserEntity;
  }> {
    const membership = await this.membershipRepository.findById(membershipId);
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    const user = await this.userRepository.findById(membership.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { membership, user };
  }

  async getUserMemberships(userId: string): Promise<MembershipEntity[]> {
    return this.membershipRepository.findByUserId(userId);
  }

  async cancelInvitation(
    invitationId: string,
    cancelledBy: string,
  ): Promise<void> {
    const invitation = await this.invitationRepository.findById(invitationId);
    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    invitation.cancel();
    await this.invitationRepository.update(invitation);
  }

  async listPendingInvitations(organizationId: string): Promise<InvitationEntity[]> {
    return this.invitationRepository.findPendingByOrganization(organizationId);
  }
}
