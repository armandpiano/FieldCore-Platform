'use client';
import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>, ref: any) => (
  <SelectPrimitive.Trigger ref={ref} className={cn('flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm disabled:opacity-50', className)} {...props}>
    {children}<ChevronDown className='h-4 w-4 opacity-50' />
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = 'SelectTrigger';
const SelectContent = React.forwardRef(({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>, ref: any) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content ref={ref} className={cn('relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover shadow-md', className)} {...props}>
      <SelectPrimitive.Viewport className='p-1'>{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = 'SelectContent';
const SelectItem = React.forwardRef(({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>, ref: any) => (
  <SelectPrimitive.Item ref={ref} className={cn('relative flex cursor-default select-none items-center py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent', className)} {...props}>
    <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'><SelectPrimitive.ItemIndicator><Check className='h-4 w-4' /></SelectPrimitive.ItemIndicator></span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = 'SelectItem';
export { Select, SelectValue, SelectTrigger, SelectContent, SelectItem };
