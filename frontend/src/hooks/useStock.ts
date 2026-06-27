import { useState, useEffect, useCallback } from 'react';
import { stockService } from '@/services/stockService';
import { StockItem, StockItemCreate, StockItemUpdate, StockFilters, PaginatedResponse, StockAdjustment, StockMovement } from '@/types/stock.types';

export const useStock = (filters?: StockFilters) => {
  const [data, setData] = useState<PaginatedResponse<StockItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await stockService.list(filters);
      setData(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar stock');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export const useStockItem = (id: string) => {
  const [data, setData] = useState<StockItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await stockService.getById(id);
      setData(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar item de stock');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export const useStockMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStockItem = async (data: StockItemCreate): Promise<StockItem | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await stockService.create(data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al crear item de stock');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateStockItem = async (id: string, data: StockItemUpdate): Promise<StockItem | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await stockService.update(id, data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar item de stock');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteStockItem = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await stockService.delete(id);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al eliminar item de stock');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const adjustStock = async (data: StockAdjustment): Promise<StockItem | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await stockService.adjust(data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al ajustar stock');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const activateStockItem = async (id: string): Promise<StockItem | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await stockService.activate(id);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al activar item de stock');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deactivateStockItem = async (id: string): Promise<StockItem | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await stockService.deactivate(id);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al desactivar item de stock');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { 
    loading, 
    error, 
    createStockItem, 
    updateStockItem, 
    deleteStockItem, 
    adjustStock, 
    activateStockItem, 
    deactivateStockItem 
  };
};

export const useLowStock = (limit?: number) => {
  const [data, setData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await stockService.getLowStock(limit);
      setData(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar stock bajo');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export const useStockMovements = (itemId?: string, filters?: { page?: number; limit?: number }) => {
  const [data, setData] = useState<PaginatedResponse<StockMovement> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await stockService.getMovements(itemId, filters);
      setData(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar movimientos de stock');
    } finally {
      setLoading(false);
    }
  }, [itemId, filters]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export const useStockCategories = () => {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await stockService.getCategories();
      setData(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};
