import * as TabsPrimitive from '@radix-ui/react-tabs';
import { clsx } from 'clsx';

export function Tabs({ children, className, ...props }) {
  return (
    <TabsPrimitive.Root className={clsx("flex flex-col", className)} {...props}>
      {children}
    </TabsPrimitive.Root>
  );
}

export function TabsList({ children, className, ...props }) {
  return (
    <TabsPrimitive.List className={clsx("flex border-b", className)} {...props}>
      {children}
    </TabsPrimitive.List>
  );
}

export function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      className={clsx(
        "px-4 py-2 text-sm font-medium text-center text-gray-700 border-b-2 border-transparent",
        "focus-visible:ring focus-visible:ring-opacity-75",
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content className={clsx("mt-2", className)} {...props} />
  );
}
