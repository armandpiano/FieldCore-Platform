import Link from 'next/link';
import { ClipboardList, Users, BarChart3, Shield, Zap, Smartphone } from 'lucide-react';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900'>
      <header className='border-b bg-white/80 backdrop-blur-sm dark:border-slate-800'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4'>
          <div className='flex items-center gap-2'>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary'>
              <ClipboardList className='h-5 w-5 text-white' />
            </div>
            <span className='text-xl font-bold'>FieldCore</span>
          </div>
          <nav className='flex items-center gap-6'>
            <Link href='/auth/login' className='text-sm font-medium hover:text-primary'>Iniciar Sesión</Link>
            <Link href='/auth/register' className='rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90'>Comenzar</Link>
          </nav>
        </div>
      </header>
      
      <section className='container mx-auto px-4 py-24 text-center'>
        <h1 className='mb-6 text-5xl font-bold tracking-tight'>
          Gestión inteligente de <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>operaciones de campo</span>
        </h1>
        <p className='mx-auto mb-10 max-w-2xl text-lg text-slate-600'>FieldCore es la plataforma SaaS que transforma cómo gestionas técnicos, órdenes de trabajo y clientes.</p>
        <div className='flex justify-center gap-4'>
          <Link href='/auth/register' className='rounded-lg bg-primary px-8 py-3 text-base font-medium text-white shadow-lg hover:bg-primary/90'>Prueba gratis 14 días</Link>
          <Link href='/demo' className='rounded-lg border px-8 py-3 text-base font-medium hover:bg-slate-50'>Ver demo</Link>
        </div>
      </section>
      
      <section className='container mx-auto px-4 py-16'>
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {[
            { icon: ClipboardList, title: 'Órdenes de Trabajo', desc: 'Crea, asigna y sigue cada orden.' },
            { icon: Users, title: 'Gestión de Técnicos', desc: 'Administra tu equipo y asigna tareas.' },
            { icon: BarChart3, title: 'Dashboard & Reportes', desc: 'KPIs y métricas en tiempo real.' },
            { icon: Shield, title: 'Evidencia Digital', desc: 'Fotos, firmas y comentarios.' },
            { icon: Zap, title: 'Notificaciones', desc: 'Alertas instantáneas.' },
            { icon: Smartphone, title: 'App Móvil', desc: 'Optimizada para dispositivos.' },
          ].map((f, i) => (
            <div key={i} className='rounded-xl border p-6'>
              <f.icon className='mb-4 h-6 w-6 text-primary' />
              <h3 className='mb-2 font-semibold'>{f.title}</h3>
              <p className='text-sm text-slate-500'>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
