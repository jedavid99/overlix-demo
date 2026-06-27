import React from 'react';
import { Filter, Search } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { STATUS_FILTERS } from './RepairList.types';

interface RepairListFiltersProps {
  filterStatus: string;
  onFilterStatusChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const RepairListFilters: React.FC<RepairListFiltersProps> = ({
  filterStatus,
  onFilterStatusChange,
  searchQuery,
  onSearchChange,
}) => {
  const statusLabels: Record<string, string> = {
    all: 'Todos',
    pending: 'Pendientes',
    diagnostic: 'Diagnóstico',
    in_progress: 'En Progreso',
    waiting_parts: 'Espera Repuestos',
    ready: 'Listos',
    delivered: 'Entregados',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Filter size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-1 flex-wrap">
            {STATUS_FILTERS.map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterStatusChange(status)}
              >
                {statusLabels[status]}
              </Button>
            ))}
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Buscar por orden, cliente o dispositivo..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
