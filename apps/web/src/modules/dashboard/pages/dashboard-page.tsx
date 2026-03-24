'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge, PriorityBadge } from '@/components/ui/badge';
import { ClipboardList, Users, CheckCircle2, Clock } from 'lucide-react';

const stats = [
  { title: 'Órdenes Totales', value: '156', icon: ClipboardList, color: 'text-blue-600' },
  { title: 'En Progreso', value: '23', icon: Clock, color: 'text-violet-600' },
  { title: 'Completadas Hoy', value: '12', icon: CheckCircle2, color: 'text-green-600' },
  { title: 'Técnicos Activos', value: '8', icon: Users, color: 'text-amber-600' },
];

const recentOrders = [
  { id: 'WO-001', title: 'Mantenimiento preventivo', client: 'Acme Corp', status: 'in_progress' as const, priority: 'high' as const },
  { id: 'WO-002', title: 'Reparación HVAC', client: 'Tech Solutions', status: 'assigned' as const, priority: 'urgent' as const },
  { id: 'WO-003', title: 'Instalación equipos', client: 'Global Ind', status: 'pending_assignment' as const, priority: 'medium' as const },
  { id: 'WO-004', title: 'Inspección trimestral', client: 'Prime Services', status: 'completed' as const, priority: 'low' as const },
];

export default function DashboardPage() {
  return (
    <div className='space-y-6'>
      <div><h1 className='text-2xl font-bold'>Dashboard</h1><p className='text-slate-500'>Resumen de operaciones</p></div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {stats.map(s => (
          <Card key={s.title}>
            <CardContent className='p-6'>
              <div className='flex items-center gap-4'>
                <div className={`rounded-lg p-2 bg-muted`}><s.icon className={`h-5 w-5 ${s.color}`} /></div>
                <div><p className='text-2xl font-bold'>{s.value}</p><p className='text-sm text-slate-500'>{s.title}</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Órdenes Recientes</CardTitle></CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {recentOrders.map(o => (
              <div key={o.id} className='flex items-center justify-between rounded-lg border p-4'>
                <div className='flex items-center gap-4'>
                  <div className='h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center'><ClipboardList className='h-5 w-5 text-primary' /></div>
                  <div><p className='font-medium'>{o.id}</p><p className='text-sm text-slate-500'>{o.title} - {o.client}</p></div>
                </div>
                <div className='flex gap-2'><StatusBadge status={o.status} /><PriorityBadge priority={o.priority} /></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
