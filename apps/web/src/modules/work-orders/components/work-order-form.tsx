'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  CreateWorkOrderRequest,
  WorkOrderType,
  WorkOrderPriority,
  WorkOrder,
} from '../types/work-order.types';
import { Loader2 } from 'lucide-react';
import { useClients } from '@/modules/clients/hooks/use-clients';

const workOrderFormSchema = z.object({
  clientId: z.string().min(1, 'Selecciona un cliente'),
  siteId: z.string().min(1, 'Selecciona una sucursal'),
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  type: z.enum(['installation', 'repair', 'maintenance', 'inspection', 'emergency']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  scheduledDate: z.string().min(1, 'Selecciona una fecha'),
  scheduledTimeStart: z.string().optional(),
  scheduledTimeEnd: z.string().optional(),
  estimatedDuration: z.number().optional(),
  serviceAddress: z.string().optional(),
  observations: z.string().optional(),
});

type WorkOrderFormValues = z.infer<typeof workOrderFormSchema>;

interface WorkOrderFormProps {
  workOrder?: WorkOrder;
  onSuccess?: () => void;
  onCancel?: () => void;
  isPending?: boolean;
}

export function WorkOrderForm({
  workOrder,
  onSuccess,
  onCancel,
  isPending,
}: WorkOrderFormProps) {
  const isEditing = !!workOrder;

  const form = useForm<WorkOrderFormValues>({
    resolver: zodResolver(workOrderFormSchema),
    defaultValues: {
      clientId: workOrder?.clientId || '',
      siteId: workOrder?.siteId || '',
      title: workOrder?.title || '',
      description: workOrder?.description || '',
      type: workOrder?.type || 'repair',
      priority: workOrder?.priority || 'medium',
      scheduledDate: workOrder?.scheduledDate?.split('T')[0] || '',
      scheduledTimeStart: workOrder?.scheduledTimeStart || '',
      scheduledTimeEnd: workOrder?.scheduledTimeEnd || '',
      estimatedDuration: workOrder?.estimatedDuration,
      serviceAddress: workOrder?.serviceAddress || '',
      observations: workOrder?.observations || '',
    },
  });

  const { data: clientsData } = useClients();
  const clients = clientsData?.data || [];

  const onSubmit = (values: WorkOrderFormValues) => {
    const payload: CreateWorkOrderRequest = {
      ...values,
      scheduledDate: values.scheduledDate,
    };
    
    // Here you would call the create/update mutation
    console.log('Submit:', payload);
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Client Selection */}
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Site Selection */}
        <FormField
          control={form.control}
          name="siteId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sucursal *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={!form.watch('clientId')}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una sucursal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* Sites would be loaded based on selected client */}
                </SelectContent>
              </Select>
              <FormDescription>
                Primero selecciona un cliente
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título del servicio *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej: Instalación de sistema de riego"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe el trabajo a realizar..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type and Priority */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de servicio *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="installation">Instalación</SelectItem>
                    <SelectItem value="repair">Reparación</SelectItem>
                    <SelectItem value="maintenance">Mantenimiento</SelectItem>
                    <SelectItem value="inspection">Inspección</SelectItem>
                    <SelectItem value="emergency">Emergencia</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridad *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Scheduled Date */}
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="scheduledDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha programada *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scheduledTimeStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora inicio</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scheduledTimeEnd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora fin</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Estimated Duration */}
        <FormField
          control={form.control}
          name="estimatedDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duración estimada (minutos)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="15"
                  step="15"
                  placeholder="60"
                  onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Duración esperada del servicio en minutos
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Service Address */}
        <FormField
          control={form.control}
          name="serviceAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección del servicio</FormLabel>
              <FormControl>
                <Input
                  placeholder="Dirección donde se realizará el servicio"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Observations */}
        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observaciones</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notas u observaciones adicionales..."
                  className="resize-none"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Actualizar' : 'Crear'} Orden
          </Button>
        </div>
      </form>
    </Form>
  );
}
