'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { AuthProvider } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <AuthProvider>
      <div className='min-h-screen bg-slate-50 dark:bg-slate-950'>
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={toggleSidebar} 
        />
        <div
          className={cn(
            'transition-all duration-300',
            sidebarCollapsed ? 'pl-16' : 'pl-64'
          )}
        >
          <Topbar 
            sidebarCollapsed={sidebarCollapsed} 
            onToggleSidebar={toggleSidebar} 
          />
          <main className='p-6'>{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
