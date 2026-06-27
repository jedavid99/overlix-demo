import React, { useState, useEffect } from 'react';
import { X, Eye, FileText, Package, Clock, AlertCircle, CheckCircle, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { repairService } from '@/services/repairService';
import { toast } from '@/hooks/use-toast';

interface RepairPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  repairId: string;
}

interface RepairData {
  id: string;
  numero_reparacion?: string;
  cliente_nombre?: string;
  cliente_telefono?: string;
  cliente_email?: string;
  dispositivo: string;
  marca?: string;
  modelo?: string;
  problema_reportado: string;
  diagnosis?: string;
  reparacion_realizada?: string;
  estado: string;
  prioridad: string;
  fecha_ingreso: string;
  fecha_estimada_entrega?: string;
  total_reparacion?: number | string;
  notas?: string;
  foto_evidencia?: string;
  repuestos?: Array<{
    nombre: string;
    cantidad: number;
    costo_unitario: number | string;
  }>;
}

export default function RepairPreviewModal({ isOpen, onClose, repairId }: RepairPreviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [repairData, setRepairData] = useState<RepairData | null>(null);

  useEffect(() => {
    if (isOpen && repairId) {
      loadRepairData();
    }
  }, [isOpen, repairId]);

  const loadRepairData = async () => {
    try {
      setLoading(true);
      const response = await repairService.getById(repairId) as any;
      const orderData = response?.data?.data || response?.data || response;
      setRepairData(orderData);
    } catch (error: any) {
      console.error('Error al cargar reparación:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar la reparación',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return { variant: 'warning' as const, label: 'Pendiente' };
      case 'diagnostic': return { variant: 'default' as const, label: 'Diagnóstico' };
      case 'in_progress': return { variant: 'default' as const, label: 'En Progreso' };
      case 'waiting_parts': return { variant: 'warning' as const, label: 'Esperando Repuestos' };
      case 'ready': return { variant: 'success' as const, label: 'Listo' };
      case 'delivered': return { variant: 'success' as const, label: 'Entregado' };
      case 'cancelled': return { variant: 'destructive' as const, label: 'Cancelado' };
      default: return { variant: 'default' as const, label: status };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low': return { variant: 'default' as const, label: 'Baja' };
      case 'medium': return { variant: 'default' as const, label: 'Normal' };
      case 'high': return { variant: 'warning' as const, label: 'Alta' };
      case 'critical': return { variant: 'destructive' as const, label: 'Crítica' };
      default: return { variant: 'default' as const, label: priority };
    }
  };

  const calculateRepuestosTotal = () => {
    if (!repairData?.repuestos) return 0;
    return repairData.repuestos.reduce((sum, r) => {
      const costo = typeof r.costo_unitario === 'number' ? r.costo_unitario : parseFloat(r.costo_unitario as string) || 0;
      return sum + (r.cantidad * costo);
    }, 0);
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Vista Previa de Reparación
          </DialogTitle>
        </DialogHeader>

        {repairData && (
          <div className="space-y-4">
            {/* Código de orden */}
            <Card className="bg-primary/10 border-primary">
              <CardContent className="p-4 text-center">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Código de Orden</p>
                <p className="text-3xl font-bold text-primary">{repairData.numero_reparacion || repairData.id}</p>
              </CardContent>
            </Card>

            {/* Información del cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información del Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre:</span>
                  <span className="font-medium">{repairData.cliente_nombre || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Teléfono:</span>
                  <span className="font-medium">{repairData.cliente_telefono || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{repairData.cliente_email || '—'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Información del dispositivo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información del Dispositivo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dispositivo:</span>
                  <span className="font-medium">{repairData.dispositivo || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Marca:</span>
                  <span className="font-medium">{repairData.marca || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modelo:</span>
                  <span className="font-medium">{repairData.modelo || '—'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Estado y prioridad */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estado</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={getStatusBadge(repairData.estado)?.variant} size="sm">
                    {getStatusBadge(repairData.estado)?.label}
                  </Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Prioridad</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={getPriorityBadge(repairData.prioridad)?.variant} size="sm">
                    {getPriorityBadge(repairData.prioridad)?.label}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Fechas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Fechas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha de ingreso:</span>
                  <span className="font-medium">{repairData.fecha_ingreso || '—'}</span>
                </div>
                {repairData.fecha_estimada_entrega && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha estimada de entrega:</span>
                    <span className="font-medium">{repairData.fecha_estimada_entrega}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Problema y diagnóstico */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Problema y Diagnóstico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Problema reportado:</p>
                  <p className="font-medium">{repairData.problema_reportado}</p>
                </div>
                {repairData.diagnosis && (
                  <div>
                    <p className="text-muted-foreground mb-1">Diagnosis:</p>
                    <p className="font-medium">{repairData.diagnosis}</p>
                  </div>
                )}
                {repairData.reparacion_realizada && (
                  <div>
                    <p className="text-muted-foreground mb-1">Reparación realizada:</p>
                    <p className="font-medium">{repairData.reparacion_realizada}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Repuestos */}
            {repairData.repuestos && repairData.repuestos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Repuestos Usados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {repairData.repuestos.map((repuesto, index) => (
                      <div key={index} className="flex justify-between text-sm border-b pb-2">
                        <span>{repuesto.nombre}</span>
                        <span>
                          {repuesto.cantidad} x ${typeof repuesto.costo_unitario === 'number' ? repuesto.costo_unitario.toFixed(2) : repuesto.costo_unitario || '0.00'}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total repuestos:</span>
                      <span>${calculateRepuestosTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Total */}
            {repairData.total_reparacion && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Costos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {repairData.repuestos && repairData.repuestos.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total repuestos:</span>
                      <span className="font-medium">${calculateRepuestosTotal().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total reparación:</span>
                    <span className="font-bold">
                      ${typeof repairData.total_reparacion === 'number' ? repairData.total_reparacion.toFixed(2) : repairData.total_reparacion}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Foto de evidencia */}
            {repairData.foto_evidencia && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Foto de Evidencia</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={repairData.foto_evidencia}
                    alt="Evidencia"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Notas */}
            {repairData.notas && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Notas Adicionales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{repairData.notas}</p>
                </CardContent>
              </Card>
            )}

            {/* Botón de cerrar */}
            <div className="flex justify-end pt-4">
              <Button onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
