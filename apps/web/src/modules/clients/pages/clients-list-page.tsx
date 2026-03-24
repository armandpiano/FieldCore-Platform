'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const clients = [
  { id: '1', name: 'Acme Corporation', rfc: 'ACM-123456789', email: 'contacto@acme.com', sites: 3, orders: 25 },
  { id: '2', name: 'Tech Solutions SA', rfc: 'TEC-987654321', email: 'info@techsolutions.com', sites: 2, orders: 18 },
  { id: '3', name: 'Global Industries', rfc: 'GLI-456789123', email: 'operaciones@global.com', sites: 5, orders: 42 },
  { id: '4', name: 'Prime Services', rfc: 'PRS-789123456', email: 'contacto@prime.com', sites: 2, orders: 15 },
];

export default function ClientsListPage() {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div><h1 className='text-2xl font-bold'>Clientes</h1><p className='text-slate-500'>Gestiona tus clientes</p></div>
        <button className='px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium'>+ Agregar</button>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {clients.map(c => (
          <Card key={c.id}>
            <CardContent className='p-6'>
              <h3 className='font-semibold mb-2'>{c.name}</h3>
              <Badge variant='outline' className='mb-4'>{c.rfc}</Badge>
              <div className='space-y-1 text-sm text-slate-500'><p>{c.email}</p></div>
              <div className='mt-4 flex justify-between border-t pt-4'><div className='text-center'><p className='text-xl font-bold'>{c.sites}</p><p className='text-xs'>Sitios</p></div><div className='text-center'><p className='text-xl font-bold'>{c.orders}</p><p className='text-xs'>Órdenes</p></div></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
