// src/components/ui/Tabs.jsx
import React, { useState } from 'react';

export const Tabs = ({ children, defaultValue }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return React.Children.map(children, child => 
    React.cloneElement(child, { activeTab, setActiveTab })
  );
};

export const TabsList = ({ children }) => (
  <div className="flex border-b mb-4">
    {children}
  </div>
);

export const TabsTrigger = ({ children, value, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(value)}
    className={`px-4 py-2 ${
      activeTab === value ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-700'
    }`}
  >
    {children}
  </button>
);

export const TabsContent = ({ children, value, activeTab }) => (
  activeTab === value ? <div>{children}</div> : null
);
