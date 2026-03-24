'use client';

import { WorkOrderEvent } from '../types/work-order.types';
import { cn } from '@/lib/utils';
import {
  ClipboardList,
  UserPlus,
  Clock,
  MapPin,
  MessageSquare,
  Camera,
  CheckCircle,
  XCircle,
  Pause,
  RefreshCw,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface WorkOrderTimelineProps {
  events: WorkOrderEvent[];
  isLoading?: boolean;
}

export function WorkOrderTimeline({ events, isLoading }: WorkOrderTimelineProps) {
  if (isLoading) {
    return <TimelineSkeleton />;
  }

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Clock className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No hay actividad registrada</p>
      </div>
    );
  }

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getEventIcon = (type: WorkOrderEvent['type']) => {
    const icons: Record<string, { icon: React.ReactNode; color: string }> = {
      created: { icon: <ClipboardList className="h-4 w-4" />, color: 'bg-blue-500' },
      assigned: { icon: <UserPlus className="h-4 w-4" />, color: 'bg-purple-500' },
      status_change: { icon: <RefreshCw className="h-4 w-4" />, color: 'bg-orange-500' },
      comment: { icon: <MessageSquare className="h-4 w-4" />, color: 'bg-slate-500' },
      evidence_added: { icon: <Camera className="h-4 w-4" />, color: 'bg-green-500' },
      location_update: { icon: <MapPin className="h-4 w-4" />, color: 'bg-cyan-500' },
    };
    return icons[type] || icons.comment;
  };

  const getEventDescription = (event: WorkOrderEvent) => {
    switch (event.type) {
      case 'created':
        return 'Orden de servicio creada';
      case 'assigned':
        return event.newValue
          ? `Asignada a ${event.newValue}`
          : 'Técnico asignado';
      case 'status_change':
        return event.newValue
          ? `Estado cambiado: ${event.previousValue} → ${event.newValue}`
          : 'Estado actualizado';
      case 'comment':
        return event.description;
      case 'evidence_added':
        return 'Evidencia agregada';
      case 'location_update':
        return 'Ubicación actualizada';
      default:
        return event.description;
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: string) => {
    const eventDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (eventDate.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (eventDate.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return eventDate.toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
      });
    }
  };

  // Group events by date
  const groupedEvents = sortedEvents.reduce((acc, event) => {
    const dateKey = new Date(event.createdAt).toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, WorkOrderEvent[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedEvents).map(([dateKey, dateEvents]) => (
        <div key={dateKey}>
          <div className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-muted rounded">
              {formatDate(dateEvents[0].createdAt)}
            </span>
          </div>
          <div className="space-y-4">
            {dateEvents.map((event, index) => {
              const { icon, color } = getEventIcon(event.type);
              const isLast = index === dateEvents.length - 1;

              return (
                <div key={event.id} className="flex gap-3">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0',
                        color
                      )}
                    >
                      {icon}
                    </div>
                    {!isLast && (
                      <div className="w-px flex-1 bg-border mt-1" />
                    )}
                  </div>

                  {/* Event content */}
                  <div className="flex-1 pb-4 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{event.userName}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {getEventDescription(event)}
                        </p>
                        {event.type === 'comment' && (
                          <div className="mt-2 p-2 bg-muted rounded-md">
                            <p className="text-sm whitespace-pre-wrap">{event.description}</p>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatTime(event.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            <div className="w-px flex-1 bg-border mt-1" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            <div className="h-3 w-48 bg-muted rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Compact timeline for card view
interface CompactTimelineProps {
  events: WorkOrderEvent[];
  maxItems?: number;
}

export function WorkOrderCompactTimeline({ events, maxItems = 3 }: CompactTimelineProps) {
  if (!events || events.length === 0) {
    return null;
  }

  const recentEvents = [...events]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, maxItems);

  return (
    <div className="space-y-2">
      {recentEvents.map((event) => (
        <div key={event.id} className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="truncate flex-1">
            {event.userName} - {event.description}
          </span>
          <span>
            {new Date(event.createdAt).toLocaleTimeString('es-MX', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      ))}
      {events.length > maxItems && (
        <p className="text-xs text-muted-foreground">
          +{events.length - maxItems} más
        </p>
      )}
    </div>
  );
}
