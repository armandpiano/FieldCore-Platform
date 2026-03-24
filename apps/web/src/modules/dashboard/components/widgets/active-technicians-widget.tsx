'use client';

import { TechnicianStatus } from '../../types/dashboard.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight, CheckCircle, Clock, MapPin, User } from 'lucide-react';

interface ActiveTechniciansWidgetProps {
  technicians: TechnicianStatus[];
  isLoading?: boolean;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  available: { label: 'Disponible', color: 'text-green-600' },
  busy: { label: 'Ocupado', color: 'text-orange-600' },
  on_route: { label: 'En camino', color: 'text-blue-600' },
  offline: { label: 'Desconectado', color: 'text-slate-500' },
};

export function ActiveTechniciansWidget({ technicians, isLoading }: ActiveTechniciansWidgetProps) {
  if (isLoading) return <ActiveTechniciansSkeleton />;

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            Técnicos Activos
            {technicians && <Badge variant="secondary" className="ml-1">{technicians.length}</Badge>}
          </CardTitle>
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link href="/dashboard/technicians">Ver todos <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!technicians?.length ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Users className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No hay técnicos activos</p>
          </div>
        ) : (
          <div className="space-y-3">
            {technicians.slice(0, 6).map((tech) => {
              const status = statusConfig[tech.status] || statusConfig.offline;
              return (
                <div key={tech.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">{getInitials(tech.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{tech.name}</p>
                    <p className={cn('text-xs', status.color)}>{status.label}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium">{tech.activeOrders}</p>
                    <p className="text-xs text-muted-foreground">activas</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-green-600">{tech.completedToday}</p>
                    <p className="text-xs text-muted-foreground">hoy</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {technicians?.length ? (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-green-600">{technicians.filter(t => t.status === 'available').length}</p>
                <p className="text-xs text-muted-foreground">Disponibles</p>
              </div>
              <div>
                <p className="text-lg font-bold text-blue-600">{technicians.filter(t => t.status === 'on_route').length}</p>
                <p className="text-xs text-muted-foreground">En camino</p>
              </div>
              <div>
                <p className="text-lg font-bold text-orange-600">{technicians.filter(t => t.status === 'busy').length}</p>
                <p className="text-xs text-muted-foreground">Ocupados</p>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ActiveTechniciansSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3"><Skeleton className="h-6 w-40" /></CardHeader>
      <CardContent className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1.5"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-20" /></div>
            <Skeleton className="h-6 w-8" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
