'use client';

import Link from 'next/link';
import { Building2, MapPin, Phone, Mail, Plus, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Client } from '../types/client.types';

interface ClientCardProps {
  client: Client;
  onClick?: () => void;
}

export function ClientCard({ client, onClick }: ClientCardProps) {
  return (
    <Link href={`/dashboard/clients/${client.id}`}>
      <div
        onClick={onClick}
        className='bg-white dark:bg-slate-900 rounded-xl border p-6 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group'
      >
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors'>
              <Building2 className='h-6 w-6' />
            </div>
            <div>
              <h3 className='font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors'>
                {client.name}
              </h3>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium mt-1',
                  client.type === 'company'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                )}
              >
                {client.type === 'company' ? 'Empresa' : 'Individual'}
              </span>
            </div>
          </div>
        </div>

        <div className='space-y-2 text-sm text-slate-500 dark:text-slate-400'>
          {client.email && (
            <div className='flex items-center gap-2'>
              <Mail className='h-4 w-4 text-slate-400' />
              <span className='truncate'>{client.email}</span>
            </div>
          )}
          {client.phone && (
            <div className='flex items-center gap-2'>
              <Phone className='h-4 w-4 text-slate-400' />
              <span>{client.phone}</span>
            </div>
          )}
          {(client.city || client.state) && (
            <div className='flex items-center gap-2'>
              <MapPin className='h-4 w-4 text-slate-400' />
              <span className='truncate'>{[client.city, client.state].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>

        <div className='mt-4 pt-4 border-t flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='text-center'>
              <p className='text-lg font-bold text-slate-900 dark:text-white'>
                {client.workOrdersCount || 0}
              </p>
              <p className='text-xs text-slate-500'>Órdenes</p>
            </div>
            <div className='text-center'>
              <p className='text-lg font-bold text-slate-900 dark:text-white'>
                {client.sites?.length || 0}
              </p>
              <p className='text-xs text-slate-500'>Sitios</p>
            </div>
          </div>
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
              client.status === 'active'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            )}
          >
            {client.status === 'active' ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>
    </Link>
  );
}

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend?: { value: number; positive: boolean };
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

export function ClientStatsCard({ title, value, icon: Icon, trend, color = 'primary' }: StatsCardProps) {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    success: 'text-green-600 bg-green-100',
    warning: 'text-amber-600 bg-amber-100',
    danger: 'text-red-600 bg-red-100',
  };

  return (
    <div className='bg-white dark:bg-slate-900 rounded-xl border p-6'>
      <div className='flex items-center justify-between mb-4'>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', colorClasses[color])}>
          <Icon className='h-5 w-5' />
        </div>
        {trend && (
          <span
            className={cn(
              'text-sm font-medium',
              trend.positive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <p className='text-3xl font-bold text-slate-900 dark:text-white'>{value}</p>
      <p className='text-sm text-slate-500 mt-1'>{title}</p>
    </div>
  );
}
