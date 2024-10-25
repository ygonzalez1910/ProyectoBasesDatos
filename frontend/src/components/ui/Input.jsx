// src/components/ui/Input.jsx
import React from 'react';

export const Input = ({ type = "text", placeholder = "", className, ...props }) => (
  <input
    type={type}
    placeholder={placeholder}
    className={`border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 ${className}`}
    {...props}
  />
);
