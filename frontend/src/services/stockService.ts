import api from './api';
import { StockItem, StockItemCreate, StockItemUpdate, StockFilters, PaginatedResponse, StockAdjustment, StockMovement } from '@/types/stock.types';

export const stockService = {
  // Listar items de stock con paginación y filtros
  list: (filters?: StockFilters): Promise<PaginatedResponse<StockItem>> => {
    return api.get('/stock', { params: filters }).then(res => res.data);
  },

  // Obtener un item por ID
  getById: (id: string): Promise<StockItem> => {
    return api.get(`/stock/${id}`).then(res => res.data);
  },

  // Crear un nuevo item de stock
  create: (data: StockItemCreate): Promise<StockItem> => {
    return api.post('/stock', data).then(res => res.data);
  },

  // Actualizar un item de stock
  update: (id: string, data: StockItemUpdate): Promise<StockItem> => {
    return api.put(`/stock/${id}`, data).then(res => res.data);
  },

  // Eliminar un item de stock
  delete: (id: string): Promise<void> => {
    return api.delete(`/stock/${id}`).then(res => res.data);
  },

  // Ajustar stock (entrada/salida/ajuste)
  adjust: (data: StockAdjustment): Promise<StockItem> => {
    return api.post('/stock/adjust', data).then(res => res.data);
  },

  // Obtener items con stock bajo
  getLowStock: (limit?: number): Promise<StockItem[]> => {
    return api.get('/stock/low', { params: { limit } }).then(res => res.data);
  },

  // Obtener movimientos de stock
  getMovements: (item_id?: string, filters?: { page?: number; limit?: number }): Promise<PaginatedResponse<StockMovement>> => {
    return api.get('/stock/movements', { params: { item_id, ...filters } }).then(res => res.data);
  },

  // Activar item
  activate: (id: string): Promise<StockItem> => {
    return api.patch(`/stock/${id}/activate`).then(res => res.data);
  },

  // Desactivar item
  deactivate: (id: string): Promise<StockItem> => {
    return api.patch(`/stock/${id}/deactivate`).then(res => res.data);
  },

  // Obtener categorías
  getCategories: (): Promise<string[]> => {
    return api.get('/stock/categories').then(res => res.data);
  }
};
