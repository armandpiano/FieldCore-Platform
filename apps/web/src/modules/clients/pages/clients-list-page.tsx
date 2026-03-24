'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useClients, useDeleteClient } from '../hooks/use-clients';
import { ClientTable } from '../components/client-table';
import { ClientCard } from '../components/client-card';
import { ClientFilters } from '../types/client.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ClientForm } from '../components/client-form';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Filter,
  X,
  Building2,
  User,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useDebounce } from '@/lib/hooks/use-debounce';

export function ClientsListPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ClientFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteClientId, setDeleteClientId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const queryFilters = useMemo<ClientFilters>(() => ({
    ...filters,
    search: debouncedSearch || undefined,
  }), [filters, debouncedSearch]);

  const { data, isLoading, isError, refetch } = useClients(queryFilters);
  const deleteClient = useDeleteClient();

  const clients = data?.data || [];
  const pagination = data?.pagination;

  const handleDeleteClient = async () => {
    if (!deleteClientId) return;
    
    try {
      await deleteClient.mutateAsync(deleteClientId);
      toast.success('Cliente eliminado correctamente');
      setDeleteClientId(null);
      refetch();
    } catch (error) {
      toast.error('Error al eliminar cliente');
    }
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona tus clientes y sus sucursales
            {pagination && (
              <span className="ml-2 text-sm">
                ({pagination.total} clientes)
              </span>
            )}
          </p>
        </div>
        <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Cliente
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[540px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Crear Nuevo Cliente</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <ClientForm
                onSuccess={() => {
                  setIsCreateOpen(false);
                  refetch();
                  toast.success('Cliente creado exitosamente');
                }}
                onCancel={() => setIsCreateOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Clientes</p>
              <p className="text-2xl font-bold">{pagination?.total || 0}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-500/10 p-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Activos</p>
              <p className="text-2xl font-bold">
                {clients.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-500/10 p-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inactivos</p>
              <p className="text-2xl font-bold">
                {clients.filter(c => c.status === 'inactive').length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-500/10 p-2">
              <User className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Empresas</p>
              <p className="text-2xl font-bold">
                {clients.filter(c => c.type === 'company').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, RFC o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <Select
                    value={filters.type || 'all'}
                    onValueChange={(value) => setFilters({
                      ...filters,
                      type: value === 'all' ? undefined : value as 'company' | 'individual'
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="company">Empresa</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Estado</label>
                  <Select
                    value={filters.status || 'all'}
                    onValueChange={(value) => setFilters({
                      ...filters,
                      status: value === 'all' ? undefined : value as 'active' | 'inactive'
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 flex gap-2">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="flex-1"
                  >
                    Limpiar
                  </Button>
                  <Button
                    onClick={() => setShowFilters(false)}
                    className="flex-1"
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('table')}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="rounded-l-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters Badges */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.type && (
            <Badge variant="secondary" className="gap-1">
              Tipo: {filters.type === 'company' ? 'Empresa' : 'Individual'}
              <button
                onClick={() => setFilters({ ...filters, type: undefined })}
                className="ml-1 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary" className="gap-1">
              Estado: {filters.status === 'active' ? 'Activo' : 'Inactivo'}
              <button
                onClick={() => setFilters({ ...filters, status: undefined })}
                className="ml-1 hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {viewMode === 'table' ? (
            <ClientTable
              clients={[]}
              isLoading
              onView={(id) => router.push(`/dashboard/clients/${id}`)}
              onEdit={(id) => router.push(`/dashboard/clients/${id}/edit`)}
              onDelete={setDeleteClientId}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-lg border bg-muted animate-pulse"
                />
              ))}
            </div>
          )}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold">Error al cargar clientes</h3>
          <p className="text-muted-foreground mb-4">
            No se pudieron obtener los datos. Intenta de nuevo.
          </p>
          <Button onClick={() => refetch()}>Reintentar</Button>
        </div>
      ) : clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No hay clientes</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || activeFiltersCount > 0
              ? 'No se encontraron clientes con los filtros aplicados.'
              : 'Comienza agregando tu primer cliente.'}
          </p>
          {!searchQuery && activeFiltersCount === 0 && (
            <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Cliente
            </Button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        <ClientTable
          clients={clients}
          onView={(id) => router.push(`/dashboard/clients/${id}`)}
          onEdit={(id) => router.push(`/dashboard/clients/${id}/edit`)}
          onDelete={setDeleteClientId}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onView={() => router.push(`/dashboard/clients/${client.id}`)}
              onEdit={() => router.push(`/dashboard/clients/${client.id}/edit`)}
              onDelete={() => setDeleteClientId(client.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {((pagination.page - 1) * pagination.pageSize) + 1} a{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} de{' '}
            {pagination.total} resultados
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
            >
              Anterior
            </Button>
<Button
              variant="outline"
              size="sm"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteClientId} onOpenChange={() => setDeleteClientId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El cliente y toda su información
              asociada será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClient}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteClient.isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
