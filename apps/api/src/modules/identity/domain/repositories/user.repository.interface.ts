import { UserEntity } from '../entities/user.entity';
import { Email } from '../value-objects/email.value-object';

export interface UserRepositoryInterface {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: Email): Promise<UserEntity | null>;
  findByOrganization(organizationId: string): Promise<UserEntity[]>;
  findByOrganizationPaginated(
    organizationId: string,
    page: number,
    limit: number,
  ): Promise<{ users: UserEntity[]; total: number }>;
  existsByEmail(email: Email, organizationId: string): Promise<boolean>;
  save(user: UserEntity): Promise<UserEntity>;
  update(user: UserEntity): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}
