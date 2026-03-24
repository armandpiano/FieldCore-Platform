'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zoto';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCreateContact, useUpdateContact } from '../hooks/use-clients';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const contactFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  role: z.string().optional(),
  department: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  phone2: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  clientId: string;
  contact?: {
    id: string;
    name: string;
    role?: string;
    department?: string;
    email?: string;
    phone?: string;
    phone2?: string;
    isPrimary: boolean;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ContactForm({ clientId, contact, onSuccess, onCancel }: ContactFormProps) {
  const isEditing = !!contact;
  
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const isPending = createContact.isPending || updateContact.isPending;

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: contact?.name || '',
      role: contact?.role || '',
      department: contact?.department || '',
      email: contact?.email || '',
      phone: contact?.phone || '',
      phone2: contact?.phone2 || '',
      isPrimary: contact?.isPrimary || false,
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      if (isEditing) {
        await updateContact.mutateAsync({
          id: contact.id,
          payload: values,
        });
        toast.success('Contacto actualizado exitosamente');
      } else {
        await createContact.mutateAsync({
          clientId,
          payload: values,
        });
        toast.success('Contacto creado exitosamente');
      }
      onSuccess?.();
    } catch (error) {
      toast.error(`Error al ${isEditing ? 'actualizar' : 'crear'} el contacto`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo *</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del contacto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Puesto</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Gerente de Compras" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Operaciones" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="contacto@ejemplo.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono Principal</FormLabel>
                <FormControl>
                  <Input placeholder="(55) 1234-5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono Secundario</FormLabel>
                <FormControl>
                  <Input placeholder="(55) 8765-4321" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isPrimary"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Contacto Principal</FormLabel>
                <FormDescription>
                  Marcar como el contacto principal del cliente
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Actualizar' : 'Crear'} Contacto
          </Button>
        </div>
      </form>
    </Form>
  );
}
