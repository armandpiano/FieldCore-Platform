'use client';

import { useParams, useRouter } from 'next/navigation';
import { useClient, useCreateClient, useUpdateClient } from '../hooks/use-clients';
import { ClientForm } from '../components/client-form';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

export function ClientFormPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string | undefined;
  const isEditing = !!clientId;

  const { data: client, isLoading, isError } = useClient(clientId!);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  if (isEditing && isLoading) {
    return <ClientFormSkeleton />;
  }

  if (isEditing && (isError || !client)) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-lg font-semibold">Cliente no encontrado</h3>
          <p className="text-muted-foreground mb-4">
            No se pudo encontrar el cliente solicitado.
          </p>
          <Button onClick={() => router.push('/dashboard/clients')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Clientes
          </Button>
        </div>
      </div>
    );
  }

  const handleSuccess = async () => {
    if (isEditing) {
      toast.success('Cliente actualizado exitosamente');
      router.push(`/dashboard/clients/${clientId}`);
    } else {
      toast.success('Cliente creado exitosamente');
      router.push('/dashboard/clients');
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={isEditing ? `/dashboard/clients/${clientId}` : '/dashboard/clients'}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? `Editando información de ${client?.name}`
              : 'Completa la información para crear un nuevo cliente'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <ClientForm
          client={isEditing ? client : undefined}
          onSuccess={handleSuccess}
          onCancel={() =>
            router.push(
              isEditing ? `/dashboard/clients/${clientId}` : '/dashboard/clients'
            )
          }
          isPending={createClient.isPending || updateClient.isPending}
        />
      </div>
    </div>
  );
}

function ClientFormSkeleton() {
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
