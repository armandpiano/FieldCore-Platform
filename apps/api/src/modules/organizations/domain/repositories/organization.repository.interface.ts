import { OrganizationEntity } from '../entities/organization.entity';

export interface OrganizationRepositoryInterface {
  findById(id: string): Promise<OrganizationEntity | null>;
  findBySlug(slug: string): Promise<OrganizationEntity | null>;
  findByOwnerId(ownerId: string): Promise<OrganizationEntity | null>;
  findAll(page: number, limit: number): Promise<{ organizations: OrganizationEntity[]; total: number }>;
  existsBySlug(slug: string): Promise<boolean>;
  save(organization: OrganizationEntity): Promise<OrganizationEntity>;
  update(organization: OrganizationEntity): Promise<OrganizationEntity>;
  delete(id: string): Promise<void>;
}
