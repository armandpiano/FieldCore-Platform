'use client';

import { OverdueOrder } from '../../types/dashboard.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, MapPin, Clock } from 'lucide-react';

interface OverdueOrdersWidgetProps {
  orders: OverdueOrder[];
  isLoading?: boolean;
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Baja', color: 'bg-slate-100 text-slate-700' },
  medium: { label: 'Media', color: 'bg-blue-100 text-blue-700' },
  high: { label: 'Alta', color: 'bg-orange-100 text-orange-700' },
  urgent: { label: 'Urgente', color: 'bg-red-100 text-red-700' },
};

export function OverdueOrdersWidget({ orders, isLoading }: OverdueOrdersWidgetProps) {
  if (isLoading) return <OverdueOrdersSkeleton />;

  const getHoursOverdueClass = (hours: number) => {
    if (hours > 24) return 'text-red-600 bg-red-50';
    if (hours > 8) return 'text-orange-600 bg-orange-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const formatHours = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}min`;
    if (hours < 24) return `${Math.round(hours)}h`;
    return `${Math.round(hours / 24)}d`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Órdenes Vencidas
            {orders?.length ? (
              <Badge variant="destructive" className="ml-1">{orders.length}</Badge>
            ) : null}
          </CardTitle>
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link href="/dashboard/work-orders?status=overdue">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!orders?.length ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-10 w-10 text-green-500 mb-2" />
            <p className="text-sm font-medium text-green-600">Sin órdenes vencidas</p>
            <p className="text-xs text-muted-foreground">¡Buen trabajo!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => {
              const priority = priorityConfig[order.priority] || priorityConfig.medium;
              const hoursClass = getHoursOverdueClass(order.hoursOverdue);

              return (
                <Link
                  key={order.id}
                  href={`/dashboard/work-orders/${order.id}`}
                  className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-muted-foreground">{order.folio}</span>
                        <Badge className={cn('text-xs', priority.color)}>{priority.label}</Badge>
                      </div>
                      <p className="font-medium text-sm truncate">{order.title}</p>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {order.siteName || order.clientName}
                      </p>
                    </div>
                    <div className={cn('text-xs font-medium px-2 py-1 rounded shrink-0', hoursClass)}>
                      <Clock className="h-3 w-3 inline mr-1" />
                      {formatHours(order.hoursOverdue)}
                    </div>
                  </div>
                  {order.assignedTo && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Asignado a: {order.assignedTo.name}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function OverdueOrdersSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3"><Skeleton className="h-6 w-40" /></CardHeader>
      <CardContent className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-3 rounded-lg border space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
