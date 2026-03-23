import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClientService } from '../../application/services/client.service';
import { CreateClientDto, UpdateClientDto, ClientFilterDto } from '../../application/dto/client.dto';
import { CreateClientSiteDto, UpdateClientSiteDto } from '../../application/dto/client-site.dto';
import { CreateClientContactDto, UpdateClientContactDto } from '../../application/dto/client-contact.dto';
import { CurrentUser } from '../../../shared/interface/decorators/current-user.decorator';
import { Roles } from '../../../shared/interface/decorators/roles.decorator';
import { AuthenticatedUser } from '../../identity/interface/strategies/jwt.strategy';
import { UserRole } from '../../identity/domain/entities/user.entity';
import { PaginationDto } from '../../../shared/application/dto/pagination.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR)
  @HttpCode(HttpStatus.CREATED)
  async createClient(
    @Body() createDto: CreateClientDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clientService.createClient(user.organizationId, createDto);
  }

  @Get()
  async listClients(
    @CurrentUser() user: AuthenticatedUser,
    @Query() filterDto: ClientFilterDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.clientService.listClients(
      user.organizationId,
      filterDto,
      paginationDto.page || 1,
      paginationDto.limit || 20,
    );
  }

  @Get(':id')
  async getClient(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.clientService.getClientById(id, user.organizationId);
  }

  @Get(':id/details')
  async getClientWithDetails(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clientService.getClientWithDetails(id, user.organizationId);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR)
  async updateClient(
    @Param('id') id: string,
    @Body() updateDto: UpdateClientDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clientService.updateClient(id, updateDto, user.organizationId);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async deactivateClient(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clientService.deactivateClient(id, user.organizationId);
  }

  @Patch(':id/activate')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async activateClient(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clientService.activateClient(id, user.organizationId);
  }

  // Sites endpoints
  @Post(':id/sites')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR)
  @HttpCode(HttpStatus.CREATED)
  async createSite(
    @Param('id') clientId: string,
    @Body() createDto: CreateClientSiteDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clientService.createSite(clientId, user.organizationId, createDto);
  }

  @Get(':clientId/sites')
  async listClientSites(
    @Param('clientId') clientId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clientService.listClientSites(clientId, user.organizationId);
  }

  @Get('sites/:siteId')
  async getSite(@Param('siteId') siteId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.clientService.getSiteById(siteId, user.organizationId);
  }

  @Patch('sites/:siteId')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR)
  async updateSite(
    @Param('siteId') siteId: string,
    @Body() updateDto: UpdateClientSiteDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clientService.updateSite(siteId, updateDto, user.organizationId);
  }

  @Patch('sites/:siteId/main')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR)
  @HttpCode(HttpStatus.OK)
  async setMainSite(
    @Param('siteId') siteId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clientService.setMainSite(siteId, user.organizationId);
  }

  @Delete('sites/:siteId')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSite(
    @Param('siteId') siteId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.clientService.deleteSite(siteId, user.organizationId);
  }

  // Contacts endpoints
  @Post(':id/contacts')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR)
  @HttpCode(HttpStatus.CREATED)
  async createContact(
    @Param('id') clientId: string,
    @Body() createDto: CreateClientContactDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clientService.createContact(clientId, user.organizationId, createDto);
  }

  @Get(':clientId/contacts')
  async listClientContacts(
    @Param('clientId') clientId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clientService.listClientContacts(clientId, user.organizationId);
  }

  @Patch('contacts/:contactId')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR)
  async updateContact(
    @Param('contactId') contactId: string,
    @Body() updateDto: UpdateClientContactDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clientService.updateContact(contactId, updateDto, user.organizationId);
  }

  @Delete('contacts/:contactId')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteContact(
    @Param('contactId') contactId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.clientService.deleteContact(contactId, user.organizationId);
  }
}
