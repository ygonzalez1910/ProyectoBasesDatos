import React, { useState } from 'react';
import { cn } from '../../lib/utils'; // asegúrate de que la función cn está importada correctamente.

// SelectTrigger: Botón que dispara la apertura del selector
export const SelectTrigger = ({ isOpen, onClick, value, placeholder }) => (
  <button
    className={cn(
      'w-full px-4 py-2 text-left bg-gray-100 border border-gray-300 rounded-lg',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
    )}
    onClick={onClick}
  >
    {value || placeholder}
  </button>
);

// SelectValue: Muestra el valor actual seleccionado
export const SelectValue = ({ value, placeholder }) => (
  <span>{value || placeholder}</span>
);

// SelectContent: Lista desplegable con las opciones
export const SelectContent = ({ children, isOpen }) => (
  isOpen ? (
    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
      {children}
    </ul>
  ) : null
);

// Select: Componente principal que maneja la lógica del selector
export const Select = ({ value, onValueChange, children, placeholder = 'Selecciona una opción' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedValue) => {
    onValueChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <SelectTrigger
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        value={value}
        placeholder={placeholder}
      />
      <SelectContent isOpen={isOpen}>
        {React.Children.map(children, (child) => React.cloneElement(child, { handleSelect }))}
      </SelectContent>
    </div>
  );
};

// SelectItem: Opción individual dentro del selector
export const SelectItem = ({ value, children, handleSelect }) => (
  <li
    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
    onClick={() => handleSelect(value)}
  >
    {children}
  </li>
);
