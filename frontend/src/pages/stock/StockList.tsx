import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStock, useStockMutations, useLowStock } from '@/hooks/useStock';
import { StockFilters } from '@/types/stock.types';
import { Button } from '@/shared/components/ui/button';
import { Search, Plus, Edit, Trash2, Eye, AlertTriangle, Package } from 'lucide-react';

export const StockList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<StockFilters>({ page: 1, limit: 20 });
  const [searchTerm, setSearchTerm] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const { data, loading, error, refetch } = useStock(showLowStockOnly ? { ...filters, stock_bajo: true } : filters);
  const { data: lowStockItems } = useLowStock(10);
  const { deleteStockItem, activateStockItem, deactivateStockItem } = useStockMutations();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (confirm(`¿Estás seguro de eliminar ${nombre}?`)) {
      const success = await deleteStockItem(id);
      if (success) {
        refetch();
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    if (currentStatus === 'activo') {
      await deactivateStockItem(id);
    } else {
      await activateStockItem(id);
    }
    refetch();
  };

  if (loading && !data) return <div className="flex items-center justify-center h-64">Cargando stock...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stock de Repuestos</h1>
          <p className="text-muted-foreground">Gestión de inventario</p>
        </div>
        <Button onClick={() => navigate('/stock/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Item
        </Button>
      </div>

      {/* Alerta de stock bajo */}
      {lowStockItems && lowStockItems.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <div>
              <h3 className="font-medium text-orange-800">Alerta de Stock Bajo</h3>
              <p className="text-sm text-orange-700">
                {lowStockItems.length} items tienen stock por debajo del mínimo
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div className="flex gap-4 items-center flex-wrap">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por código, nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button type="submit">Buscar</Button>
        </form>
        <select
          value={filters.categoria || ''}
          onChange={(e) => setFilters({ ...filters, categoria: e.target.value, page: 1 })}
          className="px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todas las categorías</option>
          <option value="pantallas">Pantallas</option>
          <option value="baterias">Baterías</option>
          <option value="cargadores">Cargadores</option>
          <option value="componentes">Componentes</option>
          <option value="accesorios">Accesorios</option>
        </select>
        <select
          value={filters.estado || ''}
          onChange={(e) => setFilters({ ...filters, estado: e.target.value as any, page: 1 })}
          className="px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showLowStockOnly}
            onChange={(e) => setShowLowStockOnly(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Solo stock bajo</span>
        </label>
      </div>

      {/* Tabla de stock */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Item</th>
              <th className="px-4 py-3 text-left font-medium">Categoría</th>
              <th className="px-4 py-3 text-left font-medium">Stock</th>
              <th className="px-4 py-3 text-left font-medium">Costo</th>
              <th className="px-4 py-3 text-left font-medium">Precio Venta</th>
              <th className="px-4 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((item) => (
              <tr key={item.id} className="border-t hover:bg-muted/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{item.nombre}</div>
                      <div className="text-sm text-muted-foreground">{item.codigo}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.categoria}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.stock_actual}</span>
                    {item.stock_actual <= item.stock_minimo && (
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">Mín: {item.stock_minimo}</div>
                </td>
                <td className="px-4 py-3 text-sm">${item.costo_unitario.toFixed(2)}</td>
                <td className="px-4 py-3 font-medium">${item.precio_venta.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => navigate(`/stock/${item.id}`)}
                      title="Ver detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => navigate(`/stock/${item.id}/edit`)}
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => navigate(`/stock/${item.id}/adjust`)}
                      title="Ajustar stock"
                    >
                      <Package className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleToggleStatus(item.id, item.estado)}
                      title={item.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    >
                      <Package className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(item.id, item.nombre)}
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {data.data.length} de {data.total} items
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filters.page! - 1)}
              disabled={filters.page === 1}
            >
              Anterior
            </Button>
            <span className="px-4 py-2 text-sm">
              Página {filters.page} de {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(filters.page! + 1)}
              disabled={filters.page === data.totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockList;
