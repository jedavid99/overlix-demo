import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Search, Wrench, Clock, CheckCircle, Package, XCircle, ChevronDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { repairService } from '@/services/repairService';

interface EditStatusModalProps {
  open: boolean;
  onClose: () => void;
  repairId: string;
  currentStatus: string;
  onSuccess: () => void;
}

// Todos los estados (con íconos)
const statusOptions = [
  { value: 'pending', label: 'Pendiente', icon: Search },
  { value: 'diagnostic', label: 'Diagnóstico', icon: Search },
  { value: 'in_progress', label: 'En Progreso', icon: Wrench },
  { value: 'waiting_parts', label: 'Esperando Repuestos', icon: Clock },
  { value: 'ready', label: 'Listo', icon: CheckCircle },
  { value: 'delivered', label: 'Entregado', icon: Package },
  { value: 'cancelled', label: 'Cancelado', icon: XCircle },
];

export const EditStatusModal: React.FC<EditStatusModalProps> = ({
  open,
  onClose,
  repairId,
  currentStatus,
  onSuccess,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Al abrir, poner el estado actual
  useEffect(() => {
    if (open) {
      const exists = statusOptions.some(opt => opt.value === currentStatus);
      setSelectedStatus(exists ? currentStatus : statusOptions[0].value);
      setIsDropdownOpen(false);
    }
  }, [open, currentStatus]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = statusOptions.find(opt => opt.value === selectedStatus);
  const CurrentIcon = currentOption?.icon || statusOptions[0].icon;

  const handleSelect = (value: string) => {
    setSelectedStatus(value);
    setIsDropdownOpen(false);
  };

  const handleSave = async () => {
    if (selectedStatus === currentStatus) {
      onClose();
      return;
    }

    try {
      setIsSaving(true);
      await repairService.update(repairId, { estado: selectedStatus });
      toast({ title: 'Éxito', description: 'Estado actualizado correctamente' });
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
          {/* Estado actual (solo lectura) */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Estado Actual
            </label>
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
              <CurrentIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{currentOption?.label || currentStatus}</span>
            </div>
          </div>

          {/* Nuevo estado - Custom Dropdown con todas las opciones habilitadas */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Nuevo Estado
            </label>
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <CurrentIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{currentOption?.label || 'Seleccionar'}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute z-[999] w-full mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-auto">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-accent focus:bg-accent focus:outline-none cursor-pointer"
                    >
                      <option.icon className="h-4 w-4 text-muted-foreground" />
                      <span>{option.label}</span>
                      {option.value === selectedStatus && (
                        <span className="ml-auto text-xs text-muted-foreground">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Puedes cambiar a cualquier estado. La validación final la hará el sistema.
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