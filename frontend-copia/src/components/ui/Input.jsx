// components/ui/Input.jsx
import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
