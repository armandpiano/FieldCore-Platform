'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useWorkOrder,
  useWorkOrderComments,
  useWorkOrderEvidence,
  useWorkOrderTimeline,
  useAddComment,
  useDeleteComment,
  useUploadEvidence,
  useDeleteEvidence,
  useChangeStatus,
  useStartService,
  useMarkArrival,
  useCompleteService,
  useCancelWorkOrder,
} from '../hooks/use-work-orders';
import { useAuthStore } from '@/store/auth.store';
import { WORK_ORDER_STATUS_CONFIG, PRIORITY_CONFIG, TYPE_CONFIG } from '../types/work-order.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  Edit,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  AlertTriangle,
  MoreVertical,
  CheckCircle,
  Play,
  XCircle,
  Pause,
  FileText,
  Camera,
  MessageSquare,
  History,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import { WorkOrderTimeline } from '../components/work-order-timeline';
import { WorkOrderComments } from '../components/work-order-comments';
import { WorkOrderEvidence } from '../components/work-order-evidence';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function WorkOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { user } = useAuthStore();

  const { data: workOrder, isLoading, isError, refetch } = useWorkOrder(orderId);
  const { data: comments, isLoading: commentsLoading } = useWorkOrderComments(orderId);
  const { data: evidence, isLoading: evidenceLoading } = useWorkOrderEvidence(orderId);
  const { data: timeline, isLoading: timelineLoading } = useWorkOrderTimeline(orderId);

  const addComment = useAddComment();
  const deleteComment = useDeleteComment();
  const uploadEvidence = useUploadEvidence();
  const deleteEvidence = useDeleteEvidence();
  const changeStatus = useChangeStatus();
  const startService = useStartService();
  const markArrival = useMarkArrival();
  const completeService = useCompleteService();
  const cancelOrder = useCancelWorkOrder();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (isLoading) return <WorkOrderDetailSkeleton />;

  if (isError || !workOrder) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold">Orden no encontrada</h3>
          <p className="text-muted-foreground mb-4">
            No se pudo encontrar la orden solicitada.
          </p>
          <Button onClick={() => router.push('/dashboard/work-orders')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Órdenes
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = WORK_ORDER_STATUS_CONFIG[workOrder.status];
  const priorityConfig = PRIORITY_CONFIG[workOrder.priority];
  const typeConfig = TYPE_CONFIG[workOrder.type];

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatTime = (date?: string) =>
    date ? new Date(date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : null;

  const getNextActions = () => {
    switch (workOrder.status) {
      case 'pending':
        return [{ label: 'Asignar Técnico', icon: User, action: () => router.push(`/dashboard/work-orders/${orderId}/assign`) }];
      case 'assigned':
        return [
          { label: 'Iniciar Servicio', icon: Play, action: () => startService.mutate(orderId), variant: 'default' as const },
          { label: 'Cancelar', icon: XCircle, action: () => setShowCancelDialog(true), variant: 'destructive' as const },
        ];
      case 'in_progress':
        return [
          { label: 'Marcar Llegada', icon: Navigation, action: () => markArrival.mutate({ id: orderId }), variant: 'default' as const },
        ];
      case 'on_site':
        return [
          { label: 'Completar Servicio', icon: CheckCircle, action: () => completeService.mutate({ id: orderId }), variant: 'default' as const },
        ];
      default:
        return [];
    }
  };

  const nextActions = getNextActions();

  const handleCancelOrder = async () => {
    try {
      await cancelOrder.mutateAsync({ id: orderId, reason: cancelReason });
      setShowCancelDialog(false);
      setCancelReason('');
    } catch {
      toast.error('Error al cancelar orden');
    }
  };

  const handleAddComment = async (content: string) => {
    try {
      await addComment.mutateAsync({ id: orderId, payload: { content } });
    } catch {
      toast.error('Error al agregar comentario');
    }
  };

  const handleUploadEvidence = async (file: File, type: 'photo' | 'signature' | 'document' | 'video', description?: string) => {
    try {
      await uploadEvidence.mutateAsync({ id: orderId, file, type, description });
    } catch {
      toast.error('Error al subir evidencia');
    }
  };

  const handleDeleteEvidence = async (evidenceId: string) => {
    try {
      await deleteEvidence.mutateAsync({ workOrderId: orderId, evidenceId });
    } catch {
      toast.error('Error al eliminar evidencia');
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/work-orders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tight">{workOrder.folio}</h1>
              <Badge className={`${statusConfig.bgColor} ${statusConfig.color}`}>
                {statusConfig.label}
              </Badge>
              <Badge className={`${priorityConfig.bgColor} ${priorityConfig.color}`}>
                {priorityConfig.label}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{workOrder.title}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Action Buttons */}
          {nextActions.map((action, i) => (
            <Button
              key={i}
              variant={action.variant || 'outline'}
              onClick={action.action}
              disabled={action.label.includes('Iniciar') && startService.isPending}
            >
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
            </Button>
          ))}

          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/work-orders/${orderId}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Link>
              </DropdownMenuItem>
              {workOrder.clientId && (
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/clients/${workOrder.clientId}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver Cliente
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {workOrder.status !== 'completed' && workOrder.status !== 'cancelled' && (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setShowCancelDialog(true)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancelar Orden
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Info */}
        <div className="space-y-6 lg:col-span-1">
          {/* Service Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Información del Servicio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <p className="font-medium">{typeConfig.label}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Descripción</p>
                <p className="text-sm">{workOrder.description}</p>
              </div>
              {workOrder.observations && (
                <div>
                  <p className="text-sm text-muted-foreground">Observaciones</p>
                  <p className="text-sm">{workOrder.observations}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Duración Est.</p>
                  <p className="font-medium">
                    {workOrder.estimatedDuration ? `${workOrder.estimatedDuration} min` : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duración Real</p>
                  <p className="font-medium">
                    {workOrder.actualDuration ? `${workOrder.actualDuration} min` : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Programación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Fecha</p>
                <p className="font-medium">{formatDate(workOrder.scheduledDate)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Hora Inicio</p>
                  <p className="font-medium">
                    {workOrder.scheduledTimeStart ? formatTime(workOrder.scheduledTimeStart) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hora Fin</p>
                  <p className="font-medium">
                    {workOrder.scheduledTimeEnd ? formatTime(workOrder.scheduledTimeEnd) : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client & Site */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{workOrder.client?.name || 'Cliente'}</p>
                {workOrder.client?.email && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {workOrder.client.email}
                  </p>
                )}
                {workOrder.client?.phone && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {workOrder.client.phone}
                  </p>
                )}
              </div>
              {workOrder.site && (
                <>
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-1">Sucursal</p>
                    <p className="font-medium">{workOrder.site.name}</p>
<p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {[
                        workOrder.site.address,
                        workOrder.site.city,
                        workOrder.site.state,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Technician */}
          {workOrder.assignedTo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Técnico Asignado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{workOrder.assignedTo.name}</p>
                    <p className="text-sm text-muted-foreground">{workOrder.assignedTo.email}</p>
                    {workOrder.assignedTo.phone && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {workOrder.assignedTo.phone}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="timeline" className="gap-2">
                <History className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="comments" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Comentarios
              </TabsTrigger>
              <TabsTrigger value="evidence" className="gap-2">
                <Camera className="h-4 w-4" />
                Evidencia
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <WorkOrderTimeline events={timeline || []} isLoading={timelineLoading} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="mt-6">
              <WorkOrderComments
                comments={comments || []}
                isLoading={commentsLoading}
                onAddComment={handleAddComment}
                onDeleteComment={deleteComment.mutate}
                isPending={addComment.isPending}
                currentUserId={user?.id}
              />
            </TabsContent>

            <TabsContent value="evidence" className="mt-6">
              <WorkOrderEvidence
                evidence={evidence || []}
                isLoading={evidenceLoading}
                onUpload={handleUploadEvidence}
                onDelete={handleDeleteEvidence}
                isPending={uploadEvidence.isPending}
                canUpload={workOrder.status !== 'cancelled'}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Orden</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              ¿Estás seguro de cancelar esta orden de servicio? Esta acción no se puede deshacer.
            </p>
            <Textarea
              placeholder="Razón de cancelación (opcional)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Cerrar
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={cancelOrder.isPending}
            >
              {cancelOrder.isPending ? 'Cancelando...' : 'Cancelar Orden'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Import useState
import { useState } from 'react';

function WorkOrderDetailSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-96" />
        <Skeleton className="h-[500px] lg:col-span-2" />
      </div>
    </div>
  );
}
