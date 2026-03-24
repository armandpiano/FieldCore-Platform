'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Upload, Camera, Check, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '../services/auth.service';

const profileSchema = z.object({
  firstName: z.string().min(2, 'Mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Mínimo 2 caracteres'),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Requerido'),
  newPassword: z.string().min(8, 'Mínimo 8 caracteres').regex(/[A-Z]/, 'Una mayúscula').regex(/[0-9]/, 'Un número'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'No coincide',
  path: ['confirmPassword'],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, setUser, getFullName, getInitials } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onSaveProfile = async (data: ProfileForm) => {
    setIsSaving(true);
    setMessage(null);
    try {
      await authService.updateProfile(data);
      setUser({ ...user!, ...data });
      setMessage({ type: 'success', text: 'Perfil actualizado' });
    } catch {
      setMessage({ type: 'error', text: 'Error al guardar' });
    } finally {
      setIsSaving(false);
    }
  };

  const onChangePassword = async (data: PasswordForm) => {
    setIsChangingPassword(true);
    setMessage(null);
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      passwordForm.reset();
      setMessage({ type: 'success', text: 'Contraseña cambiada' });
    } catch {
      setMessage({ type: 'error', text: 'Error al cambiar contraseña' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className='max-w-3xl mx-auto space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-slate-900 dark:text-white'>Mi Perfil</h1>
        <p className='text-slate-500'>Administra tu información personal</p>
      </div>

      {message && (
        <div className={`flex items-center gap-2 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.type === 'success' ? <Check className='h-5 w-5' /> : <AlertCircle className='h-5 w-5' />}
          {message.text}
        </div>
      )}

      {/* Avatar Section */}
      <div className='bg-white dark:bg-slate-900 rounded-xl border p-6'>
        <div className='flex items-center gap-6'>
          <div className='relative'>
            <div className='h-24 w-24 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-white'>
              {getInitials()}
            </div>
            <button className='absolute bottom-0 right-0 h-8 w-8 rounded-full bg-slate-100 border flex items-center justify-center hover:bg-slate-200'>
              <Camera className='h-4 w-4 text-slate-600' />
            </button>
          </div>
          <div>
            <h2 className='text-lg font-semibold'>{getFullName()}</h2>
            <p className='text-slate-500'>{user?.email}</p>
            <p className='text-sm text-slate-400 capitalize'>{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className='bg-white dark:bg-slate-900 rounded-xl border p-6'>
        <h3 className='text-lg font-semibold mb-4'>Información Personal</h3>
        <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>Nombre</label>
              <input {...profileForm.register('firstName')} className='w-full h-10 px-3 rounded-lg border' />
              {profileForm.formState.errors.firstName && <p className='text-xs text-red-500 mt-1'>{profileForm.formState.errors.firstName.message}</p>}
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Apellido</label>
              <input {...profileForm.register('lastName')} className='w-full h-10 px-3 rounded-lg border' />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Teléfono</label>
            <input {...profileForm.register('phone')} placeholder='55 1234 5678' className='w-full h-10 px-3 rounded-lg border' />
          </div>
          <button type='submit' disabled={isSaving} className='flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50'>
            <Save className='h-4 w-4' />
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>

      {/* Password Form */}
      <div className='bg-white dark:bg-slate-900 rounded-xl border p-6'>
        <h3 className='text-lg font-semibold mb-4'>Cambiar Contraseña</h3>
        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>Contraseña actual</label>
            <input type='password' {...passwordForm.register('currentPassword')} className='w-full h-10 px-3 rounded-lg border' />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>Nueva contraseña</label>
              <input type='password' {...passwordForm.register('newPassword')} className='w-full h-10 px-3 rounded-lg border' />
              {passwordForm.formState.errors.newPassword && <p className='text-xs text-red-500 mt-1'>{passwordForm.formState.errors.newPassword.message}</p>}
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Confirmar</label>
              <input type='password' {...passwordForm.register('confirmPassword')} className='w-full h-10 px-3 rounded-lg border' />
            </div>
          </div>
          <button type='submit' disabled={isChangingPassword} className='flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg dark:bg-white dark:text-slate-900 disabled:opacity-50'>
            Cambiar contraseña
          </button>
        </form>
      </div>
    </div>
  );
}
