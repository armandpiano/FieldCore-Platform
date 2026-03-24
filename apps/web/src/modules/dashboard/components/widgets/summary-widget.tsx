'use client';

import { DashboardSummary } from '../../types/dashboard.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  Timer,
  TrendingUp,
} from 'lucide-react';

interface SummaryWidgetProps {
  summary: DashboardSummary;
  isLoading?: boolean;
}

export function SummaryWidget({ summary, isLoading }: SummaryWidgetProps) {
  if (isLoading) return <SummarySkeleton />;

  const completionRate = summary?.completionRate || 0;
  const avgDuration = summary?.averageDuration || 0;

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          Resumen del Período
        </CardTitle>
        {summary?.period && (
          <p className="text-sm text-muted-foreground">{summary.period.label}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Orders */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary?.totalOrders || 0}</p>
              <p className="text-xs text-muted-foreground">Total órdenes</p>
            </div>
          </div>

          {/* Completed */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary?.completedOrders || 0}</p>
              <p className="text-xs text-muted-foreground">Completadas</p>
            </div>
          </div>

          {/* Cancelled */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary?.cancelledOrders || 0}</p>
              <p className="text-xs text-muted-foreground">Canceladas</p>
            </div>
          </div>

          {/* Pending */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary?.pendingOrders || 0}</p>
              <p className="text-xs text-muted-foreground">Pendientes</p>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tasa de completación</span>
            <span className="font-medium">{completionRate.toFixed(1)}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Average Duration */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Duración promedio
            </span>
            <span className="font-medium">{formatDuration(avgDuration)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SummarySkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-7 w-12" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-2 w-full" />
      </CardContent>
    </Card>
  );
}
