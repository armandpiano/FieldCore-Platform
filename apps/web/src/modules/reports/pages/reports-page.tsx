'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, CheckCircle2, Clock, Users } from 'lucide-react';

const kpis = [
  { title: 'Órdenes Totales', value: '1,234', icon: BarChart3, color: 'text-blue-600' },
  { title: 'Completadas', value: '987', icon: CheckCircle2, color: 'text-green-600' },
  { title: 'En Tiempo', value: '94%', icon: Clock, color: 'text-violet-600' },
  { title: 'Técnicos Activos', value: '24', icon: Users, color: 'text-amber-600' },
];

export default function ReportsPage() {
  return (
    <div className='space-y-6'>
      <div><h1 className='text-2xl font-bold'>Reportes</h1><p className='text-slate-500'>Analiza el rendimiento</p></div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {kpis.map(k => (
          <Card key={k.title}>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div className={`rounded-lg p-2 bg-muted`}><k.icon className={`h-5 w-5 ${k.color}`} /></div>
              </div>
              <div className='mt-4'><p className='text-3xl font-bold'>{k.value}</p><p className='text-sm text-slate-500'>{k.title}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Rendimiento General</CardTitle></CardHeader>
        <CardContent>
          <div className='h-[300px] flex items-center justify-center bg-muted rounded-lg'>
            <p className='text-slate-500'>Gráfico de rendimiento - Próximamente</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
