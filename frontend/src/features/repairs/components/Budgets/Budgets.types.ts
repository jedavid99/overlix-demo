// Interfaces
export interface Budget {
  id: string;
  clientName: string;
  clientPhone: string;
  device: string;
  deviceType: string;
  issue: string;
  total: number;
  status: 'Pendiente' | 'Aprobado' | 'Rechazado' | 'Completado';
  date: Date;
  technician: string;
}

export interface NewBudget {
  clientName: string;
  clientPhone: string;
  device: string;
  deviceType: string;
  issue: string;
  total: number;
  technician: string;
}

export interface BudgetErrors {
  clientName?: string;
  clientPhone?: string;
  device?: string;
  deviceType?: string;
  issue?: string;
  total?: string;
  technician?: string;
}

// Constantes
export const STATUS_COLORS = {
  Pendiente: '#f59e0b', // amber
  Aprobado: '#10b981', // green
  Rechazado: '#ef4444', // red
  Completado: '#3b82f6', // blue,
};

export const ITEMS_PER_PAGE = 10;

export const DEVICE_TYPES = ['Celular', 'Tablet', 'Portátil', 'Consola', 'Smartwatch', 'Otro'] as const;
export const TECHNICIANS = ['Carlos López', 'Ana Martínez', 'Pedro Sánchez', 'Laura Díaz'] as const;
export const STATUS_FILTERS = ['all', 'Pendiente', 'Aprobado', 'Rechazado', 'Completado'] as const;

// Funciones auxiliares
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
};

export const getStatusBadge = (status: Budget['status']) => {
  const variants = {
    Pendiente: 'warning',
    Aprobado: 'success',
    Rechazado: 'destructive',
    Completado: 'default',
  };
  return variants[status] as 'warning' | 'success' | 'destructive' | 'default';
};

// Estado inicial del formulario nuevo
export const initialNewBudget: NewBudget = {
  clientName: '',
  clientPhone: '',
  device: '',
  deviceType: '',
  issue: '',
  total: 0,
  technician: '',
};
