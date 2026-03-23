import { ClientSiteEntity } from '../entities/client-site.entity';

export interface SiteRepositoryInterface {
  findById(id: string): Promise<ClientSiteEntity | null>;
  findByClient(clientId: string): Promise<ClientSiteEntity[]>;
  findMainSite(clientId: string): Promise<ClientSiteEntity | null>;
  findByOrganization(
    organizationId: string,
    page?: number,
    limit?: number,
  ): Promise<{ sites: ClientSiteEntity[]; total: number }>;
  countByClient(clientId: string): Promise<number>;
  save(site: ClientSiteEntity): Promise<ClientSiteEntity>;
  update(site: ClientSiteEntity): Promise<ClientSiteEntity>;
  delete(id: string): Promise<void>;
  deleteByClient(clientId: string): Promise<void>;
}
