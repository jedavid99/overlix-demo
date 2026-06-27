// Tipos para el módulo de Stock de Repuestos

export interface StockItem {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  marca?: string;
  modelo?: string;
  stock_actual: number;
  stock_minimo: number;
  stock_maximo?: number;
  costo_unitario: number;
  precio_venta: number;
  proveedor_id?: string;
  proveedor_nombre?: string;
  ubicacion_almacen?: string;
  estado: 'activo' | 'inactivo';
  fecha_ingreso: string;
  fecha_actualizacion?: string;
  ultima_compra?: string;
  notas?: string;
}

export interface StockItemCreate {
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  marca?: string;
  modelo?: string;
  stock_actual: number;
  stock_minimo: number;
  stock_maximo?: number;
  costo_unitario: number;
  precio_venta: number;
  proveedor_id?: string;
  ubicacion_almacen?: string;
  notas?: string;
}

export interface StockItemUpdate extends Partial<StockItemCreate> {
  estado?: 'activo' | 'inactivo';
}

export interface StockFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoria?: string;
  estado?: 'activo' | 'inactivo';
  stock_bajo?: boolean;
  proveedor_id?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StockAdjustment {
  item_id: string;
  cantidad: number;
  tipo: 'entrada' | 'salida' | 'ajuste';
  motivo: string;
  referencia_id?: string;
}

export interface StockMovement {
  id: string;
  item_id: string;
  item_nombre: string;
  cantidad: number;
  tipo: 'entrada' | 'salida' | 'ajuste';
  motivo: string;
  referencia_id?: string;
  usuario_id?: string;
  fecha: string;
}
