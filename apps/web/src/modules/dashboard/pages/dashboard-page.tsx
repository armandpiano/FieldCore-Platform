'use client';

import { useDashboard } from '../hooks/use-dashboard';
import {
  KPIGrid,
  WorkOrdersStatusWidget,
  ActiveTechniciansWidget,
  OverdueOrdersWidget,
  RecentActivityWidget,
  SummaryWidget,
} from '../components/widgets';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/store/auth.store';
import { RefreshCw, Calendar, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

export function DashboardPage() {
  const { user } = useAuthStore();
  const [dateRange, setDateRange] = useState<string>('today');
  const {
    summary,
    workOrdersByStatus,
    activeTechnicians,
    overdueOrders,
    recentActivity,
    isLoading,
    isError,
    refetch,
  } = useDashboard({
    dateRange: dateRange as 'today' | 'week' | 'month' | 'quarter',
  });

  // Build KPIs from data
  const kpis = summary ? [
    {
      id: 'total',
      title: 'Total Órdenes',
      value: summary.totalOrders,
      icon: 'ClipboardList',
      color: 'blue' as const,
      link: '/dashboard/work-orders',
    },
    {
      id: 'completed',
      title: 'Completadas',
      value: summary.completedOrders,
      icon: 'CheckCircle',
      color: 'green' as const,
      change: summary.totalOrders > 0 
        ? Math.round((summary.completedOrders / summary.totalOrders) * 100) 
        : 0,
      trend: 'up' as const,
    },
    {
      id: 'pending',
      title: 'Pendientes',
      value: summary.pendingOrders + (summary.inProgressOrders || 0),
      icon: 'Clock',
      color: 'orange' as const,
    },
    {
      id: 'cancelled',
      title: 'Canceladas',
      value: summary.cancelledOrders,
      icon: 'AlertTriangle',
      color: 'red' as const,
    },
  ] : [];

  const totalOrders = summary?.totalOrders || 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isError) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <LayoutDashboard className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Error al cargar el dashboard</h3>
          <p className="text-muted-foreground mb-4">
            No se pudieron obtener los datos. Intenta de nuevo.
          </p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, {user?.firstName || user?.email?.split('@')[0] || 'Usuario'}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDate()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="quarter">Este trimestre</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className={isLoading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <KPIGrid kpis={kpis} isLoading={isLoading} />

      {/* Summary Widget */}
      <SummaryWidget summary={summary!} isLoading={isLoading} />

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Work Orders Status */}
        <div className="lg:col-span-2">
          <WorkOrdersStatusWidget
            data={workOrdersByStatus || []}
            isLoading={isLoading}
            totalOrders={totalOrders}
          />
        </div>

        {/* Right Column - Overdue Orders */}
        <div>
          <OverdueOrdersWidget
            orders={overdueOrders || []}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Technicians */}
        <div className="lg:col-span-1">
          <ActiveTechniciansWidget
            technicians={activeTechnicians || []}
            isLoading={isLoading}
          />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivityWidget
            activities={recentActivity || []}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
