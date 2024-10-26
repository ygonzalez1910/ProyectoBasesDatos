// Importar Radix y Tailwind
import * as DialogPrimitive from "@radix-ui/react-dialog";

// Componente principal Dialog
export function Dialog({ children, ...props }) {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}

// Trigger del Dialog
export function DialogTrigger({ children, ...props }) {
  return <DialogPrimitive.Trigger asChild {...props}>{children}</DialogPrimitive.Trigger>;
}

// Contenido del Dialog
export function DialogContent({ children, ...props }) {
  return (
    <DialogPrimitive.Content
      {...props}
      className="bg-white p-6 rounded-md shadow-lg max-w-md mx-auto"
    >
      {children}
    </DialogPrimitive.Content>
  );
}

// Header del Dialog
export function DialogHeader({ children, ...props }) {
  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      {children}
    </div>
  );
}

// Título del Dialog
export function DialogTitle({ children, ...props }) {
  return (
    <DialogPrimitive.Title
      {...props}
      className="text-lg font-semibold text-gray-800"
    >
      {children}
    </DialogPrimitive.Title>
  );
}

// Descripción del Dialog
export function DialogDescription({ children, ...props }) {
  return (
    <DialogPrimitive.Description
      {...props}
      className="text-sm text-gray-600 mt-2"
    >
      {children}
    </DialogPrimitive.Description>
  );
}
