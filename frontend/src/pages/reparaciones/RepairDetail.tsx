import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRepair, useRepairMutations } from '@/hooks/useRepairs';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Edit, CheckCircle, Clock, AlertCircle, Package, User } from 'lucide-react';

const statusIcons: Record<string, React.ReactNode> = {
  pendiente: <Clock className="w-5 h-5" />,
  en_progreso: <Package className="w-5 h-5" />,
  esperando_repuestos: <AlertCircle className="w-5 h-5" />,
  listo: <CheckCircle className="w-5 h-5" />,
  entregado: <CheckCircle className="w-5 h-5" />,
  cancelado: <AlertCircle className="w-5 h-5" />
};

const statusColors: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  en_progreso: 'bg-blue-100 text-blue-800',
  esperando_repuestos: 'bg-orange-100 text-orange-800',
  listo: 'bg-green-100 text-green-800',
  entregado: 'bg-gray-100 text-gray-800',
  cancelado: 'bg-red-100 text-red-800'
};

export const RepairDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: repair, loading, error } = useRepair(id || '');
  const { updateStatus, completeRepair, loading: mutationLoading } = useRepairMutations();
  const [newStatus, setNewStatus] = useState('');

  if (loading) return <div className="flex items-center justify-center h-64">Cargando reparación...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!repair) return <div className="text-muted-foreground p-4">Reparación no encontrada</div>;

  const handleStatusChange = async () => {
    if (newStatus) {
      await updateStatus(id!, { estado: newStatus as any });
      setNewStatus('');
    }
  };

  const handleComplete = async () => {
    const costoFinal = prompt('Ingrese el costo final:', repair.costo_estimado?.toString() || '0');
    if (costoFinal) {
      await completeRepair(id!, { costo_final: parseFloat(costoFinal) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/repairs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{repair.dispositivo}</h1>
            <p className="text-muted-foreground">Detalle de la reparación</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate(`/repairs/${id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          {repair.estado === 'listo' && (
            <Button onClick={handleComplete} disabled={mutationLoading}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Completar
            </Button>
          )}
        </div>
      </div>

      {/* Información principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Información del Dispositivo</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Marca:</span>
              <span className="font-medium">{repair.marca || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Modelo:</span>
              <span className="font-medium">{repair.modelo || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Serial:</span>
              <span className="font-medium">{repair.serial || '-'}</span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Estado y Prioridad</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Estado:</span>
              <div className="flex items-center gap-2">
                {statusIcons[repair.estado]}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[repair.estado]}`}>
                  {repair.estado.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prioridad:</span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {repair.prioridad.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Falla Reportada</h2>
          <p className="text-muted-foreground">{repair.falla_reportada}</p>
        </div>

        {repair.diagnostico && (
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">Diagnóstico</h2>
            <p className="text-muted-foreground">{repair.diagnostico}</p>
          </div>
        )}

        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Costos</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Costo Estimado:</span>
              <span className="font-medium">${repair.costo_estimado?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Abono:</span>
              <span className="font-medium">${repair.abono?.toFixed(2) || '0.00'}</span>
            </div>
            {repair.costo_final && (
              <div className="flex justify-between font-bold">
                <span className="text-muted-foreground">Costo Final:</span>
                <span>${repair.costo_final.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Fechas</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha de Ingreso:</span>
              <span>{new Date(repair.fecha_ingreso).toLocaleDateString()}</span>
            </div>
            {repair.fecha_estimada_entrega && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha Estimada:</span>
                <span>{new Date(repair.fecha_estimada_entrega).toLocaleDateString()}</span>
              </div>
            )}
            {repair.fecha_entrega && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha de Entrega:</span>
                <span>{new Date(repair.fecha_entrega).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {repair.tecnico_nombre && (
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">Técnico Asignado</h2>
            <div className="flex items-center gap-3">
              < User className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{repair.tecnico_nombre}</span>
            </div>
          </div>
        )}

        {repair.notas && (
          <div className="border rounded-lg p-6 space-y-4 md:col-span-2">
            <h2 className="text-lg font-semibold">Notas</h2>
            <p className="text-muted-foreground">{repair.notas}</p>
          </div>
        )}
      </div>

      {/* Cambio rápido de estado */}
      {repair.estado !== 'entregado' && repair.estado !== 'cancelado' && (
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Cambiar Estado</h2>
          <div className="flex gap-4 items-center">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Seleccionar nuevo estado</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="esperando_repuestos">Esperando Repuestos</option>
              <option value="listo">Listo</option>
              <option value="cancelado">Cancelado</option>
            </select>
            <Button onClick={handleStatusChange} disabled={!newStatus || mutationLoading}>
              Cambiar Estado
            </Button>
          </div>
        </div>
      )}

      {/* Repuestos usados */}
      {repair.repuestos_usados && repair.repuestos_usados.length > 0 && (
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Repuestos Usados</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium">Repuesto</th>
                <th className="px-4 py-3 text-left font-medium">Cantidad</th>
                <th className="px-4 py-3 text-right font-medium">Costo Unitario</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {repair.repuestos_usados.map((part, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-3">{part.nombre}</td>
                  <td className="px-4 py-3">{part.cantidad}</td>
                  <td className="px-4 py-3 text-right">${part.costo_unitario.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    ${(part.cantidad * part.costo_unitario).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RepairDetail;
