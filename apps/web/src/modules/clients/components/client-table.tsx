'use client';

import Link from 'next/link';
import { Building2, MapPin, Phone, Mail, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Client, ClientType } from '../types/client.types';

interface ClientTableProps {
  clients: Client[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
}

export function ClientTable({ clients, isLoading, onDelete }: ClientTableProps) {
  if (isLoading) {
    return (
      <div className='bg-white dark:bg-slate-900 rounded-xl border overflow-hidden'>
        <div className='animate-pulse p-8 space-y-4'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className='h-16 bg-slate-100 dark:bg-slate-800 rounded-lg' />
          ))}
        </div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className='bg-white dark:bg-slate-900 rounded-xl border p-12 text-center'>
        <Building2 className='h-12 w-12 mx-auto text-slate-300 mb-4' />
        <h3 className='text-lg font-medium text-slate-900 dark:text-white mb-2'>
          No hay clientes
        </h3>
        <p className='text-slate-500 mb-6'>
          Comienza agregando tu primer cliente
        </p>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-slate-900 rounded-xl border overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='border-b bg-slate-50 dark:bg-slate-800/50'>
              <th className='text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3'>
                Cliente
              </th>
              <th className='text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3'>
                Tipo
              </th>
              <th className='text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3'>
                Contacto
              </th>
              <th className='text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3'>
                Ubicación
              </th>
              <th className='text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3'>
                Órdenes
              </th>
              <th className='text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100 dark:divide-slate-800'>
            {clients.map((client) => (
              <ClientRow key={client.id} client={client} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ClientRow({ client, onDelete }: { client: Client; onDelete?: (id: string) => void }) {
  return (
    <tr className='hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'>
      <td className='px-4 py-4'>
        <Link
          href={`/dashboard/clients/${client.id}`}
          className='flex items-center gap-3 group'
        >
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
            <Building2 className='h-5 w-5' />
          </div>
          <div>
            <p className='font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors'>
              {client.name}
            </p>
            {client.rfc && (
              <p className='text-xs text-slate-500'>{client.rfc}</p>
            )}
          </div>
        </Link>
      </td>
      <td className='px-4 py-4'>
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            client.type === 'company'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
          )}
        >
          {client.type === 'company' ? 'Empresa' : 'Individual'}
        </span>
      </td>
      <td className='px-4 py-4'>
        <div className='space-y-1'>
          {client.email && (
            <div className='flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400'>
              <Mail className='h-3.5 w-3.5 text-slate-400' />
              {client.email}
            </div>
          )}
          {client.phone && (
            <div className='flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400'>
              <Phone className='h-3.5 w-3.5 text-slate-400' />
              {client.phone}
            </div>
          )}
        </div>
      </td>
      <td className='px-4 py-4'>
        <div className='flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400'>
          <MapPin className='h-3.5 w-3.5 text-slate-400' />
          {client.city || client.state ? (
            <span>{[client.city, client.state].filter(Boolean).join(', ')}</span>
          ) : (
            <span className='text-slate-400'>Sin ubicación</span>
          )}
        </div>
      </td>
      <td className='px-4 py-4'>
        <span className='inline-flex items-center justify-center min-w-[32px] h-7 rounded-full bg-slate-100 dark:bg-slate-800 px-2 text-sm font-medium text-slate-700 dark:text-slate-300'>
          {client.workOrdersCount || 0}
        </span>
      </td>
      <td className='px-4 py-4'>
        <div className='flex items-center justify-end gap-1'>
          <Link
            href={`/dashboard/clients/${client.id}`}
            className='flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800'
            title='Ver detalles'
          >
            <Eye className='h-4 w-4' />
          </Link>
          <Link
            href={`/dashboard/clients/${client.id}/edit`}
            className='flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800'
            title='Editar'
          >
            <Edit className='h-4 w-4' />
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(client.id)}
              className='flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20'
              title='Eliminar'
            >
              <Trash2 className='h-4 w-4' />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
