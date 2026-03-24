'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  useWorkOrder,
  useCreateWorkOrder,
  useUpdateWorkOrder,
} from '../hooks/use-work-orders';
import { WorkOrderForm } from '../components/work-order-form';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function WorkOrderFormPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = params.id as string | undefined;
  const clientIdFromUrl = searchParams.get('clientId');
  const isEditing = !!orderId;

  const { data: workOrder, isLoading, isError } = useWorkOrder(orderId!);
  const createWorkOrder = useCreateWorkOrder();
  const updateWorkOrder = useUpdateWorkOrder();

  if (isEditing && isLoading) {
    return <WorkOrderFormSkeleton />;
  }

  if (isEditing && (isError || !workOrder)) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
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

  const handleSuccess = async () => {
    if (isEditing) {
      toast.success('Orden actualizada exitosamente');
      router.push(`/dashboard/work-orders/${orderId}`);
    } else {
      toast.success('Orden creada exitosamente');
      router.push('/dashboard/work-orders');
    }
  };

  const handleSubmit = async (data: unknown) => {
    try {
      if (isEditing) {
        await updateWorkOrder.mutateAsync({ id: orderId, payload: data as Parameters<typeof updateWorkOrder.mutateAsync>[0]['payload'] });
      } else {
        await createWorkOrder.mutateAsync(data as Parameters<typeof createWorkOrder.mutateAsync>[0]);
      }
      handleSuccess();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={isEditing ? `/dashboard/work-orders/${orderId}` : '/dashboard/work-orders'}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Editar Orden' : 'Nueva Orden de Servicio'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? `Editando ${workOrder?.folio}`
              : 'Completa la información para crear una nueva orden'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <WorkOrderForm
          workOrder={isEditing ? workOrder : undefined}
          onSuccess={handleSuccess}
          onCancel={() =>
            router.push(isEditing ? `/dashboard/work-orders/${orderId}` : '/dashboard/work-orders')
          }
          isPending={createWorkOrder.isPending || updateWorkOrder.isPending}
        />
      </div>
    </div>
  );
}

function WorkOrderFormSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="max-w-2xl space-y-6">
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}
