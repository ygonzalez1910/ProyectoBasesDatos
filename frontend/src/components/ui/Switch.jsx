// src/components/ui/Switch.jsx
import React, { useState } from 'react';

export const Switch = ({ checked = false, onChange, className }) => {
  const [isOn, setIsOn] = useState(checked);

  const toggleSwitch = () => {
    setIsOn(!isOn);
    if (onChange) onChange(!isOn);
  };

  return (
    <div
      onClick={toggleSwitch}
      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${isOn ? 'bg-blue-500' : 'bg-gray-300'} ${className}`}
    >
      <div
        className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${isOn ? 'translate-x-6' : 'translate-x-0'}`}
      />
    </div>
  );
};
