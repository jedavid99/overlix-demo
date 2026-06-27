import React from 'react';
import { Smartphone, Laptop, Gamepad2 } from 'lucide-react';

export const getDeviceIcon = (categoria: string) => {
  switch (categoria) {
    case 'telefono': return <Smartphone className="h-5 w-5" />;
    case 'laptop':
    case 'pc': return <Laptop className="h-5 w-5" />;
    case 'consola': return <Gamepad2 className="h-5 w-5" />;
    default: return <Smartphone className="h-5 w-5" />;
  }
};
