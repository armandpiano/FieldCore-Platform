'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { clientsService } from '../services/clients.service';
import type {
  Client,
  ClientFilters,
  CreateClientRequest,
  UpdateClientRequest,
  ClientSite,
  CreateSiteRequest,
  UpdateSiteRequest,
  ClientContact,
  CreateContactRequest,
} from '../types/client.types';

// Hook for client list with filters
export function useClients(filters?: ClientFilters) {
  return useQuery({
    queryKey: ['clients', filters],
    queryFn: () => clientsService.list(filters),
    placeholderData: (previousData) => previousData,
  });
}

// Hook for single client
export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientsService.getById(id),
    enabled: !!id,
  });
}

// Hook for client sites
export function useClientSites(clientId: string) {
  return useQuery({
    queryKey: ['clients', clientId, 'sites'],
    queryFn: () => clientsService.getSites(clientId),
    enabled: !!clientId,
  });
}

// Hook for client contacts
export function useClientContacts(clientId: string) {
  return useQuery({
    queryKey: ['clients', clientId, 'contacts'],
    queryFn: () => clientsService.getContacts(clientId),
    enabled: !!clientId,
  });
}

// Hook for client stats
export function useClientStats() {
  return useQuery({
    queryKey: ['clients', 'stats'],
    queryFn: () => clientsService.getStats(),
  });
}

// Hook for creating client
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClientRequest) => clientsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', 'stats'] });
    },
  });
}

// Hook for updating client
export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateClientRequest }) =>
      clientsService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', id] });
    },
  });
}

// Hook for deleting client
export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients', 'stats'] });
    },
  });
}

// Hook for creating site
export function useCreateSite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, payload }: { clientId: string; payload: CreateSiteRequest }) =>
      clientsService.createSite(clientId, payload),
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ['clients', clientId, 'sites'] });
    },
  });
}

// Hook for updating site
export function useUpdateSite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clientId,
      siteId,
      payload,
    }: {
      clientId: string;
      siteId: string;
      payload: UpdateSiteRequest;
    }) => clientsService.updateSite(clientId, siteId, payload),
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ['clients', clientId, 'sites'] });
    },
  });
}

// Hook for deleting site
export function useDeleteSite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, siteId }: { clientId: string; siteId: string }) =>
      clientsService.deleteSite(clientId, siteId),
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ['clients', clientId, 'sites'] });
    },
  });
}

// Hook for creating contact
export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, payload }: { clientId: string; payload: CreateContactRequest }) =>
      clientsService.createContact(clientId, payload),
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ['clients', clientId, 'contacts'] });
    },
  });
}

// Hook for updating contact
export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clientId,
      contactId,
      payload,
    }: {
      clientId: string;
      contactId: string;
      payload: any;
    }) => clientsService.updateContact(clientId, contactId, payload),
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ['clients', clientId, 'contacts'] });
    },
  });
}

// Hook for deleting contact
export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, contactId }: { clientId: string; contactId: string }) =>
      clientsService.deleteContact(clientId, contactId),
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ['clients', clientId, 'contacts'] });
    },
  });
}

// Combined hook for client management with local state
export function useClientManagement() {
  const [filters, setFilters] = useState<ClientFilters>({
    page: 1,
    limit: 10,
  });

  const clientsQuery = useClients(filters);
  const statsQuery = useClientStats();
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const deleteMutation = useDeleteClient();

  const updateFilters = useCallback((newFilters: Partial<ClientFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const nextPage = useCallback(() => {
    setFilters((prev) => ({ ...prev, page: prev.page! + 1 }));
  }, []);

  const prevPage = useCallback(() => {
    setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page! - 1) }));
  }, []);

  return {
    clients: clientsQuery.data?.data ?? [],
    pagination: clientsQuery.data?.meta,
    isLoading: clientsQuery.isLoading,
    isError: clientsQuery.isError,
    error: clientsQuery.error,
    stats: statsQuery.data,
    filters,
    updateFilters,
    nextPage,
    prevPage,
    createClient: createMutation.mutateAsync,
    updateClient: updateMutation.mutateAsync,
    deleteClient: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetch: clientsQuery.refetch,
  };
}
