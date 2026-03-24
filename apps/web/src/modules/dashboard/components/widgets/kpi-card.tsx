'use client';

import { KPICard as KPICardType } from '../../types/dashboard.types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Calendar,
  DollarSign,
  Timer,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

interface KPICardProps {
  kpi: KPICardType;
  isLoading?: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  ClipboardList: <ClipboardList className="h-5 w-5" />,
  CheckCircle: <CheckCircle className="h-5 w-5" />,
  Clock: <Clock className="h-5 w-5" />,
  AlertTriangle: <AlertTriangle className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  Calendar: <Calendar className="h-5 w-5" />,
  DollarSign: <DollarSign className="h-5 w-5" />,
  Timer: <Timer className="h-5 w-5" />,
  MapPin: <MapPin className="h-5 w-5" />,
};

const colorMap: Record<string, string> = {
  default: 'bg-slate-500/10 text-slate-600',
  blue: 'bg-blue-500/10 text-blue-600',
  green: 'bg-green-500/10 text-green-600',
  orange: 'bg-orange-500/10 text-orange-600',
  red: 'bg-red-500/10 text-red-600',
  purple: 'bg-purple-500/10 text-purple-600',
  yellow: 'bg-yellow-500/10 text-yellow-600',
};

export function KPICard({ kpi, isLoading }: KPICardProps) {
  if (isLoading) {
    return <KPICardSkeleton />;
  }

  const icon = iconMap[kpi.icon] || <ClipboardList className="h-5 w-5" />;
  const colorClass = colorMap[kpi.color || 'default'];

  const formatValue = (value: number | string, format?: string) => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'currency':
        return `$${value.toLocaleString('es-MX')}`;
      case 'time':
        if (value < 60) return `${value} min`;
        const hours = Math.floor(value / 60);
        const mins = value % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
      default:
        return value.toLocaleString('es-MX');
    }
  };

  const trendIcon = kpi.trend === 'up' ? (
    <TrendingUp className="h-4 w-4" />
  ) : kpi.trend === 'down' ? (
    <TrendingDown className="h-4 w-4" />
  ) : (
    <Minus className="h-4 w-4" />
  );

  const trendColorClass = kpi.trend === 'up' 
    ? 'text-green-600' 
    : kpi.trend === 'down' 
    ? 'text-red-600' 
    : 'text-muted-foreground';

  const content = (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className={cn('rounded-lg p-2.5', colorClass)}>
            {icon}
          </div>
          {kpi.change !== undefined && (
            <div className={cn('flex items-center gap-1 text-sm', trendColorClass)}>
              {trendIcon}
              <span className="font-medium">
                {kpi.change > 0 ? '+' : ''}{kpi.change}%
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <p className="text-3xl font-bold tracking-tight">
            {formatValue(kpi.value, kpi.format)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{kpi.title}</p>
        </div>

        {kpi.previousValue !== undefined && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              Anterior: {formatValue(kpi.previousValue, kpi.format)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (kpi.link) {
    return (
      <Link href={kpi.link} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

function KPICardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

// KPI Grid component
interface KPIGridProps {
  kpis: KPICardType[];
  isLoading?: boolean;
}

export function KPIGrid({ kpis, isLoading }: KPIGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <KPICard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}
