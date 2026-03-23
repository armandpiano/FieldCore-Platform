import { ClientContactEntity, ContactRole } from '../entities/client-contact.entity';

export interface ContactRepositoryInterface {
  findById(id: string): Promise<ClientContactEntity | null>;
  findByClient(clientId: string): Promise<ClientContactEntity[]>;
  findPrimaryContact(clientId: string): Promise<ClientContactEntity | null>;
  findByRole(clientId: string, role: ContactRole): Promise<ClientContactEntity | null>;
  countByClient(clientId: string): Promise<number>;
  save(contact: ClientContactEntity): Promise<ClientContactEntity>;
  update(contact: ClientContactEntity): Promise<ClientContactEntity>;
  delete(id: string): Promise<void>;
  deleteByClient(clientId: string): Promise<void>;
}
