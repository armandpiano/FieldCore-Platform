import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const variants = cva('inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50', {
  variants: {
    variant: { default: 'bg-primary text-white hover:bg-primary/90', destructive: 'bg-red-500 text-white hover:bg-red-600', outline: 'border border-input bg-background hover:bg-accent', ghost: 'hover:bg-accent' },
    size: { default: 'h-10 px-4 py-2', sm: 'h-9 px-3', lg: 'h-11 px-8', icon: 'h-10 w-10' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof variants> { asChild?: boolean; loading?: boolean; }

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, loading, children, ...props }, ref) => (
  <button className={cn(variants({ variant, size }), className)} ref={ref} disabled={loading || props.disabled} {...props}>
    {loading && <span className='mr-2 h-4 w-4 animate-spin'>⟳</span>}
    {children}
  </button>
));
Button.displayName = 'Button';
