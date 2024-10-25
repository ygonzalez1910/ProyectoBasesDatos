// src/components/ui/Button.jsx
import React from 'react';

export const Button = ({ children, className, variant = 'primary', ...props }) => {
  const baseStyles = "px-4 py-2 rounded focus:outline-none focus:ring";
  const variants = {
    primary: `${baseStyles} bg-blue-500 text-white hover:bg-blue-600`,
    outline: `${baseStyles} border border-gray-300 text-gray-700 hover:bg-gray-100`,
    ghost: `${baseStyles} text-gray-700 hover:bg-gray-100`,
  };

  return (
    <button className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
