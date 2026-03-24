'use client';

import { WorkOrder, WORK_ORDER_STATUS_CONFIG, PRIORITY_CONFIG, TYPE_CONFIG } from '../types/work-order.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Eye,
  Edit,
  UserPlus,
  MoreVertical,
  Trash2,
  MapPin,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pause,
  ClipboardList,
} from 'lucide-react';

interface WorkOrderTableProps {
  workOrders: WorkOrder[];
  isLoading?: boolean;
  onView: (id: string) => void;
  onEdit?: (id: string) => void;
  onAssign?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStart?: (id: string) => void;
}

export function WorkOrderTable({
  workOrders,
  isLoading,
  onView,
  onEdit,
  onAssign,
  onDelete,
  onStart,
}: WorkOrderTableProps) {
  if (isLoading) {
    return <WorkOrderTableSkeleton />;
  }

  if (workOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No hay órdenes</h3>
        <p className="text-muted-foreground">No se encontraron órdenes de servicio.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Folio</TableHead>
            <TableHead>Cliente / Servicio</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead className="w-[130px]">Fecha</TableHead>
            <TableHead className="w-[100px]">Estado</TableHead>
            <TableHead className="w-[90px]">Prioridad</TableHead>
            <TableHead className="w-[140px]">Técnico</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workOrders.map((order) => (
            <TableRow key={order.id} className="cursor-pointer" onClick={() => onView(order.id)}>
              <TableCell>
                <div className="font-mono text-sm font-medium">{order.folio}</div>
              </TableCell>
              <TableCell>
                <div className="max-w-[250px]">
                  <div className="font-medium truncate">{order.title}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {order.client?.name || 'Cliente'}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground max-w-[180px]">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{order.site?.name || order.serviceAddress}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  {new Date(order.scheduledDate).toLocaleDateString('es-MX', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell>
                <PriorityBadge priority={order.priority} />
              </TableCell>
              <TableCell>
                {order.assignedTo ? (
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm truncate max-w-[80px]">{order.assignedTo.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Sin asignar</span>
                )}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(order.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalle
                    </DropdownMenuItem>
                    {onEdit && order.status !== 'completed' && order.status !== 'cancelled' && (
                      <DropdownMenuItem onClick={() => onEdit(order.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    {onAssign && !order.assignedToId && order.status === 'pending' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onAssign(order.id)}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Asignar técnico
                        </DropdownMenuItem>
                      </>
                    )}
                    {onStart && ['assigned', 'in_progress'].includes(order.status) && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onStart(order.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Iniciar servicio
                        </DropdownMenuItem>
                      </>
                    )}
                    {onDelete && order.status === 'pending' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDelete(order.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function StatusBadge({ status }: { status: WorkOrder['status'] }) {
  const config = WORK_ORDER_STATUS_CONFIG[status];
  
  const icons: Record<string, React.ReactNode> = {
    Clock: <Clock className="h-3 w-3 mr-1" />,
    UserCheck: <UserPlus className="h-3 w-3 mr-1" />,
    MapPin: <MapPin className="h-3 w-3 mr-1" />,
    CheckCircle: <CheckCircle className="h-3 w-3 mr-1" />,
    XCircle: <XCircle className="h-3 w-3 mr-1" />,
    Pause: <Pause className="h-3 w-3 mr-1" />,
  };
  
  return (
    <Badge variant="secondary" className={`${config.bgColor} ${config.color} gap-0.5`}>
      {icons[config.icon]}
      {config.label}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: WorkOrder['priority'] }) {
  const config = PRIORITY_CONFIG[priority];
  
  return (
    <Badge variant="secondary" className={`${config.bgColor} ${config.color}`}>
      {priority === 'urgent' && <AlertTriangle className="h-3 w-3 mr-1" />}
      {config.label}
    </Badge>
  );
}

function WorkOrderTableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Folio</TableHead>
            <TableHead>Cliente / Servicio</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead className="w-[130px]">Fecha</TableHead>
            <TableHead className="w-[100px]">Estado</TableHead>
            <TableHead className="w-[90px]">Prioridad</TableHead>
            <TableHead className="w-[140px]">Técnico</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </TableCell>
              <TableCell><Skeleton className="h-4 w-28" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-5 w-20" /></TableCell>
              <TableCell><Skeleton className="h-5 w-14" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-8 w-8" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
