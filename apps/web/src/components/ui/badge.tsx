import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', {
  variants: {
    variant: { default: 'bg-primary text-white', secondary: 'bg-slate-100 text-slate-700', success: 'bg-green-100 text-green-700', warning: 'bg-amber-100 text-amber-700', destructive: 'bg-red-100 text-red-700' },
  },
  defaultVariants: { variant: 'default' },
});

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;
export const Badge = ({ className, variant, ...props }: BadgeProps) => <div className={cn(badgeVariants({ variant }), className)} {...props} />;

export type WorkOrderStatus = 'draft' | 'pending_assignment' | 'assigned' | 'in_progress' | 'paused' | 'completed' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

const statusConfig: Record<WorkOrderStatus, string> = {
  draft: 'bg-slate-100 text-slate-700',
  pending_assignment: 'bg-amber-100 text-amber-700',
  assigned: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-violet-100 text-violet-700',
  paused: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<WorkOrderStatus, string> = {
  draft: 'Borrador', pending_assignment: 'Pendiente', assigned: 'Asignado', in_progress: 'En Progreso', paused: 'Pausado', completed: 'Completado', cancelled: 'Cancelado',
};

const priorityConfig: Record<Priority, string> = {
  low: 'bg-green-100 text-green-800', medium: 'bg-yellow-100 text-yellow-800', high: 'bg-orange-100 text-orange-800', urgent: 'bg-red-100 text-red-800',
};

const priorityLabels: Record<Priority, string> = { low: 'Baja', medium: 'Media', high: 'Alta', urgent: 'Urgente' };

export const StatusBadge = ({ status, className }: { status: WorkOrderStatus; className?: string }) => (
  <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', statusConfig[status], className)}>{statusLabels[status]}</span>
);

export const PriorityBadge = ({ priority, className }: { priority: Priority; className?: string }) => (
  <span className={cn('inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold', priorityConfig[priority], className)}>{priorityLabels[priority]}</span>
);
