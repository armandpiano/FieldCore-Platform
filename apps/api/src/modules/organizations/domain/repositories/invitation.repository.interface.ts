import { InvitationEntity } from '../entities/invitation.entity';

export interface InvitationRepositoryInterface {
  findById(id: string): Promise<InvitationEntity | null>;
  findByToken(token: string): Promise<InvitationEntity | null>;
  findByEmail(email: string): Promise<InvitationEntity[]>;
  findByOrganization(organizationId: string): Promise<InvitationEntity[]>;
  findPendingByOrganization(organizationId: string): Promise<InvitationEntity[]>;
  findPendingByEmail(email: string): Promise<InvitationEntity[]>;
  save(invitation: InvitationEntity): Promise<InvitationEntity>;
  update(invitation: InvitationEntity): Promise<InvitationEntity>;
  delete(id: string): Promise<void>;
  deleteExpired(): Promise<number>;
}
