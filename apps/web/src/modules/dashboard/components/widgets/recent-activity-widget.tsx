'use client';

import { RecentActivity } from '../../types/dashboard.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  ClipboardList,
  UserPlus,
  Play,
  CheckCircle,
  Camera,
  MessageSquare,
  XCircle,
  RefreshCw,
  Activity,
} from 'lucide-react';

interface RecentActivityWidgetProps {
  activities: RecentActivity[];
  isLoading?: boolean;
}

const activityConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  work_order_created: { icon: <ClipboardList className="h-4 w-4" />, color: 'bg-blue-500' },
  work_order_assigned: { icon: <UserPlus className="h-4 w-4" />, color: 'bg-purple-500' },
  work_order_started: { icon: <Play className="h-4 w-4" />, color: 'bg-orange-500' },
  work_order_completed: { icon: <CheckCircle className="h-4 w-4" />, color: 'bg-green-500' },
  evidence_uploaded: { icon: <Camera className="h-4 w-4" />, color: 'bg-cyan-500' },
  comment_added: { icon: <MessageSquare className="h-4 w-4" />, color: 'bg-slate-500' },
  work_order_cancelled: { icon: <XCircle className="h-4 w-4" />, color: 'bg-red-500' },
  technician_status_changed: { icon: <RefreshCw className="h-4 w-4" />, color: 'bg-yellow-500' },
};

export function RecentActivityWidget({ activities, isLoading }: RecentActivityWidgetProps) {
  if (isLoading) return <RecentActivitySkeleton />;

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  };

  const formatTimeDetailed = (date: string) =>
    new Date(date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  const getActivityLink = (activity: RecentActivity) => {
    if (activity.entityType === 'work_order' && activity.entityId) {
      return `/dashboard/work-orders/${activity.entityId}`;
    }
    return '#';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="h-5 w-5 text-muted-foreground" />
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!activities?.length ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Activity className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Sin actividad reciente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 8).map((activity, index) => {
              const config = activityConfig[activity.type] || activityConfig.comment_added;
              const isLast = index === activities.slice(0, 8).length - 1;

              return (
                <div key={activity.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0', config.color)}>
                      {config.icon}
                    </div>
                    {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="flex-1 min-w-0 pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.userName}</span>{' '}
                          <span className="text-muted-foreground">{activity.description}</span>
                        </p>
                        {activity.entityType === 'work_order' && (
                          <Link
                            href={getActivityLink(activity)}
                            className="text-xs text-primary hover:underline mt-0.5 inline-block"
                          >
                            Ver orden
                          </Link>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground">{formatTime(activity.timestamp)}</p>
                        <p className="text-xs text-muted-foreground/60">{formatTimeDetailed(activity.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecentActivitySkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3"><Skeleton className="h-6 w-40" /></CardHeader>
      <CardContent className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
