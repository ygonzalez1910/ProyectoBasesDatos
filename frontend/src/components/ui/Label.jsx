// src/components/ui/Label.jsx
import React from 'react';

export const Label = ({ htmlFor, children, className }) => (
  <label htmlFor={htmlFor} className={`text-gray-700 font-semibold ${className}`}>
    {children}
  </label>
);
