import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStockItem, useStockMutations, useStockCategories } from '@/hooks/useStock';
import { StockItemCreate, StockItemUpdate } from '@/types/stock.types';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';

export const StockForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { data: item, loading: loadingItem } = useStockItem(id || '');
  const { data: categories } = useStockCategories();
  const { createStockItem, updateStockItem, loading, error } = useStockMutations();

  const [formData, setFormData] = useState<StockItemCreate>({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    marca: '',
    modelo: '',
    stock_actual: 0,
    stock_minimo: 5,
    stock_maximo: 100,
    costo_unitario: 0,
    precio_venta: 0,
    proveedor_id: '',
    ubicacion_almacen: '',
    notas: ''
  });

  useEffect(() => {
    if (item && isEdit) {
      setFormData({
        codigo: item.codigo,
        nombre: item.nombre,
        descripcion: item.descripcion || '',
        categoria: item.categoria,
        marca: item.marca || '',
        modelo: item.modelo || '',
        stock_actual: item.stock_actual,
        stock_minimo: item.stock_minimo,
        stock_maximo: item.stock_maximo || 100,
        costo_unitario: item.costo_unitario,
        precio_venta: item.precio_venta,
        proveedor_id: item.proveedor_id || '',
        ubicacion_almacen: item.ubicacion_almacen || '',
        notas: item.notas || ''
      });
    }
  }, [item, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: ['stock_actual', 'stock_minimo', 'stock_maximo', 'costo_unitario', 'precio_venta'].includes(name) 
        ? parseFloat(value) || 0 
        : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && id) {
      const result = await updateStockItem(id, formData as StockItemUpdate);
      if (result) {
        navigate(`/stock/${id}`);
      }
    } else {
      const result = await createStockItem(formData);
      if (result) {
        navigate('/stock');
      }
    }
  };

  if (loadingItem && isEdit) return <div>Cargando item de stock...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/stock')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEdit ? 'Editar Item de Stock' : 'Nuevo Item de Stock'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Actualiza la información del item' : 'Registra un nuevo item en el inventario'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Código *</label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categoría *</label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Seleccionar categoría</option>
              {categories?.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="pantallas">Pantallas</option>
              <option value="baterias">Baterías</option>
              <option value="cargadores">Cargadores</option>
              <option value="componentes">Componentes</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Marca</label>
            <input
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Modelo</label>
            <input
              type="text"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">ID del Proveedor</label>
            <input
              type="text"
              name="proveedor_id"
              value={formData.proveedor_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ubicación en Almacén</label>
            <input
              type="text"
              name="ubicacion_almacen"
              value={formData.ubicacion_almacen}
              onChange={handleChange}
              placeholder="Ej: Estantería A-1"
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Stock Actual *</label>
            <input
              type="number"
              name="stock_actual"
              value={formData.stock_actual}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Stock Mínimo *</label>
            <input
              type="number"
              name="stock_minimo"
              value={formData.stock_minimo}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Stock Máximo</label>
            <input
              type="number"
              name="stock_maximo"
              value={formData.stock_maximo}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Costo Unitario *</label>
            <input
              type="number"
              name="costo_unitario"
              value={formData.costo_unitario}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Precio Venta *</label>
            <input
              type="number"
              name="precio_venta"
              value={formData.precio_venta}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Notas</label>
            <textarea
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/stock')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StockForm;
