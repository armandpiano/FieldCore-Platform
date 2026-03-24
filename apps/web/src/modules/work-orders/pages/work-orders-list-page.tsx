'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWorkOrders, useDeleteWorkOrder, useAssignTechnician } from '../hooks/use-work-orders';
import { WorkOrderTable } from '../components/work-order-table';
import { WorkOrderCard } from '../components/work-order-card';
import { WorkOrderFilters, WorkOrderStatus } from '../types/work-order.types';
import { WORK_ORDER_STATUS_CONFIG, PRIORITY_CONFIG, TYPE_CONFIG } from '../types/work-order.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Filter,
  X,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { AssignTechnicianDialog } from '../components/assign-technician-dialog';

export function WorkOrdersListPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<WorkOrderFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [assignOrderId, setAssignOrderId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const queryFilters = useMemo<WorkOrderFilters>(() => ({
    ...filters,
    search: debouncedSearch || undefined,
  }), [filters, debouncedSearch]);

  const { data, isLoading, isError, refetch } = useWorkOrders(queryFilters);
  const deleteOrder = useDeleteWorkOrder();
  const assignTechnician = useAssignTechnician();

  const workOrders = data?.data || [];
  const pagination = data?.pagination;

  // Stats
  const stats = useMemo(() => {
    const all = workOrders;
    return {
      total: pagination?.total || 0,
      pending: all.filter((o) => o.status === 'pending').length,
      inProgress: all.filter((o) => ['assigned', 'in_progress', 'on_site'].includes(o.status)).length,
      completed: all.filter((o) => o.status === 'completed').length,
      urgent: all.filter((o) => o.priority === 'urgent').length,
    };
  }, [workOrders, pagination]);

  const handleDeleteOrder = async () => {
    if (!deleteOrderId) return;
    try {
      await deleteOrder.mutateAsync(deleteOrderId);
      toast.success('Orden eliminada');
      setDeleteOrderId(null);
    } catch {
      toast.error('Error al eliminar orden');
    }
  };

  const handleAssignTechnician = async (technicianId: string) => {
    if (!assignOrderId) return;
    try {
      await assignTechnician.mutateAsync({
        id: assignOrderId,
        payload: { technicianId },
      });
      setAssignOrderId(null);
      refetch();
    } catch {
      toast.error('Error al asignar técnico');
    }
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const clearFilters = () => setFilters({});

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Órdenes de Servicio</h1>
          <p className="text-muted-foreground">
            Gestiona las órdenes de trabajo
            {pagination && (
              <span className="ml-2 text-sm">({pagination.total} órdenes)</span>
            )}
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/work-orders/new">
            <Plus className="h-4 w-4" />
            Nueva Orden
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <button
          onClick={() => setFilters({})}
          className="rounded-lg border bg-card p-4 text-left hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-slate-500/10 p-2">
              <ClipboardList className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilters({ status: 'pending' })}
          className="rounded-lg border bg-card p-4 text-left hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-500/10 p-2">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilters({ status: ['assigned', 'in_progress', 'on_site'] as WorkOrderStatus[] })}
          className="rounded-lg border bg-card p-4 text-left hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-500/10 p-2">
              <MapPin className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En Progreso</p>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilters({ status: 'completed' })}
          className="rounded-lg border bg-card p-4 text-left hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-500/10 p-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completadas</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilters({ priority: 'urgent' })}
          className="rounded-lg border bg-card p-4 text-left hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-500/10 p-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Urgentes</p>
              <p className="text-2xl font-bold">{stats.urgent}</p>
            </div>
          </div>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por folio, cliente o dirección..."
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
                  <label className="text-sm font-medium">Estado</label>
                  <Select
                    value={filters.status as string || 'all'}
                    onValueChange={(value) => setFilters({
                      ...filters,
                      status: value === 'all' ? undefined : value as WorkOrderStatus,
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {Object.entries(WORK_ORDER_STATUS_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Prioridad</label>
                  <Select
                    value={filters.priority || 'all'}
                    onValueChange={(value) => setFilters({
                      ...filters,
                      priority: value === 'all' ? undefined : value as WorkOrderFilters['priority'],
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <Select
                    value={filters.type || 'all'}
                    onValueChange={(value) => setFilters({
                      ...filters,
                      type: value === 'all' ? undefined : value as WorkOrderFilters['type'],
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {Object.entries(TYPE_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Desde</label>
                    <Input
                      type="date"
                      value={filters.dateFrom || ''}
                      onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value || undefined })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hasta</label>
                    <Input
                      type="date"
                      value={filters.dateTo || ''}
                      onChange={(e) => setFilters({ ...filters, dateTo: e.target.value || undefined })}
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <Button variant="outline" onClick={clearFilters} className="flex-1">
                    Limpiar
                  </Button>
                  <Button onClick={() => setShowFilters(false)} className="flex-1">
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

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.status && (
            <Badge variant="secondary" className="gap-1">
              {WORK_ORDER_STATUS_CONFIG[filters.status as WorkOrderStatus]?.label || filters.status}
              <button onClick={() => setFilters({ ...filters, status: undefined })} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.priority && (
            <Badge variant="secondary" className="gap-1">
              {PRIORITY_CONFIG[filters.priority]?.label}
              <button onClick={() => setFilters({ ...filters, priority: undefined })} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        viewMode === 'table' ? (
          <WorkOrderTable
            workOrders={[]}
            isLoading
            onView={(id) => router.push(`/dashboard/work-orders/${id}`)}
            onAssign={setAssignOrderId}
            onDelete={setDeleteOrderId}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-lg border bg-muted animate-pulse" />
            ))}
          </div>
        )
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold">Error al cargar órdenes</h3>
          <p className="text-muted-foreground mb-4">No se pudieron obtener los datos.</p>
          <Button onClick={() => refetch()}>Reintentar</Button>
        </div>
      ) : workOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No hay órdenes</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || activeFiltersCount > 0
              ? 'No se encontraron órdenes con los filtros aplicados.'
              : 'Comienza creando tu primera orden de servicio.'}
          </p>
          {!searchQuery && activeFiltersCount === 0 && (
            <Button asChild className="gap-2">
              <Link href="/dashboard/work-orders/new">
                <Plus className="h-4 w-4" />
                Crear Orden
              </Link>
            </Button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        <WorkOrderTable
          workOrders={workOrders}
          onView={(id) => router.push(`/dashboard/work-orders/${id}`)}
          onEdit={(id) => router.push(`/dashboard/work-orders/${id}/edit`)}
          onAssign={setAssignOrderId}
          onDelete={setDeleteOrderId}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workOrders.map((order) => (
            <WorkOrderCard
              key={order.id}
              workOrder={order}
              onView={() => router.push(`/dashboard/work-orders/${order.id}`)}
              onEdit={() => router.push(`/dashboard/work-orders/${order.id}/edit`)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {((pagination.page - 1) * pagination.pageSize) + 1} a{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} de {pagination.total}
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

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteOrderId} onOpenChange={() => setDeleteOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar orden?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOrder}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteOrder.isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Assign Technician Dialog */}
      {assignOrderId && (
        <AssignTechnicianDialog
          open={!!assignOrderId}
          onOpenChange={(open) => !open && setAssignOrderId(null)}
          workOrderId={assignOrderId}
          onAssign={handleAssignTechnician}
          isPending={assignTechnician.isPending}
        />
      )}
    </div>
  );
}
