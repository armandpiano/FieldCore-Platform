'use client';

import { WorkOrder, WORK_ORDER_STATUS_CONFIG, PRIORITY_CONFIG } from '../types/work-order.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pause,
  UserPlus,
  Eye,
  Edit,
} from 'lucide-react';

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onView?: () => void;
  onEdit?: () => void;
  className?: string;
}

export function WorkOrderCard({ workOrder, onView, onEdit, className }: WorkOrderCardProps) {
  const statusConfig = WORK_ORDER_STATUS_CONFIG[workOrder.status];
  const priorityConfig = PRIORITY_CONFIG[workOrder.priority];

  const statusIcons: Record<string, React.ReactNode> = {
    Clock: <Clock className="h-3 w-3" />,
    UserCheck: <UserPlus className="h-3 w-3" />,
    MapPin: <MapPin className="h-3 w-3" />,
    CheckCircle: <CheckCircle className="h-3 w-3" />,
    XCircle: <XCircle className="h-3 w-3" />,
    Pause: <Pause className="h-3 w-3" />,
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const getSlaStatus = () => {
    if (!workOrder.slaDeadline) return null;
    const deadline = new Date(workOrder.slaDeadline);
    const now = new Date();
    const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (workOrder.status === 'completed' || workOrder.status === 'cancelled') return null;

    if (workOrder.slaStatus === 'breached' || hoursRemaining < 0) {
      return { label: 'SLA Vencido', color: 'text-red-600 bg-red-50' };
    } else if (workOrder.slaStatus === 'at_risk' || hoursRemaining < 2) {
      return { label: 'SLA en Riesgo', color: 'text-orange-600 bg-orange-50' };
    }
    return null;
  };

  const slaStatus = getSlaStatus();

  return (
    <Card className={`hover:shadow-md transition-shadow cursor-pointer ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-mono text-xs text-muted-foreground mb-1">
              {workOrder.folio}
            </p>
            <CardTitle className="text-base truncate">{workOrder.title}</CardTitle>
          </div>
          <Badge
            variant="secondary"
            className={`${statusConfig.bgColor} ${statusConfig.color} shrink-0 gap-1`}
          >
            {statusIcons[statusConfig.icon]}
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Client & Site */}
        <div className="space-y-1">
          <p className="text-sm font-medium truncate">{workOrder.client?.name || 'Cliente'}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{workOrder.site?.name || workOrder.serviceAddress}</span>
          </div>
        </div>

        {/* Date & Priority */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{formatDate(workOrder.scheduledDate)}</span>
          </div>
          <Badge
            variant="secondary"
            className={`${priorityConfig.bgColor} ${priorityConfig.color}`}
          >
            {workOrder.priority === 'urgent' && <AlertTriangle className="h-3 w-3 mr-1" />}
            {priorityConfig.label}
          </Badge>
        </div>

        {/* Technician */}
        {workOrder.assignedTo && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{workOrder.assignedTo.name}</p>
              {workOrder.assignedTo.phone && (
                <p className="text-xs text-muted-foreground truncate">
                  {workOrder.assignedTo.phone}
                </p>
              )}
            </div>
          </div>
        )}

        {/* SLA Status */}
        {slaStatus && (
          <div className={`text-xs px-2 py-1 rounded ${slaStatus.color}`}>
            <AlertTriangle className="h-3 w-3 inline mr-1" />
            {slaStatus.label}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          {onView && (
            <Button variant="outline" size="sm" className="flex-1" onClick={onView}>
              <Eye className="h-3 w-3 mr-1" />
              Ver
            </Button>
          )}
          {onEdit && workOrder.status !== 'completed' && workOrder.status !== 'cancelled' && (
            <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
              <Edit className="h-3 w-3 mr-1" />
              Editar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Stats card for dashboard
interface WorkOrderStatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
  color?: 'default' | 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

export function WorkOrderStatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'default',
}: WorkOrderStatsCardProps) {
  const colorClasses = {
    default: 'bg-slate-500/10 text-slate-600',
    blue: 'bg-blue-500/10 text-blue-600',
    green: 'bg-green-500/10 text-green-600',
    orange: 'bg-orange-500/10 text-orange-600',
    red: 'bg-red-500/10 text-red-600',
    purple: 'bg-purple-500/10 text-purple-600',
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`rounded-full p-2.5 ${colorClasses[color]}`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {trend && (
                <span
                  className={`text-xs font-medium ${
                    trend.positive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {trend.positive ? '+' : ''}{trend.value}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
