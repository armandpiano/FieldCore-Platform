'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/modules/auth/services/auth.service';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Building2,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  HelpCircle,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

// Navigation items
const MAIN_NAV = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Órdenes de Trabajo', href: '/dashboard/work-orders', icon: ClipboardList, badge: '12' },
  { name: 'Técnicos', href: '/dashboard/technicians', icon: Users },
  { name: 'Clientes', href: '/dashboard/clients', icon: Building2 },
  { name: 'Reportes', href: '/dashboard/reports', icon: BarChart3 },
];

const BOTTOM_NAV = [
  { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, organization, getFullName, getInitials } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      window.location.href = '/auth/login';
    } catch {
      window.location.href = '/auth/login';
    }
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-50 flex h-full flex-col border-r bg-white transition-all duration-300 dark:bg-slate-950',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className='flex h-16 items-center justify-between border-b px-4'>
        <Link href='/dashboard' className='flex items-center gap-2'>
          <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary shrink-0'>
            <ClipboardList className='h-5 w-5 text-white' />
          </div>
          {!collapsed && (
            <div className='flex flex-col'>
              <span className='text-base font-bold text-slate-900 dark:text-white'>FieldCore</span>
              {organization && (
                <span className='text-xs text-slate-500 truncate max-w-[140px]'>{organization.name}</span>
              )}
            </div>
          )}
        </Link>
        <button
          onClick={onToggle}
          className='hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors'
        >
          {collapsed ? <ChevronRight className='h-4 w-4' /> : <ChevronLeft className='h-4 w-4' />}
        </button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className='border-b p-3'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
            <input
              type='text'
              placeholder='Buscar...'
              className='h-9 w-full rounded-md border bg-slate-50 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-900'
            />
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className='flex-1 space-y-1 overflow-y-auto p-2'>
        {MAIN_NAV.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'text-primary')} />
              {!collapsed && (
                <>
                  <span className='flex-1'>{item.name}</span>
                  {item.badge && (
                    <span className='flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/20 px-1.5 text-xs font-medium text-primary'>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className='border-t p-2'>
        {BOTTOM_NAV.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className='h-5 w-5 shrink-0' />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}

        {/* User Profile */}
        <div
          className={cn(
            'mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
            collapsed ? 'justify-center' : ''
          )}
        >
          <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-white'>
            {getInitials() || 'U'}
          </div>
          {!collapsed && (
            <div className='flex-1 overflow-hidden'>
              <p className='truncate text-sm font-medium text-slate-900 dark:text-white'>
                {getFullName() || user?.email}
              </p>
              <p className='truncate text-xs capitalize text-slate-500'>
                {user?.role || 'Usuario'}
              </p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-900/20 dark:hover:text-red-400',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Cerrar Sesión' : undefined}
        >
          <LogOut className='h-5 w-5 shrink-0' />
          {!collapsed && <span>{isLoggingOut ? 'Saliendo...' : 'Cerrar Sesión'}</span>}
        </button>
      </div>
    </aside>
  );
}
