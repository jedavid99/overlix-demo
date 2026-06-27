import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRepair, useRepairMutations } from '@/hooks/useRepairs';
import { RepairCreate, RepairUpdate } from '@/types/repair.types';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';

export const RepairForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { data: repair, loading: loadingRepair } = useRepair(id || '');
  const { createRepair, updateRepair, loading, error } = useRepairMutations();

  const [formData, setFormData] = useState<RepairCreate>({
    cliente_id: '',
    dispositivo: '',
    marca: '',
    modelo: '',
    serial: '',
    falla_reportada: '',
    prioridad: 'media',
    tecnico_id: '',
    costo_estimado: undefined,
    abono: undefined,
    fecha_estimada_entrega: '',
    notas: ''
  });

  useEffect(() => {
    if (repair && isEdit) {
      setFormData({
        cliente_id: repair.cliente_id,
        dispositivo: repair.dispositivo,
        marca: repair.marca || '',
        modelo: repair.modelo || '',
        serial: repair.serial || '',
        falla_reportada: repair.falla_reportada,
        prioridad: repair.prioridad,
        tecnico_id: repair.tecnico_id || '',
        costo_estimado: repair.costo_estimado,
        abono: repair.abono,
        fecha_estimada_entrega: repair.fecha_estimada_entrega || '',
        notas: repair.notas || ''
      });
    }
  }, [repair, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'costo_estimado' || name === 'abono' ? (value ? parseFloat(value) : undefined) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && id) {
      const result = await updateRepair(id, formData as RepairUpdate);
      if (result) {
        navigate(`/repairs/${id}`);
      }
    } else {
      const result = await createRepair(formData);
      if (result) {
        navigate('/repairs');
      }
    }
  };

  if (loadingRepair && isEdit) return <div>Cargando reparación...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/repairs')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEdit ? 'Editar Reparación' : 'Nueva Reparación'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Actualiza la información de la reparación' : 'Registra una nueva reparación'}
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
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">ID del Cliente *</label>
            <input
              type="text"
              name="cliente_id"
              value={formData.cliente_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Dispositivo *</label>
            <input
              type="text"
              name="dispositivo"
              value={formData.dispositivo}
              onChange={handleChange}
              required
              placeholder="Ej: iPhone 13, MacBook Pro"
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Marca</label>
            <input
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              placeholder="Ej: Apple, Samsung"
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
              placeholder="Ej: Pro Max, Galaxy S21"
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Serial</label>
            <input
              type="text"
              name="serial"
              value={formData.serial}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Falla Reportada *</label>
            <textarea
              name="falla_reportada"
              value={formData.falla_reportada}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Prioridad</label>
            <select
              name="prioridad"
              value={formData.prioridad}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">ID del Técnico</label>
            <input
              type="text"
              name="tecnico_id"
              value={formData.tecnico_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Costo Estimado</label>
            <input
              type="number"
              name="costo_estimado"
              value={formData.costo_estimado || ''}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Abono</label>
            <input
              type="number"
              name="abono"
              value={formData.abono || ''}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha Estimada de Entrega</label>
            <input
              type="date"
              name="fecha_estimada_entrega"
              value={formData.fecha_estimada_entrega}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Notas</label>
            <textarea
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/repairs')}>
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

export default RepairForm;
