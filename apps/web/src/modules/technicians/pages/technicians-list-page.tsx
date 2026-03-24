'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const techs = [
  { id: '1', name: 'Carlos Martínez', email: 'carlos@fieldcore.com', role: 'technician', location: 'CDMX', completed: 45, rating: 4.8 },
  { id: '2', name: 'María García', email: 'maria@fieldcore.com', role: 'technician', location: 'Monterrey', completed: 38, rating: 4.9 },
  { id: '3', name: 'Juan López', email: 'juan@fieldcore.com', role: 'technician', location: 'Guadalajara', completed: 52, rating: 4.7 },
  { id: '4', name: 'Ana Sánchez', email: 'ana@fieldcore.com', role: 'supervisor', location: 'CDMX', completed: 67, rating: 4.9 },
];

export default function TechniciansListPage() {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div><h1 className='text-2xl font-bold'>Técnicos</h1><p className='text-slate-500'>Gestiona tu equipo</p></div>
        <button className='px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium'>+ Agregar</button>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {techs.map(t => (
          <Card key={t.id}>
            <CardContent className='p-6'>
              <div className='flex items-center gap-3'>
                <Avatar className='h-12 w-12'><AvatarFallback className='bg-primary/10 text-primary'>{t.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                <div><h3 className='font-semibold'>{t.name}</h3><Badge variant={t.role === 'supervisor' ? 'default' : 'secondary'}>{t.role}</Badge></div>
              </div>
              <div className='mt-4 space-y-1 text-sm text-slate-500'><p>{t.email}</p><p>{t.location}</p></div>
              <div className='mt-4 flex justify-between border-t pt-4'><div className='text-center'><p className='text-xl font-bold'>{t.completed}</p><p className='text-xs'>Completadas</p></div><div className='text-center'><p className='text-xl font-bold'>{t.rating}</p><p className='text-xs'>Rating</p></div></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
