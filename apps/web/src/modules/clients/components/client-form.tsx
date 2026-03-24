'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, User, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Client, ClientType } from '../types/client.types';

// Client form schema
const clientSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido').max(200),
  type: z.enum(['company', 'individual']),
  rfc: z.string().optional(),
  email: z.string().email('Email inválido').or(z.literal('')).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default('México'),
  notes: z.string().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: ClientFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ClientForm({ client, onSubmit, onCancel, isLoading }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      type: 'company',
      country: 'México',
      ...(client && {
        name: client.name,
        type: client.type,
        rfc: client.rfc,
        email: client.email,
        phone: client.phone,
        address: client.address,
        city: client.city,
        state: client.state,
        postalCode: client.postalCode,
        country: client.country,
        notes: client.notes,
      }),
    },
  });

  const clientType = watch('type');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Client Type Selection */}
      <div className='space-y-2'>
        <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
          Tipo de Cliente
        </label>
        <div className='grid grid-cols-2 gap-3'>
          <button
            type='button'
            onClick={() => setValue('type', 'company')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all',
              clientType === 'company'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
            )}
          >
            <Building2 className='h-5 w-5' />
            <span className='font-medium'>Empresa</span>
          </button>
          <button
            type='button'
            onClick={() => setValue('type', 'individual')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all',
              clientType === 'individual'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
            )}
          >
            <User className='h-5 w-5' />
            <span className='font-medium'>Individual</span>
          </button>
        </div>
      </div>

      {/* Name */}
      <div className='space-y-2'>
        <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
          {clientType === 'company' ? 'Nombre de la Empresa *' : 'Nombre Completo *'}
        </label>
        <input
          type='text'
          {...register('name')}
          placeholder={clientType === 'company' ? 'Acme Corporation' : 'Juan Pérez García'}
          className={cn(
            'w-full h-10 px-3 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20',
            errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
          )}
        />
        {errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
      </div>

      {/* RFC / Tax ID */}
      <div className='space-y-2'>
        <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
          {clientType === 'company' ? 'RFC' : 'CURP / RFC'}
        </label>
        <input
          type='text'
          {...register('rfc')}
          placeholder={clientType === 'company' ? 'XAXX010101000' : 'XAXX010101HXXX00000'}
          className='w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20'
        />
      </div>

      {/* Contact Info */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
            Email
          </label>
          <input
            type='email'
            {...register('email')}
            placeholder='contacto@empresa.com'
            className={cn(
              'w-full h-10 px-3 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20',
              errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
            )}
          />
          {errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
        </div>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
            Teléfono
          </label>
          <input
            type='tel'
            {...register('phone')}
            placeholder='55 1234 5678'
            className='w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20'
          />
        </div>
      </div>

      {/* Address */}
      <div className='space-y-2'>
        <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
          Dirección
        </label>
        <input
          type='text'
          {...register('address')}
          placeholder='Av. Insurgentes Sur 1234'
          className='w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20'
        />
      </div>

      {/* Location */}
      <div className='grid grid-cols-3 gap-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
            Ciudad
          </label>
          <input
            type='text'
            {...register('city')}
            placeholder='Ciudad de México'
            className='w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20'
          />
        </div>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
            Estado
          </label>
          <input
            type='text'
            {...register('state')}
            placeholder='CDMX'
            className='w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20'
          />
        </div>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
            CP
          </label>
          <input
            type='text'
            {...register('postalCode')}
            placeholder='06600'
            className='w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20'
          />
        </div>
      </div>

      {/* Notes */}
      <div className='space-y-2'>
        <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
          Notas
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          placeholder='Información adicional sobre el cliente...'
          className='w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none'
        />
      </div>

      {/* Actions */}
      <div className='flex justify-end gap-3 pt-4 border-t'>
        <button
          type='button'
          onClick={onCancel}
          className='px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2'
        >
          <X className='h-4 w-4' />
          Cancelar
        </button>
        <button
          type='submit'
          disabled={isLoading}
          className='px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50'
        >
          <Save className='h-4 w-4' />
          {isLoading ? 'Guardando...' : 'Guardar Cliente'}
        </button>
      </div>
    </form>
  );
}
