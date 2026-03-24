'use client';
import { StatusBadge, PriorityBadge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const mockOrders = [
  { id: 'WO-001', title: 'Mantenimiento preventivo', client: 'Acme Corp', technician: 'Carlos M.', status: 'in_progress' as const, priority: 'high' as const, dueDate: '2024-03-15' },
  { id: 'WO-002', title: 'Reparación HVAC', client: 'Tech Solutions', technician: 'María G.', status: 'assigned' as const, priority: 'urgent' as const, dueDate: '2024-03-15' },
  { id: 'WO-003', title: 'Instalación equipos', client: 'Global Ind', technician: null, status: 'pending_assignment' as const, priority: 'medium' as const, dueDate: '2024-03-20' },
  { id: 'WO-004', title: 'Inspección trimestral', client: 'Prime Services', technician: 'Ana S.', status: 'completed' as const, priority: 'low' as const, dueDate: '2024-03-14' },
];

export default function WorkOrdersListPage() {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div><h1 className='text-2xl font-bold'>Órdenes de Trabajo</h1><p className='text-slate-500'>Gestiona todas tus órdenes</p></div>
        <Button>+ Nueva Orden</Button>
      </div>
      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Orden</TableHead><TableHead>Técnico</TableHead><TableHead>Estado</TableHead><TableHead>Prioridad</TableHead></TableRow></TableHeader>
            <TableBody>
              {mockOrders.map(o => (
                <TableRow key={o.id}>
                  <TableCell className='font-medium text-primary'>{o.id}</TableCell>
                  <TableCell><p className='font-medium'>{o.title}</p><p className='text-sm text-slate-500'>{o.client}</p></TableCell>
                  <TableCell>{o.technician || <span className='text-amber-500'>Sin asignar</span>}</TableCell>
                  <TableCell><StatusBadge status={o.status} /></TableCell>
                  <TableCell><PriorityBadge priority={o.priority} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
