'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Mail, AlertCircle, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/store/auth.store';

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Ingresa un correo electrónico válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { setLoading, setError: setStoreError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setStoreError(null);
    setLoading(true);

    try {
      const session = await authService.login(data);
      
      if (session) {
        setIsSuccess(true);
        // Small delay for success feedback
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || 
                      err?.message || 
                      'Error al iniciar sesión. Verifica tus credenciales.';
      setError(message);
      setStoreError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex'>
      {/* Left Panel - Branding */}
      <div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-secondary relative overflow-hidden'>
        {/* Decorative elements */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl' />
          <div className='absolute bottom-20 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl' />
        </div>
        
        <div className='relative z-10 flex flex-col justify-center px-12 xl:px-24'>
          <div className='flex items-center gap-3 mb-8'>
            <div className='flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm'>
              <ClipboardList className='h-8 w-8 text-white' />
            </div>
            <span className='text-3xl font-bold text-white'>FieldCore</span>
          </div>
          
          <h1 className='text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight'>
            Gestión inteligente de operaciones de campo
          </h1>
          
          <p className='text-lg text-white/80 mb-12 max-w-lg'>
            La plataforma SaaS que transforma cómo gestionas técnicos, órdenes de trabajo y clientes en tiempo real.
          </p>

          <div className='space-y-6'>
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center'>
                <svg className='h-6 w-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
              <div>
                <p className='text-white font-medium'>Seguimiento en tiempo real</p>
                <p className='text-white/60 text-sm'>Monitorea el estado de cada orden</p>
              </div>
            </div>
            
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center'>
                <svg className='h-6 w-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
              </div>
              <div>
                <p className='text-white font-medium'>Evidencia digital</p>
                <p className='text-white/60 text-sm'>Fotos, firmas y comentarios</p>
              </div>
            </div>
            
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center'>
                <svg className='h-6 w-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                </svg>
              </div>
              <div>
                <p className='text-white font-medium'>Reportes y métricas</p>
                <p className='text-white/60 text-sm'>KPIs y dashboards personalizados</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className='flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-50'>
        <div className='w-full max-w-md space-y-8'>
          {/* Mobile Logo */}
          <div className='lg:hidden flex flex-col items-center mb-8'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-3'>
              <ClipboardList className='h-6 w-6 text-white' />
            </div>
            <span className='text-2xl font-bold text-slate-900'>FieldCore</span>
          </div>

          <Card className='border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50'>
            <CardHeader className='space-y-1 pb-4'>
              <CardTitle className='text-2xl font-bold text-slate-900 dark:text-white'>
                Iniciar Sesión
              </CardTitle>
              <CardDescription className='text-slate-500'>
                Ingresa tus credenciales para acceder a tu cuenta
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className='space-y-5'>
                {/* Error Alert */}
                {error && (
                  <div className='flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'>
                    <AlertCircle className='h-5 w-5 text-red-500 mt-0.5 shrink-0' />
                    <p className='text-sm text-red-700 dark:text-red-400'>{error}</p>
</div>
                )}

                {/* Success Indicator */}
                {isSuccess && (
                  <div className='flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800'>
                    <svg className='h-5 w-5 text-green-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                    </svg>
                    <p className='text-sm text-green-700 dark:text-green-400'>
                      ¡Sesión iniciada correctamente! Redirigiendo...
                    </p>
                  </div>
                )}

                {/* Email Field */}
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                    Correo electrónico
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <Mail className='h-5 w-5 text-slate-400' />
                    </div>
                    <input
                      type='email'
                      placeholder='correo@empresa.com'
                      className={`w-full h-11 pl-10 pr-4 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                        errors.email 
                          ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className='text-sm text-red-500 flex items-center gap-1'>
                      <AlertCircle className='h-3 w-3' />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                    Contraseña
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <Lock className='h-5 w-5 text-slate-400' />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      className={`w-full h-11 pl-10 pr-12 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                        errors.password 
                          ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                      {...register('password')}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors'
                    >
                      {showPassword ? (
                        <EyeOff className='h-5 w-5' />
                      ) : (
                        <Eye className='h-5 w-5' />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className='text-sm text-red-500 flex items-center gap-1'>
                      <AlertCircle className='h-3 w-3' />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember & Forgot */}
                <div className='flex items-center justify-between'>
                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      className='h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary'
                    />
                    <span className='text-sm text-slate-600 dark:text-slate-400'>
                      Recordarme
                    </span>
                  </label>
                  <Link
                    href='/auth/forgot-password'
                    className='text-sm font-medium text-primary hover:text-primary/80 transition-colors'
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type='submit'
                  className='w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-all disabled:opacity-50'
                  disabled={isSubmitting || isSuccess}
                  loading={isSubmitting}
                >
                  {isSubmitting ? 'Iniciando sesión...' : isSuccess ? '¡Bienvenido!' : 'Iniciar Sesión'}
                </Button>
              </CardContent>
            </form>

            <CardFooter className='flex flex-col space-y-4 pt-0'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-slate-200 dark:border-slate-700' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-white dark:bg-slate-950 px-2 text-slate-500'>
                    ¿No tienes cuenta?
                  </span>
                </div>
              </div>
              
              <Link
                href='/auth/register'
                className='w-full h-11 flex items-center justify-center rounded-lg border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors'
              >
                Crear cuenta gratis
              </Link>
            </CardFooter>
          </Card>

          {/* Demo Credentials */}
          <div className='text-center'>
            <p className='text-xs text-slate-400 mb-2'>¿Quieres probar la plataforma?</p>
            <Link
              href='/demo'
              className='text-xs text-primary hover:text-primary/80 font-medium'
            >
              Ver demo en vivo →
            </Link>
          </div>

          {/* Footer */}
          <p className='text-center text-xs text-slate-400'>
            © 2024 FieldCore. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
