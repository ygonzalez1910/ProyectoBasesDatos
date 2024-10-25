// src/components/ui/Dialog.jsx
import React, { useState } from 'react';

export const Dialog = ({ children }) => <>{children}</>;

export const DialogTrigger = ({ children, onClick }) => (
  <div onClick={onClick} className="cursor-pointer">
    {children}
  </div>
);

export const DialogContent = ({ children, isOpen, onClose }) => (
  isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  ) : null
);

export const DialogHeader = ({ children }) => (
  <div className="border-b pb-2 mb-4">{children}</div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);

export const DialogDescription = ({ children }) => (
  <p className="text-sm text-gray-500">{children}</p>
);
