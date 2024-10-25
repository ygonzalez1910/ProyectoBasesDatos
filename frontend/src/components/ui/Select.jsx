// src/components/ui/Select.jsx
import React, { useState } from 'react';

export const Select = ({ children }) => <div className="relative">{children}</div>;

export const SelectTrigger = ({ children, onClick }) => (
  <div onClick={onClick} className="border p-2 rounded cursor-pointer">
    {children}
  </div>
);

export const SelectContent = ({ children, isOpen }) => (
  isOpen ? (
    <div className="absolute mt-2 border bg-white rounded shadow-lg">
      {children}
    </div>
  ) : null
);

export const SelectItem = ({ children, onClick }) => (
  <div onClick={onClick} className="p-2 hover:bg-gray-100 cursor-pointer">
    {children}
  </div>
);

export const SelectValue = ({ placeholder }) => (
  <span className="text-gray-700">{placeholder}</span>
);

