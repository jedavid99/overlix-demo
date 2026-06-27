// Tipos para el módulo de Clientes

export interface Client {
  id: string;
  nombre_completo: string;
  email?: string;
  telefono: string;
  dni?: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  estado: 'activo' | 'inactivo';
  deuda_actual?: number;
  notas?: string;
  fecha_registro: string;
  fecha_actualizacion?: string;
}

export interface ClientCreate {
  nombre_completo: string;
  email?: string;
  telefono: string;
  dni?: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  notas?: string;
}

export interface ClientUpdate extends Partial<ClientCreate> {
  estado?: 'activo' | 'inactivo';
}

export interface ClientFilters {
  page?: number;
  limit?: number;
  search?: string;
  estado?: 'activo' | 'inactivo';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ClientPurchase {
  id: string;
  fecha: string;
  monto: number;
  estado: string;
  descripcion?: string;
}
