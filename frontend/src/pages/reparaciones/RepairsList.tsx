import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepairs, useRepairMutations } from '@/hooks/useRepairs';
import { RepairFilters } from '@/types/repair.types';
import { Button } from '@/shared/components/ui/button';
import { Search, Plus, Edit, Trash2, Eye, Wrench } from 'lucide-react';

const statusColors: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  en_progreso: 'bg-blue-100 text-blue-800',
  esperando_repuestos: 'bg-orange-100 text-orange-800',
  listo: 'bg-green-100 text-green-800',
  entregado: 'bg-gray-100 text-gray-800',
  cancelado: 'bg-red-100 text-red-800'
};

const priorityColors: Record<string, string> = {
  baja: 'bg-gray-100 text-gray-800',
  media: 'bg-blue-100 text-blue-800',
  alta: 'bg-orange-100 text-orange-800',
  urgente: 'bg-red-100 text-red-800'
};

export const RepairsList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<RepairFilters>({ page: 1, limit: 20 });
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, error, refetch } = useRepairs(filters);
  const { deleteRepair, updateStatus } = useRepairMutations();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleDelete = async (id: string, dispositivo: string) => {
    if (confirm(`¿Estás seguro de eliminar la reparación de ${dispositivo}?`)) {
      const success = await deleteRepair(id);
      if (success) {
        refetch();
      }
    }
  };

  const handleQuickStatus = async (id: string, newStatus: string) => {
    await updateStatus(id, { estado: newStatus as any });
    refetch();
  };

  if (loading && !data) return <div className="flex items-center justify-center h-64">Cargando reparaciones...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reparaciones</h1>
          <p className="text-muted-foreground">Gestión de reparaciones</p>
        </div>
        <Button onClick={() => navigate('/repairs/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Reparación
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex gap-4 items-center flex-wrap">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por dispositivo, cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button type="submit">Buscar</Button>
        </form>
        <select
          value={filters.estado || ''}
          onChange={(e) => setFilters({ ...filters, estado: e.target.value as any, page: 1 })}
          className="px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_progreso">En Progreso</option>
          <option value="esperando_repuestos">Esperando Repuestos</option>
          <option value="listo">Listo</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <select
          value={filters.prioridad || ''}
          onChange={(e) => setFilters({ ...filters, prioridad: e.target.value as any, page: 1 })}
          className="px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todas las prioridades</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
          <option value="urgente">Urgente</option>
        </select>
      </div>

      {/* Tabla de reparaciones */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Dispositivo</th>
              <th className="px-4 py-3 text-left font-medium">Cliente</th>
              <th className="px-4 py-3 text-left font-medium">Estado</th>
              <th className="px-4 py-3 text-left font-medium">Prioridad</th>
              <th className="px-4 py-3 text-left font-medium">Ingreso</th>
              <th className="px-4 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((repair) => (
              <tr key={repair.id} className="border-t hover:bg-muted/50">
                <td className="px-4 py-3">
                  <div className="font-medium">{repair.dispositivo}</div>
                  <div className="text-sm text-muted-foreground">
                    {repair.marca} {repair.modelo}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">{repair.cliente_nombre || '-'}</div>
                  <div className="text-xs text-muted-foreground">{repair.serial || 'Sin serial'}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[repair.estado]}`}>
                    {repair.estado.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[repair.prioridad]}`}>
                    {repair.prioridad.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {new Date(repair.fecha_ingreso).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => navigate(`/repairs/${repair.id}`)}
                      title="Ver detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => navigate(`/repairs/${repair.id}/edit`)}
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {repair.estado !== 'entregado' && repair.estado !== 'cancelado' && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleQuickStatus(repair.id, 'listo')}
                        title="Marcar como listo"
                      >
                        <Wrench className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(repair.id, repair.dispositivo)}
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
            Mostrando {data.data.length} de {data.total} reparaciones
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

export default RepairsList;
