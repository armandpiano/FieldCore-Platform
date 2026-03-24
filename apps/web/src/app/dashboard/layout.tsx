'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, LayoutDashboard, Users, Building2, BarChart3, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const nav = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Órdenes', href: '/dashboard/work-orders', icon: ClipboardList },
  { name: 'Técnicos', href: '/dashboard/technicians', icon: Users },
  { name: 'Clientes', href: '/dashboard/clients', icon: Building2 },
  { name: 'Reportes', href: '/dashboard/reports', icon: BarChart3 },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className='flex min-h-screen'>
      <aside className='w-64 border-r bg-white dark:bg-slate-950'>
        <div className='flex h-16 items-center border-b px-4 gap-2'>
          <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary'><ClipboardList className='h-5 w-5 text-white' /></div>
          <span className='font-bold'>FieldCore</span>
        </div>
        <nav className='p-2 space-y-1'>
          {nav.map(item => (
            <Link key={item.name} href={item.href} className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium', pathname === item.href ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100')}>
              <item.icon className='h-5 w-5' />{item.name}
            </Link>
          ))}
        </nav>
        <div className='absolute bottom-0 w-64 border-t p-4'>
          <div className='flex items-center gap-3'>
            <Avatar className='h-9 w-9'><AvatarFallback className='bg-primary/10 text-primary text-xs'>AV</AvatarFallback></Avatar>
            <div className='flex-1'><p className='text-sm font-medium'>Usuario Demo</p><p className='text-xs text-slate-500'>Admin</p></div>
          </div>
          <Link href='/auth/login' className='mt-3 flex items-center gap-2 text-sm text-slate-500 hover:text-red-500'><LogOut className='h-4 w-4' />Cerrar Sesión</Link>
        </div>
      </aside>
      <main className='flex-1 bg-slate-50 p-6 dark:bg-slate-900'>{children}</main>
    </div>
  );
}
