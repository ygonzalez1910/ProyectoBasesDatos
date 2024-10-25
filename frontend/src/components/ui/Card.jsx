// components/ui/Card.jsx
import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ children, className, ...props }) => (
  <div className={cn('bg-white shadow-md rounded-lg p-4', className)} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className }) => (
  <div className={cn('mb-4', className)}>{children}</div>
);

export const CardTitle = ({ children, className }) => (
  <h3 className={cn('text-lg font-semibold', className)}>{children}</h3>
);

export const CardContent = ({ children, className }) => (
  <div className={cn('space-y-4', className)}>{children}</div>
);

export const CardDescription = ({ children, className }) => (
  <p className={cn('text-gray-500', className)}>{children}</p>
);
