import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStockItem, useStockMutations } from '@/hooks/useStock';
import { StockAdjustment } from '@/types/stock.types';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Save, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

export const StockAdjust = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: item, loading: loadingItem } = useStockItem(id || '');
  const { adjustStock, loading, error } = useStockMutations();

  const [formData, setFormData] = useState<StockAdjustment>({
    item_id: id || '',
    cantidad: 0,
    tipo: 'ajuste',
    motivo: '',
    referencia_id: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await adjustStock(formData);
    if (result) {
      navigate(`/stock/${id}`);
    }
  };

  if (loadingItem) return <div className="flex items-center justify-center h-64">Cargando item de stock...</div>;
  if (!item) return <div className="text-muted-foreground p-4">Item no encontrado</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(`/stock/${id}`)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Ajustar Stock</h1>
          <p className="text-muted-foreground">
            {item.nombre} - Stock actual: {item.stock_actual}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tarjeta de entrada */}
        <button
          type="button"
          onClick={() => setFormData({ ...formData, tipo: 'entrada' })}
          className={`border rounded-lg p-6 text-left transition-colors ${
            formData.tipo === 'entrada' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold">Entrada</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Agregar stock al inventario (compra, devolución, etc.)
          </p>
        </button>

        {/* Tarjeta de salida */}
        <button
          type="button"
          onClick={() => setFormData({ ...formData, tipo: 'salida' })}
          className={`border rounded-lg p-6 text-left transition-colors ${
            formData.tipo === 'salida' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-6 h-6 text-red-600" />
            <h3 className="font-semibold">Salida</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Restar stock del inventario (venta, uso, etc.)
          </p>
        </button>

        {/* Tarjeta de ajuste */}
        <button
          type="button"
          onClick={() => setFormData({ ...formData, tipo: 'ajuste' })}
          className={`border rounded-lg p-6 text-left transition-colors ${
            formData.tipo === 'ajuste' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <RefreshCw className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold">Ajuste</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Corrección manual de stock (merma, error, etc.)
          </p>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div className="space-y-2">
          <label className="text-sm font-medium">Cantidad *</label>
          <input
            type="number"
            value={formData.cantidad}
            onChange={(e) => setFormData({ ...formData, cantidad: parseFloat(e.target.value) || 0 })}
            required
            min="1"
            className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground">
            Nuevo stock será: {formData.tipo === 'salida' ? item.stock_actual - formData.cantidad : item.stock_actual + formData.cantidad}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Motivo *</label>
          <textarea
            value={formData.motivo}
            onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
            required
            rows={3}
            placeholder="Describe el motivo del ajuste..."
            className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Referencia (opcional)</label>
          <input
            type="text"
            value={formData.referencia_id}
            onChange={(e) => setFormData({ ...formData, referencia_id: e.target.value })}
            placeholder="ID de factura, reparación, etc."
            className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(`/stock/${id}`)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Procesando...' : 'Confirmar Ajuste'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StockAdjust;
