import { ClientEntity, ClientStatus } from '../entities/client.entity';

export interface ClientFilter {
  status?: ClientStatus;
  search?: string;
}

export interface ClientRepositoryInterface {
  findById(id: string): Promise<ClientEntity | null>;
  findByOrganization(
    organizationId: string,
    filter?: ClientFilter,
    page?: number,
    limit?: number,
  ): Promise<{ clients: ClientEntity[]; total: number }>;
  findByInternalCode(organizationId: string, internalCode: string): Promise<ClientEntity | null>;
  findByRFC(organizationId: string, rfc: string): Promise<ClientEntity | null>;
  existsByInternalCode(organizationId: string, internalCode: string): Promise<boolean>;
  save(client: ClientEntity): Promise<ClientEntity>;
  update(client: ClientEntity): Promise<ClientEntity>;
  delete(id: string): Promise<void>;
}
