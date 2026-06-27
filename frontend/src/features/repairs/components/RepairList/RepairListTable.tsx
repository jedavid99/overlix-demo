import React from 'react';
import { ChevronLeft, ChevronRight, MoreVertical, Eye, Edit, FileText, Package, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { getStatusBadge, getPriorityBadge } from './RepairList.types';
import type { Repair } from './RepairList.types';

interface RepairListTableProps {
  loading: boolean;
  paginatedRepairs: Repair[];
  currentPage: number;
  totalPages: number;
  totalFiltered: number;
  activeDropdown: string | null;
  dropdownRefs: React.MutableRefObject<Record<string, HTMLDivElement>>;
  onDropdownToggle: (repairId: string) => void;
  onPreview: (repairId: string) => void;
  onEdit: (repairId: string) => void;
  onEditStatus: (repairId: string) => void;
  onPDF: (repairId: string) => void;
  onMarkDelivered: (repairId: string) => void;
  onDelete: (repairId: string) => void;
  onPageChange: (page: number) => void;
}

export const RepairListTable: React.FC<RepairListTableProps> = ({
  loading,
  paginatedRepairs,
  currentPage,
  totalPages,
  totalFiltered,
  activeDropdown,
  dropdownRefs,
  onDropdownToggle,
  onPreview,
  onEdit,
  onEditStatus,
  onPDF,
  onMarkDelivered,
  onDelete,
  onPageChange,
}) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (paginatedRepairs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12 text-muted-foreground">
            No hay reparaciones que coincidan con los filtros
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
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
                      <div>{repair.cliente_nombre || '—'}</div>
                      <div className="text-xs text-muted-foreground">
                        DNI: {repair.dni || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground font-medium">
                      <div>{repair.modelo || '—'}</div>
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
                            onDropdownToggle(repair.id);
                          }}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>

                        {activeDropdown === repair.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-50 py-1">
                            <div
                              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                              onClick={() => onPreview(repair.id)}
                            >
                              <Eye className="h-4 w-4" />
                              Vista Previa
                            </div>
                            <div
                              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                              onClick={() => onEditStatus(repair.id)}
                            >
                              <RefreshCw className="h-4 w-4" />
                              Editar Estado
                            </div>
                            <div
                              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                              onClick={() => onEdit(repair.id)}
                            >
                              <Edit className="h-4 w-4" />
                              Editar
                            </div>
                            <div
                              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                              onClick={() => onPDF(repair.id)}
                            >
                              <FileText className="h-4 w-4" />
                              PDF Orden
                            </div>
                            {repair.estado !== 'delivered' &&
                              repair.estado !== 'cancelled' && (
                                <div
                                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                                  onClick={() => onMarkDelivered(repair.id)}
                                >
                                  <Package className="h-4 w-4" />
                                  Marcar Entregado
                                </div>
                              )}
                            <div
                              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer text-destructive"
                              onClick={() => onDelete(repair.id)}
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

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              Página <span className="font-semibold text-foreground">{currentPage}</span> de{' '}
              <span className="font-semibold text-foreground">{totalPages}</span> ({totalFiltered}{' '}
              reparaciones)
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                onClick={() => onPageChange(currentPage + 1)}
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
  );
};
