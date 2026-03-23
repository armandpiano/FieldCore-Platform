import { MembershipEntity } from '../entities/membership.entity';
import { UserRole } from '../../identity/domain/entities/user.entity';

export interface MembershipRepositoryInterface {
  findById(id: string): Promise<MembershipEntity | null>;
  findByUserId(userId: string): Promise<MembershipEntity[]>;
  findByUserAndOrganization(userId: string, organizationId: string): Promise<MembershipEntity | null>;
  findByOrganization(organizationId: string): Promise<MembershipEntity[]>;
  findByOrganizationPaginated(
    organizationId: string,
    page: number,
    limit: number,
  ): Promise<{ memberships: MembershipEntity[]; total: number }>;
  findActiveByOrganization(organizationId: string): Promise<MembershipEntity[]>;
  countByOrganization(organizationId: string): Promise<number>;
  existsByUserAndOrganization(userId: string, organizationId: string): Promise<boolean>;
  save(membership: MembershipEntity): Promise<MembershipEntity>;
  update(membership: MembershipEntity): Promise<MembershipEntity>;
  delete(id: string): Promise<void>;
  deleteByUserAndOrganization(userId: string, organizationId: string): Promise<void>;
}
