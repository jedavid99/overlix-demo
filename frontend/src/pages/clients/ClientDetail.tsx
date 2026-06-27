import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClient, useClientPurchases } from '@/hooks/useClients';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Edit, Phone, Mail, MapPin, FileText, DollarSign } from 'lucide-react';

export const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: client, loading, error } = useClient(id || '');
  const { data: purchases, loading: loadingPurchases } = useClientPurchases(id || '');

  if (loading) return <div className="flex items-center justify-center h-64">Cargando cliente...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!client) return <div className="text-muted-foreground p-4">Cliente no encontrado</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/clients')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{client.nombre_completo}</h1>
            <p className="text-muted-foreground">Detalle del cliente</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/clients/${id}/edit`)}>
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Button>
      </div>

      {/* Información principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Información de Contacto</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <span>{client.telefono}</span>
            </div>
            {client.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span>{client.email}</span>
              </div>
            )}
            {client.dni && (
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span>DNI: {client.dni}</span>
              </div>
            )}
          </div>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Dirección</h2>
          <div className="space-y-3">
            {client.direccion && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <span>{client.direccion}</span>
              </div>
            )}
            {(client.ciudad || client.provincia) && (
              <div className="text-muted-foreground">
                {client.ciudad && client.ciudad}
                {client.ciudad && client.provincia && ', '}
                {client.provincia && client.provincia}
              </div>
            )}
          </div>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Estado y Deuda</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Estado:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  client.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {client.estado === 'activo' ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Deuda actual:</span>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className={client.deuda_actual && client.deuda_actual > 0 ? 'text-red-500 font-medium' : ''}>
                  ${client.deuda_actual?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {client.notas && (
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">Notas</h2>
            <p className="text-muted-foreground">{client.notas}</p>
          </div>
        )}
      </div>

      {/* Historial de compras */}
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Historial de Compras</h2>
        {loadingPurchases ? (
          <div>Cargando compras...</div>
        ) : purchases && purchases.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium">Fecha</th>
                <th className="px-4 py-3 text-left font-medium">Descripción</th>
                <th className="px-4 py-3 text-left font-medium">Estado</th>
                <th className="px-4 py-3 text-right font-medium">Monto</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="border-b">
                  <td className="px-4 py-3">{new Date(purchase.fecha).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{purchase.descripcion || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {purchase.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">${purchase.monto.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted-foreground">No hay compras registradas</p>
        )}
      </div>
    </div>
  );
};

export default ClientDetail;
