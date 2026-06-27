import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients, useClientMutations } from '@/hooks/useClients';
import { ClientFilters } from '@/types/client.types';
import { Button } from '@/shared/components/ui/button';
import { Search, Plus, Edit, Trash2, Eye, User } from 'lucide-react';

export const ClientsList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ClientFilters>({ page: 1, limit: 20 });
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, error, refetch } = useClients(filters);
  const { deleteClient, activateClient, deactivateClient } = useClientMutations();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
      const success = await deleteClient(id);
      if (success) {
        refetch();
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    if (currentStatus === 'activo') {
      await deactivateClient(id);
    } else {
      await activateClient(id);
    }
    refetch();
  };

  if (loading && !data) return <div className="flex items-center justify-center h-64">Cargando clientes...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Gestión de clientes</p>
        </div>
        <Button onClick={() => navigate('/clients/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex gap-4 items-center">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre, email, teléfono..."
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
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      {/* Tabla de clientes */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Cliente</th>
              <th className="px-4 py-3 text-left font-medium">Contacto</th>
              <th className="px-4 py-3 text-left font-medium">Estado</th>
              <th className="px-4 py-3 text-left font-medium">Deuda</th>
              <th className="px-4 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((client) => (
              <tr key={client.id} className="border-t hover:bg-muted/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                      {client.nombre_completo.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{client.nombre_completo}</div>
                      <div className="text-sm text-muted-foreground">{client.dni || 'Sin DNI'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">{client.email || '-'}</div>
                  <div className="text-sm text-muted-foreground">{client.telefono}</div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {client.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={client.deuda_actual && client.deuda_actual > 0 ? 'text-red-500 font-medium' : ''}>
                    ${client.deuda_actual?.toFixed(2) || '0.00'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => navigate(`/clients/${client.id}`)}
                      title="Ver detalle"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => navigate(`/clients/${client.id}/edit`)}
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleToggleStatus(client.id, client.estado)}
                      title={client.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    >
                      <User className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(client.id, client.nombre_completo)}
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
            Mostrando {data.data.length} de {data.total} clientes
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

export default ClientsList;
