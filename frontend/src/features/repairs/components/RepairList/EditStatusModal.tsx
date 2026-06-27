import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Search, Wrench, Clock, CheckCircle, Package, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { repairService } from '@/services/repairService';

interface EditStatusModalProps {
  open: boolean;
  onClose: () => void;
  repairId: string;
  currentStatus: string;
  onSuccess: () => void;
}

// Estados en inglés (coinciden con el backend)
const statusOptions = [
  { value: 'pending', label: 'Pendiente', icon: Search },
  { value: 'diagnostic', label: 'Diagnóstico', icon: Search },
  { value: 'in_progress', label: 'En Progreso', icon: Wrench },
  { value: 'waiting_parts', label: 'Esperando Repuestos', icon: Clock },
  { value: 'ready', label: 'Listo', icon: CheckCircle },
  { value: 'delivered', label: 'Entregado', icon: Package },
  { value: 'cancelled', label: 'Cancelado', icon: XCircle },
];

// Transiciones válidas (claves en inglés)
const validTransitions: Record<string, string[]> = {
  pending: ['diagnostic', 'cancelled'],
  diagnostic: ['in_progress', 'cancelled'],
  in_progress: ['waiting_parts', 'ready', 'cancelled'],
  waiting_parts: ['in_progress', 'ready', 'cancelled'],
  ready: ['delivered'],
  delivered: [],
  cancelled: [],
};

export const EditStatusModal: React.FC<EditStatusModalProps> = ({
  open,
  onClose,
  repairId,
  currentStatus,
  onSuccess,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isSaving, setIsSaving] = useState(false);

  // Resetear selección al abrir
  useEffect(() => {
    if (open) {
      setSelectedStatus(currentStatus);
    }
  }, [open, currentStatus]);

  const currentOption = statusOptions.find(opt => opt.value === selectedStatus);
  const CurrentIcon = currentOption?.icon || statusOptions[0].icon;

  // Estados permitidos desde el estado actual
  const allowedTransitions = validTransitions[currentStatus] || [];
  const availableOptions = statusOptions.filter(opt =>
    opt.value === currentStatus || allowedTransitions.includes(opt.value)
  );

  const handleSave = async () => {
    if (selectedStatus === currentStatus) {
      onClose();
      return;
    }

    if (!allowedTransitions.includes(selectedStatus)) {
      toast({
        title: 'Error',
        description: `No puedes cambiar de "${currentStatus}" a "${selectedStatus}". Transición no válida.`,
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      await repairService.update(repairId, { estado: selectedStatus });

      toast({
        title: 'Éxito',
        description: 'Estado actualizado correctamente',
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo actualizar el estado',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Estado de Reparación</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Estado Actual
            </label>
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
              <CurrentIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{currentOption?.label || currentStatus}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Nuevo Estado
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            >
              {availableOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={!allowedTransitions.includes(option.value) && option.value !== currentStatus}
                >
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Solo puedes cambiar a estados permitidos por la transición
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving || selectedStatus === currentStatus}>
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 