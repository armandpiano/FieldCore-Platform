import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, label, error, id, ...props }, ref) => {
  const inputId = id || React.useId();
  return (
    <div className='w-full'>
      {label && <label htmlFor={inputId} className='mb-1.5 block text-sm font-medium'>{label}</label>}
      <input id={inputId} className={cn('flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:opacity-50', error && 'border-red-500', className)} ref={ref} {...props} />
      {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  );
});
Input.displayName = 'Input';
