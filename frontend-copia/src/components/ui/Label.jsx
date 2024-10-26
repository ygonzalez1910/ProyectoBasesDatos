// components/ui/Label.jsx
import React from 'react';
import { cn } from '../../lib/utils';

export const Label = ({ children, htmlFor, className, ...props }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('block text-sm font-medium text-gray-700', className)}
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;
