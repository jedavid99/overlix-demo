// Interfaces
export interface Repair {
  id: string;
  numero_reparacion?: string;
  cliente_nombre?: string;
  dni?: string;
  dispositivo?: string;
  marca?: string;
  modelo?: string;
  categoria_dispositivo?: string;
  problema_reportado?: string;
  diagnosis?: string;
  estado: string;
  prioridad: string;
  total_reparacion?: number;
  fecha_ingreso?: string;
  tecnico_asignado_id?: string;
}

export interface StatusStyle {
  bg: string;
  text: string;
  border: string;
  label: string;
}

export interface PriorityStyle {
  bg: string;
  text: string;
  border: string;
  label: string;
}

// Constantes
export const PAGE_SIZE = 10;
export const STATUS_FILTERS = ['all', 'pending', 'diagnostic', 'in_progress', 'waiting_parts', 'ready', 'delivered'] as const;

// Funciones auxiliares
export const getStatusBadge = (status: string): StatusStyle => {
  const statusMap: Record<string, StatusStyle> = {
    pending: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-300',
      border: 'border-yellow-300 dark:border-yellow-700',
      label: 'Pendiente',
    },
    diagnostic: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-300',
      border: 'border-blue-300 dark:border-blue-700',
      label: 'Diagnóstico',
    },
    in_progress: {
      bg: 'bg-indigo-100 dark:bg-indigo-900/30',
      text: 'text-indigo-800 dark:text-indigo-300',
      border: 'border-indigo-300 dark:border-indigo-700',
      label: 'En Progreso',
    },
    waiting_parts: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-800 dark:text-orange-300',
      border: 'border-orange-300 dark:border-orange-700',
      label: 'Esperando Repuestos',
    },
    ready: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-800 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-700',
      label: 'Listo',
    },
    delivered: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-300',
      border: 'border-green-300 dark:border-green-700',
      label: 'Entregado',
    },
    cancelled: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-300',
      border: 'border-red-300 dark:border-red-700',
      label: 'Cancelado',
    },
  };

  return statusMap[status] || {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-800 dark:text-gray-300',
    border: 'border-gray-300 dark:border-gray-600',
    label: status || 'Desconocido',
  };
};

export const getPriorityBadge = (priority: string): PriorityStyle => {
  const priorityMap: Record<string, PriorityStyle> = {
    low: {
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-600 dark:text-slate-300',
      border: 'border-slate-300 dark:border-slate-600',
      label: 'Baja',
    },
    medium: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-300 dark:border-blue-700',
      label: 'Media',
    },
    high: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-300 dark:border-orange-700',
      label: 'Alta',
    },
    critical: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-300 dark:border-red-700',
      label: 'Crítica',
    },
  };

  return priorityMap[priority] || {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-300',
    border: 'border-gray-300 dark:border-gray-600',
    label: priority || '—',
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
};
