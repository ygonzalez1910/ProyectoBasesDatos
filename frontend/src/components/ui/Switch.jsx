// components/ui/Switch.jsx
import React from 'react';
import { cn } from '../../lib/utils';

export const Switch = ({ checked, onChange, className, ...props }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={cn('sr-only peer', className)}
        {...props}
      />
      <div
        className={cn(
          'w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:bg-white after:content-[""] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all',
          className
        )}
      ></div>
    </label>
  );
};

export default Switch;
