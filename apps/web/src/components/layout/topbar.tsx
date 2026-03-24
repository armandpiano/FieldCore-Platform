'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import {
  Bell,
  Moon,
  Sun,
  Menu,
  Search,
  HelpCircle,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Check,
  Building2,
} from 'lucide-react';
import { authService } from '@/modules/auth/services/auth.service';

interface TopbarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function Topbar({ sidebarCollapsed, onToggleSidebar }: TopbarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { user, organization, getFullName, getInitials } = useAuthStore();

  // Handle mounting to avoid hydration mismatch
  useState(() => setMounted(true));

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      window.location.href = '/auth/login';
    } catch {
      window.location.href = '/auth/login';
    }
  };

  // Get page title from pathname
  const getPageTitle = () => {
    const segments = pathname?.split('/').filter(Boolean) || [];
    if (segments.length === 0) return 'Dashboard';
    return segments[segments.length - 1]
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  // Mock notifications
  const notifications = [
    { id: '1', title: 'Nueva orden asignada', time: 'Hace 5 min', unread: true },
    { id: '2', title: 'Orden WO-001 completada', time: 'Hace 1 hora', unread: true },
    { id: '3', title: 'Recordatorio: Revisión de SLA', time: 'Hace 2 horas', unread: false },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/95 dark:border-slate-800',
        'transition-all duration-300',
        sidebarCollapsed ? 'pl-16' : 'pl-64'
      )}
    >
      {/* Left side */}
      <div className='flex items-center gap-4'>
        <button
          onClick={onToggleSidebar}
          className='lg:hidden flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700'
        >
          <Menu className='h-5 w-5' />
        </button>
        
        <div>
          <h1 className='text-lg font-semibold text-slate-900 dark:text-white'>
            {getPageTitle()}
          </h1>
          {organization && (
            <p className='text-xs text-slate-500'>{organization.name}</p>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className='flex items-center gap-2'>
        {/* Search */}
        <button className='hidden md:flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700'>
          <Search className='h-5 w-5' />
        </button>

        {/* Help */}
        <button className='hidden md:flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700'>
          <HelpCircle className='h-5 w-5' />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className='flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700'
        >
          {mounted && theme === 'dark' ? (
            <Sun className='h-5 w-5' />
          ) : (
            <Moon className='h-5 w-5' />
          )}
        </button>

        {/* Notifications */}
        <div className='relative'>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className='relative flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700'
          >
            <Bell className='h-5 w-5' />
            {notifications.some(n => n.unread) && (
              <span className='absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500' />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div className='fixed inset-0 z-40' onClick={() => setShowNotifications(false)} />
              <div className='absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border bg-white shadow-lg dark:bg-slate-900 dark:border-slate-800'>
                <div className='flex items-center justify-between border-b px-4 py-3 dark:border-slate-700'>
                  <h3 className='font-semibold text-slate-900 dark:text-white'>Notificaciones</h3>
                  <button className='text-xs text-primary hover:underline'>Marcar todas como leídas</button>
                </div>
                <div className='max-h-80 overflow-y-auto'>
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={cn(
                        'flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border-b dark:border-slate-700 last:border-0',
                        notif.unread && 'bg-primary/5'
                      )}
                    >
                      <div className={cn('mt-1 h-2 w-2 rounded-full shrink-0', notif.unread ? 'bg-primary' : 'bg-slate-300')} />
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-slate-900 dark:text-white'>{notif.title}</p>
                        <p className='text-xs text-slate-500'>{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='border-t px-4 py-2 dark:border-slate-700'>
                  <Link href='/dashboard/notifications' className='text-sm text-primary hover:underline'>
                    Ver todas las notificaciones
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className='relative'>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className='flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
          >
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-white'>
              {getInitials() || 'U'}
            </div>
            <div className='hidden md:block text-left'>
              <p className='text-sm font-medium text-slate-900 dark:text-white'>
                {getFullName() || user?.firstName || 'Usuario'}
              </p>
              <p className='text-xs text-slate-500 capitalize'>{user?.role}</p>
            </div>
            <ChevronDown className='h-4 w-4 text-slate-400 hidden md:block' />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <>
              <div className='fixed inset-0 z-40' onClick={() => setShowUserMenu(false)} />
              <div className='absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border bg-white shadow-lg dark:bg-slate-900 dark:border-slate-800'>
                <div className='border-b px-4 py-3 dark:border-slate-700'>
                  <p className='text-sm font-medium text-slate-900 dark:text-white'>
                    {getFullName()}
                  </p>
                  <p className='text-xs text-slate-500'>{user?.email}</p>
                </div>
                <div className='py-1'>
                  <Link
                    href='/dashboard/profile'
                    className='flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className='h-4 w-4' />
                    Mi Perfil
                  </Link>
                  <Link
                    href='/dashboard/settings'
                    className='flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className='h-4 w-4' />
                    Configuración
                  </Link>
                  {organization && (
                    <Link
                      href='/dashboard/settings/organization'
                      className='flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Building2 className='h-4 w-4' />
                      Mi Organización
                    </Link>
                  )}
                </div>
                <div className='border-t py-1 dark:border-slate-700'>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className='flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                  >
                    <LogOut className='h-4 w-4' />
                    {isLoggingOut ? 'Saliendo...' : 'Cerrar Sesión'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
