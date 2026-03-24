'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, Check, AlertCircle, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@/store/auth.store';

// Validation schema
const registerSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().min(1, 'El correo es requerido').email('Correo inválido'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Mínimo 8 caracteres').regex(/[A-Z]/, 'Debe tener una mayúscula').regex(/[0-9]/, 'Debe tener un número'),
  confirmPassword: z.string(),
  companyName: z.string().min(2, 'El nombre de empresa es requerido'),
  companySize: z.string().min(1, 'Selecciona el tamaño'),
  acceptTerms: z.boolean().refine(v => v === true, 'Debes aceptar los términos'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const COMPANY_SIZES = [
  { value: '1-5', label: '1-5 empleados' },
  { value: '6-20', label: '6-20 empleados' },
  { value: '21-50', label: '21-50 empleados' },
  { value: '51-200', label: '51-200 empleados' },
  { value: '200+', label: 'Más de 200 empleados' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { setLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setLoading(true);

    try {
      await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        companyName: data.companyName,
        companySize: data.companySize,
      });
      
      router.push('/dashboard');
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Error al registrarse';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex'>
      {/* Left Panel - Branding */}
      <div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary via-secondary to-primary relative overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl' />
          <div className='absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl' />
        </div>
        
        <div className='relative z-10 flex flex-col justify-center px-12 xl:px-24'>
          <div className='flex items-center gap-3 mb-8'>
            <div className='flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm'>
              <ClipboardList className='h-8 w-8 text-white' />
            </div>
            <span className='text-3xl font-bold text-white'>FieldCore</span>
          </div>
          
          <h1 className='text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight'>
            Comienza tu prueba gratuita de 14 días
          </h1>
          
          <p className='text-lg text-white/80 mb-12 max-w-lg'>
            Únete a cientos de empresas en México que ya optimizan sus operaciones de campo con FieldCore.
          </p>

          <div className='space-y-4'>
            <div className='flex items-center gap-3 text-white'>
              <div className='h-8 w-8 rounded-full bg-white/20 flex items-center justify-center'>
                <Check className='h-4 w-4' />
              </div>
              <span>Sin tarjeta de crédito requerida</span>
            </div>
            <div className='flex items-center gap-3 text-white'>
              <div className='h-8 w-8 rounded-full bg-white/20 flex items-center justify-center'>
                <Check className='h-4 w-4' />
              </div>
              <span>Configuración en menos de 5 minutos</span>
            </div>
            <div className='flex items-center gap-3 text-white'>
              <div className='h-8 w-8 rounded-full bg-white/20 flex items-center justify-center'>
                <Check className='h-4 w-4' />
              </div>
              <span>Soporte en español incluido</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className='flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-50 py-12'>
        <div className='w-full max-w-lg space-y-6'>
          {/* Mobile Logo */}
          <div className='lg:hidden flex flex-col items-center mb-6'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-3'>
              <ClipboardList className='h-6 w-6 text-white' />
            </div>
            <span className='text-2xl font-bold text-slate-900'>FieldCore</span>
          </div>

          <Card className='border-0 shadow-xl'>
            <CardHeader className='space-y-1 pb-4'>
              <CardTitle className='text-2xl font-bold text-slate-900'>
                Crear cuenta
              </CardTitle>
              <CardDescription>
                Completa el formulario para comenzar tu prueba gratuita
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className='space-y-4'>
                {error && (
                  <div className='flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200'>
                    <AlertCircle className='h-5 w-5 text-red-500 mt-0.5' />
                    <p className='text-sm text-red-700'>{error}</p>
                  </div>
                )}

                {/* Name Fields */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-slate-700'>Nombre</label>
                    <div className='relative'>
                      <User className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                      <input {...register('firstName')} placeholder='Juan' className='w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20' />
                    </div>
                    {errors.firstName && <p className='text-xs text-red-500'>{errors.firstName.message}</p>}
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-slate-700'>Apellido</label>
                    <input {...register('lastName')} placeholder='Pérez' className='w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20' />
                    {errors.lastName && <p className='text-xs text-red-500'>{errors.lastName.message}</p>}
                  </div>
                </div>

                {/* Email */}
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-slate-700'>Correo electrónico</label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                    <input type='email' {...register('email')} placeholder='juan@empresa.com' className='w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20' />
                  </div>
                  {errors.email && <p className='text-xs text-red-500'>{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-slate-700'>Teléfono (opcional)</label>
                  <div className='relative'>
                    <Phone className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                    <input {...register('phone')} placeholder='55 1234 5678' className='w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20' />
                  </div>
                </div>

                {/* Company Info */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-slate-700'>Empresa</label>
                    <div className='relative'>
                      <Building2 className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                      <input {...register('companyName')} placeholder='Mi Empresa' className='w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20' />
                    </div>
                    {errors.companyName && <p className='text-xs text-red-500'>{errors.companyName.message}</p>}
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-slate-700'>Tamaño</label>
                    <select {...register('companySize')} className='w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20'>
                      <option value=''>Seleccionar...</option>
                      {COMPANY_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    {errors.companySize && <p className='text-xs text-red-500'>{errors.companySize.message}</p>}
                  </div>
                </div>

                {/* Password */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-slate-700'>Contraseña</label>
                    <div className='relative'>
                      <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                      <input type={showPassword ? 'text' : 'password'} {...register('password')} className='w-full h-10 pl-9 pr-10 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20' />
                      <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400'>
                        {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                      </button>
                    </div>
                    {errors.password && <p className='text-xs text-red-500'>{errors.password.message}</p>}
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-slate-700'>Confirmar</label>
                    <input type='password' {...register('confirmPassword')} placeholder='••••••••' className='w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20' />
                    {errors.confirmPassword && <p className='text-xs text-red-500'>{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                {/* Terms */}
                <div className='flex items-start gap-2'>
                  <input type='checkbox' {...register('acceptTerms')} className='mt-1 h-4 w-4 rounded border-slate-300 text-primary' />
                  <label className='text-sm text-slate-600'>
                    Acepto los{' '}
                    <Link href='/terms' className='text-primary hover:underline'>Términos</Link>
                    {' '}y{' '}
                    <Link href='/privacy' className='text-primary hover:underline'>Política de Privacidad</Link>
                  </label>
                </div>
                {errors.acceptTerms && <p className='text-xs text-red-500'>{errors.acceptTerms.message}</p>}

                <Button type='submit' className='w-full' disabled={isSubmitting} loading={isSubmitting}>
                  {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta gratis'}
                </Button>
              </CardContent>
            </form>

            <CardFooter className='flex justify-center pt-0'>
              <p className='text-sm text-slate-500'>
                ¿Ya tienes cuenta?{' '}
                <Link href='/auth/login' className='text-primary font-medium hover:underline'>
                  Inicia sesión
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
