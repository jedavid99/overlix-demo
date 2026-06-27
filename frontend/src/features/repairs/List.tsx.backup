import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Clock,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Loader2,
  Eye,
  Trash2,
  Edit,
  FileText,
  Package,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { repairService } from '@/services/repairService';
import { toast } from '@/hooks/use-toast';
import RepairPreviewModal from './RepairPreviewModal';

// ✅ Estados con colores personalizados
const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { bg: string; text: string; border: string; label: string }> = {
    pending: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-300',
      border: 'border-yellow-300 dark:border-yellow-700',
      label: 'Pendiente',
    },
    diagnostic: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-300',
      border: 'border-blue-300 dark:border-blue-700',
      label: 'Diagnóstico',
    },
    in_progress: {
      bg: 'bg-indigo-100 dark:bg-indigo-900/30',
      text: 'text-indigo-800 dark:text-indigo-300',
      border: 'border-indigo-300 dark:border-indigo-700',
      label: 'En Progreso',
    },
    waiting_parts: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-800 dark:text-orange-300',
      border: 'border-orange-300 dark:border-orange-700',
      label: 'Esperando Repuestos',
    },
    ready: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-800 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-700',
      label: 'Listo',
    },
    delivered: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-300',
      border: 'border-green-300 dark:border-green-700',
      label: 'Entregado',
    },
    cancelled: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-300',
      border: 'border-red-300 dark:border-red-700',
      label: 'Cancelado',
    },
  };

  return statusMap[status] || {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-800 dark:text-gray-300',
    border: 'border-gray-300 dark:border-gray-600',
    label: status || 'Desconocido',
  };
};

// ✅ Prioridades con colores personalizados
const getPriorityBadge = (priority: string) => {
  const priorityMap: Record<string, { bg: string; text: string; border: string; label: string }> = {
    low: {
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-600 dark:text-slate-300',
      border: 'border-slate-300 dark:border-slate-600',
      label: 'Baja',
    },
    medium: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-300 dark:border-blue-700',
      label: 'Media',
    },
    high: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-300 dark:border-orange-700',
      label: 'Alta',
    },
    critical: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-300 dark:border-red-700',
      label: 'Crítica',
    },
  };

  return priorityMap[priority] || {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-300',
    border: 'border-gray-300 dark:border-gray-600',
    label: priority || '—',
  };
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
};

export default function RepairsList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [allRepairs, setAllRepairs] = useState<any[]>([]); // TODAS las reparaciones
  const [totalRepairs, setTotalRepairs] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedRepairId, setSelectedRepairId] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement>>({});

  // Estado para el modal de "Marcar Entregado"
  const [isMarkDeliveredModalOpen, setIsMarkDeliveredModalOpen] = useState(false);
  const [selectedRepairIdForDelivery, setSelectedRepairIdForDelivery] = useState<string | null>(null);
  const [isMarkingDelivered, setIsMarkingDelivered] = useState(false);

  // Cargar TODAS las reparaciones (sin paginación)
  const loadRepairs = useCallback(async () => {
    try {
      setLoading(true);
      // 🔥 Obtener todas las reparaciones con un límite alto
      const response = await repairService.list({
        limit: 1000, // Ajusta según la cantidad esperada
        sort: 'updated_at:desc',
      }) as any;

      const rawArray =
        response?.data?.data?.reparaciones ||
        response?.data?.reparaciones ||
        response?.reparaciones ||
        response?.data?.data?.data ||
        response?.data?.data ||
        response?.data ||
        [];

      const repairsArray = (Array.isArray(rawArray) ? rawArray : []).map((r: any) => ({
        ...r,
        cliente_nombre: r.cliente_nombre || r.cliente?.nombre_completo || 'Cliente no especificado',
        problema_reportado: r.problema_reportado || 'Sin problema',
        categoria_dispositivo: r.categoria_dispositivo || 'Sin categoría',
      }));

      const total =
        response?.data?.data?.total ||
        response?.data?.total ||
        response?.total ||
        repairsArray.length;

      setAllRepairs(repairsArray);
      setTotalRepairs(total);
    } catch (error: any) {
      console.error('Error al cargar reparaciones:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las reparaciones',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRepairs();
  }, [loadRepairs]);

  // Recargar cuando se vuelve de editar
  useEffect(() => {
    if (location.state?.reload) {
      loadRepairs();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, loadRepairs, navigate]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && dropdownRefs.current[activeDropdown] && !dropdownRefs.current[activeDropdown].contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ KPIs calculados sobre TODAS las reparaciones (allRepairs)
  const pendingToday = allRepairs.filter(
    (r) => r.estado === 'pending' || r.estado === 'diagnostic'
  ).length;
  const expiringSoon = allRepairs.filter((r) => r.estado === 'waiting_parts').length;
  const readyToPickup = allRepairs.filter((r) => r.estado === 'ready').length;
  const totalRevenue = allRepairs
    .filter((r) => r.estado === 'delivered' && r.total_reparacion)
    .reduce((sum, r) => sum + (Number(r.total_reparacion) || 0), 0);

  // Filtros
  const filteredRepairs = allRepairs.filter((repair) => {
    const matchesStatus = filterStatus === 'all' || repair.estado === filterStatus;
    const matchesSearch =
      repair.cliente_nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.dispositivo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.numero_reparacion?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Paginación local
  const pageSize = 10;
  const totalFiltered = filteredRepairs.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const paginatedRepairs = filteredRepairs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Funciones CRUD
  const handleDelete = async (repairId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta reparación?')) return;
    try {
      await repairService.delete(repairId);
      toast({ title: 'Éxito', description: 'Reparación eliminada correctamente' });
      loadRepairs(); // Recargar lista
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la reparación',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAsDelivered = async (repairId: string) => {
    setIsMarkingDelivered(true);
    try {
      await repairService.updateStatus(repairId, { estado: 'delivered' });
      toast({ title: 'Éxito', description: 'Reparación marcada como entregada' });
      setIsMarkDeliveredModalOpen(false);
      setSelectedRepairIdForDelivery(null);
      loadRepairs(); // Recargar lista
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo marcar la reparación como entregada',
        variant: 'destructive',
      });
    } finally {
      setIsMarkingDelivered(false);
    }
  };

  // Abrir modal de marcar entregado
  const openMarkDeliveredModal = (repairId: string) => {
    setSelectedRepairIdForDelivery(repairId);
    setIsMarkDeliveredModalOpen(true);
    setActiveDropdown(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Reparaciones</h1>
          <p className="text-muted-foreground">Gestiona y rastrea todos los tickets de reparación</p>
        </div>
        <Button onClick={() => navigate('/reparaciones/add')}>
          <Plus size={16} className="mr-2" />
          Nueva reparación
        </Button>
      </div>

      {/* KPIs con métricas reales (sobre total) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pendientes Hoy</p>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">{pendingToday}</p>
          </CardContent>
        </Card>

        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Esperando Repuestos</p>
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">{expiringSoon}</p>
          </CardContent>
        </Card>

        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Listos para Recoger</p>
              <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">{readyToPickup}</p>
          </CardContent>
        </Card>

        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ingresos Totales</p>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Filter size={20} className="text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-1 flex-wrap">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                Todos
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('pending')}
              >
                Pendientes
              </Button>
              <Button
                variant={filterStatus === 'diagnostic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('diagnostic')}
              >
                Diagnóstico
              </Button>
              <Button
                variant={filterStatus === 'in_progress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('in_progress')}
              >
                En Progreso
              </Button>
              <Button
                variant={filterStatus === 'waiting_parts' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('waiting_parts')}
              >
                Espera Repuestos
              </Button>
              <Button
                variant={filterStatus === 'ready' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('ready')}
              >
                Listos
              </Button>
              <Button
                variant={filterStatus === 'delivered' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('delivered')}
              >
                Entregados
              </Button>
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="text"
                  placeholder="Buscar por orden, cliente o dispositivo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : paginatedRepairs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No hay reparaciones que coincidan con los filtros
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Orden</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cliente</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dispositivo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categoria</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Problema</th>
                     <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Diagnostico</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Prioridad</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedRepairs.map((repair) => {
                    const statusStyle = getStatusBadge(repair.estado);
                    const priorityStyle = getPriorityBadge(repair.prioridad);

                    return (
                      <tr
                        key={repair.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                          {repair.numero_reparacion || repair.id?.substring(0, 8)}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground font-medium">
                          <div>
                            {repair.cliente_nombre || '—'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            DNI: {repair.dni || '—'}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground font-medium">
                          <div> {repair.modelo || '—'}</div>
                         <div className="text-xs text-muted-foreground">{repair.marca || '—'}</div> 
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {repair.categoria_dispositivo || 'Sin categoría'}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                          {repair.problema_reportado || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                          {repair.diagnosis || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Badge
                            variant="outline"
                            size="sm"
                            className={`${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} border`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.text}`} />
                              {statusStyle.label}
                            </span>
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Badge
                            variant="outline"
                            size="sm"
                            className={`${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border} border`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.text}`} />
                              {priorityStyle.label}
                            </span>
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-right relative">
                          <div className="relative" ref={(el) => { if (el) dropdownRefs.current[repair.id] = el; }}>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdown(activeDropdown === repair.id ? null : repair.id);
                              }}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>

                            {activeDropdown === repair.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-50 py-1">
                                <div
                                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    setSelectedRepairId(repair.id);
                                    setPreviewModalOpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                  Vista Previa
                                </div>
                                <div
                                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    navigate(`/reparaciones/edit/${repair.id}`, {
                                      state: { reload: true },
                                    });
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                  Editar
                                </div>
                                <div
                                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    navigate(
                                      `/reparaciones/confirmation?orderId=${repair.id}&print=true`
                                    );
                                  }}
                                >
                                  <FileText className="h-4 w-4" />
                                  PDF Orden
                                </div>
                                {repair.estado !== 'delivered' &&
                                  repair.estado !== 'cancelled' && (
                                    <div
                                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                                      onClick={() => openMarkDeliveredModal(repair.id)}
                                    >
                                      <Package className="h-4 w-4" />
                                      Marcar Entregado
                                    </div>
                                  )}
                                <div
                                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer text-destructive"
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    handleDelete(repair.id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Eliminar
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginación */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <div className="text-sm text-muted-foreground">
                Página <span className="font-semibold text-foreground">{currentPage}</span> de{' '}
                <span className="font-semibold text-foreground">{totalPages}</span> ({totalFiltered}{' '}
                reparaciones)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para marcar entregado */}
      <Dialog
        open={isMarkDeliveredModalOpen}
        onOpenChange={(open) => {
          if (!isMarkingDelivered) {
            setIsMarkDeliveredModalOpen(open);
            if (!open) setSelectedRepairIdForDelivery(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar como Entregado</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres marcar esta reparación como entregada?
              Esta acción cambiará el estado a "Entregado" y no se podrá deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsMarkDeliveredModalOpen(false);
                setSelectedRepairIdForDelivery(null);
              }}
              disabled={isMarkingDelivered}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={() => {
                if (selectedRepairIdForDelivery) {
                  handleMarkAsDelivered(selectedRepairIdForDelivery);
                }
              }}
              disabled={isMarkingDelivered}
            >
              {isMarkingDelivered ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Confirmar Entrega'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de vista previa */}
      {selectedRepairId && (
        <RepairPreviewModal
          isOpen={previewModalOpen}
          onClose={() => {
            setPreviewModalOpen(false);
            setSelectedRepairId(null);
          }}
          repairId={selectedRepairId}
        />
      )}
    </div>
  );
}










