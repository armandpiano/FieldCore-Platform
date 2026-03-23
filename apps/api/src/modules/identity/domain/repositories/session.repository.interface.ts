import { SessionEntity } from '../entities/session.entity';

export interface SessionRepositoryInterface {
  findById(id: string): Promise<SessionEntity | null>;
  findByRefreshToken(token: string): Promise<SessionEntity | null>;
  findByUserId(userId: string): Promise<SessionEntity[]>;
  findActiveByUserId(userId: string): Promise<SessionEntity[]>;
  save(session: SessionEntity): Promise<SessionEntity>;
  update(session: SessionEntity): Promise<SessionEntity>;
  revoke(id: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
  revokeAllForOrganization(organizationId: string): Promise<void>;
  deleteExpired(): Promise<number>;
}
