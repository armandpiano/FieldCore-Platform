'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 px-4'>
      <div className='w-full max-w-md space-y-6'>
        <div className='flex flex-col items-center'>
          <div className='flex h-14 w-14 items-center justify-center rounded-xl bg-primary'><span className='text-2xl text-white'>F</span></div>
          <h1 className='mt-4 text-2xl font-bold'>FieldCore</h1>
        </div>
        <Card>
          <CardHeader><CardTitle>Iniciar Sesión</CardTitle><CardDescription>Ingresa tus credenciales</CardDescription></CardHeader>
          <form>
            <CardContent className='space-y-4'>
              <Input label='Correo electrónico' type='email' placeholder='correo@ejemplo.com' />
              <Input label='Contraseña' type='password' placeholder='••••••••' />
              <div className='flex justify-between text-sm'>
                <label className='flex items-center gap-2'><input type='checkbox' className='rounded' />Recordarme</label>
                <Link href='/auth/forgot-password' className='text-primary hover:underline'>¿Olvidaste tu contraseña?</Link>
              </div>
            </CardContent>
            <div className='p-6 pt-0'>
              <Button type='submit' className='w-full'>Iniciar Sesión</Button>
              <p className='mt-4 text-center text-sm text-slate-500'>¿No tienes cuenta?<Link href='/auth/register' className='text-primary hover:underline'>Regístrate</Link></p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
