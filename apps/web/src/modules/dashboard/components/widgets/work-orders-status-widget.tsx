'use client';

import { WorkOrderStatusCount } from '../../types/dashboard.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ClipboardList } from 'lucide-react';

interface WorkOrdersStatusWidgetProps {
  data: WorkOrderStatusCount[];
  isLoading?: boolean;
  totalOrders?: number;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  assigned: 'bg-blue-500',
  in_progress: 'bg-orange-500',
  on_site: 'bg-purple-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
  on_hold: 'bg-slate-500',
};

export function WorkOrdersStatusWidget({
  data,
  isLoading,
  totalOrders = 0,
}: WorkOrdersStatusWidgetProps) {
  if (isLoading) {
    return <WorkOrdersStatusSkeleton />;
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
            Órdenes por Estado
          </CardTitle>
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link href="/dashboard/work-orders">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ClipboardList className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Sin datos disponibles</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((item) => {
              const percentage = (item.count / maxCount) * 100;
              const totalPercentage = totalOrders > 0 
                ? ((item.count / totalOrders) * 100).toFixed(1) 
                : '0';

              return (
                <div key={item.status} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-2.5 h-2.5 rounded-full',
                          statusColors[item.status] || 'bg-slate-500'
                        )}
                      />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">
                        {item.count} ({totalPercentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        statusColors[item.status] || 'bg-slate-500'
                      )}
                      style={{ width: `${Math.max(percentage, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {totalOrders > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold">{totalOrders}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function WorkOrdersStatusSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
