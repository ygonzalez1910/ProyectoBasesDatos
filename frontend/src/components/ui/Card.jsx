// src/components/ui/Card.jsx
import React from 'react';

export const Card = ({ children, className }) => (
  <div className={`border rounded-lg p-4 shadow ${className}`}>{children}</div>
);

export const CardHeader = ({ children }) => (
  <div className="border-b pb-2 mb-4">{children}</div>
);

export const CardTitle = ({ children, className }) => (
  <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
);

export const CardDescription = ({ children, className }) => (
  <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
);

export const CardContent = ({ children }) => (
  <div className="space-y-4">{children}</div>
);
