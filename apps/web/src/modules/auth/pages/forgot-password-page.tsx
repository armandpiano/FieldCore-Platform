'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, AlertCircle, CheckCircle, ClipboardList } from 'lucide-react';
import { authService } from '../services/auth.service';

const schema = z.object({
  email: z.string().min(1, 'Requerido').email('Email inválido'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.forgotPassword(data.email);
      setIsSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al enviar email');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50 px-4'>
        <div className='w-full max-w-md text-center'>
          <div className='flex justify-center mb-6'>
            <div className='h-16 w-16 rounded-full bg-green-100 flex items-center justify-center'>
              <CheckCircle className='h-8 w-8 text-green-600' />
            </div>
          </div>
          <h1 className='text-2xl font-bold text-slate-900 mb-2'>Revisa tu correo</h1>
          <p className='text-slate-600 mb-6'>
            Te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.
          </p>
          <Link href='/auth/login' className='text-primary hover:underline'>
            Volver al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50 px-4'>
      <div className='w-full max-w-md'>
        <div className='flex justify-center mb-8'>
          <div className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary'>
              <ClipboardList className='h-5 w-5 text-white' />
            </div>
            <span className='text-xl font-bold'>FieldCore</span>
          </div>
        </div>

        <div className='bg-white rounded-xl shadow-lg p-8'>
          <h1 className='text-xl font-bold text-slate-900 mb-2'>¿Olvidaste tu contraseña?</h1>
          <p className='text-slate-600 mb-6'>
            Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </p>

          {error && (
            <div className='flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 mb-4'>
              <AlertCircle className='h-5 w-5' />
              <span className='text-sm'>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-1'>Correo electrónico</label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400' />
                <input
                  type='email'
                  {...register('email')}
                  placeholder='tu@email.com'
                  className='w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                />
              </div>
              {errors.email && <p className='text-sm text-red-500 mt-1'>{errors.email.message}</p>}
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full h-11 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50'
            >
              {isLoading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>

          <p className='text-center text-sm text-slate-500 mt-6'>
            ¿Recordaste tu contraseña?{' '}
            <Link href='/auth/login' className='text-primary font-medium hover:underline'>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
