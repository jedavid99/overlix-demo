import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStockItem, useStockMovements } from '@/hooks/useStock';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Edit, Package, TrendingUp, MapPin, DollarSign, Calendar } from 'lucide-react';

export const StockDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: item, loading, error } = useStockItem(id || '');
  const { data: movements, loading: loadingMovements } = useStockMovements(id, { limit: 10 });

  if (loading) return <div className="flex items-center justify-center h-64">Cargando item de stock...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!item) return <div className="text-muted-foreground p-4">Item no encontrado</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/stock')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{item.nombre}</h1>
            <p className="text-muted-foreground">Detalle del item de stock</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate(`/stock/${id}/adjust`)}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Ajustar Stock
          </Button>
          <Button onClick={() => navigate(`/stock/${id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      {/* Información principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Información General</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Código:</span>
              <span className="font-medium">{item.codigo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Categoría:</span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {item.categoria}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Marca:</span>
              <span className="font-medium">{item.marca || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Modelo:</span>
              <span className="font-medium">{item.modelo || '-'}</span>
            </div>
            {item.descripcion && (
              <div className="pt-2 border-t">
                <span className="text-muted-foreground text-sm">Descripción:</span>
                <p className="text-sm mt-1">{item.descripcion}</p>
              </div>
            )}
          </div>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Estado del Stock</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Stock Actual:</span>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                <span className="text-2xl font-bold">{item.stock_actual}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stock Mínimo:</span>
              <span>{item.stock_minimo}</span>
            </div>
            {item.stock_maximo && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stock Máximo:</span>
                <span>{item.stock_maximo}</span>
              </div>
            )}
            <div className="pt-2 border-t">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.stock_actual <= item.stock_minimo ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {item.stock_actual <= item.stock_minimo ? 'STOCK BAJO' : 'STOCK OK'}
              </span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Precios</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Costo Unitario:</span>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">${item.costo_unitario.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Precio Venta:</span>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="font-bold text-lg">${item.precio_venta.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-muted-foreground">Margen:</span>
              <span className="font-medium">
                {(((item.precio_venta - item.costo_unitario) / item.precio_venta) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Ubicación y Proveedor</h2>
          <div className="space-y-3">
            {item.ubicacion_almacen && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <span>{item.ubicacion_almacen}</span>
              </div>
            )}
            {item.proveedor_nombre && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Proveedor:</span>
                <span className="font-medium">{item.proveedor_nombre}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {item.estado === 'activo' ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6 space-y-4 md:col-span-2">
          <h2 className="text-lg font-semibold">Fechas</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <span className="text-sm text-muted-foreground">Fecha de Ingreso:</span>
                <div className="font-medium">{new Date(item.fecha_ingreso).toLocaleDateString()}</div>
              </div>
            </div>
            {item.ultima_compra && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <span className="text-sm text-muted-foreground">Última Compra:</span>
                  <div className="font-medium">{new Date(item.ultima_compra).toLocaleDateString()}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {item.notas && (
          <div className="border rounded-lg p-6 space-y-4 md:col-span-2">
            <h2 className="text-lg font-semibold">Notas</h2>
            <p className="text-muted-foreground">{item.notas}</p>
          </div>
        )}
      </div>

      {/* Movimientos de stock */}
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Últimos Movimientos</h2>
        {loadingMovements ? (
          <div>Cargando movimientos...</div>
        ) : movements && movements.data.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium">Fecha</th>
                <th className="px-4 py-3 text-left font-medium">Tipo</th>
                <th className="px-4 py-3 text-left font-medium">Cantidad</th>
                <th className="px-4 py-3 text-left font-medium">Motivo</th>
              </tr>
            </thead>
            <tbody>
              {movements.data.map((movement) => (
                <tr key={movement.id} className="border-b">
                  <td className="px-4 py-3">{new Date(movement.fecha).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      movement.tipo === 'entrada' ? 'bg-green-100 text-green-800' : 
                      movement.tipo === 'salida' ? 'bg-red-100 text-red-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {movement.tipo.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{movement.cantidad}</td>
                  <td className="px-4 py-3">{movement.motivo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted-foreground">No hay movimientos registrados</p>
        )}
      </div>
    </div>
  );
};

export default StockDetail;
