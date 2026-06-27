import React from 'react';
import { MdSave, MdPerson, MdPhone, MdDevices, MdBuild, MdAttachMoney } from 'react-icons/md';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { DEVICE_TYPES, TECHNICIANS } from './Budgets.types';
import type { NewBudget, BudgetErrors } from './Budgets.types';

interface NewBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  newBudget: NewBudget;
  onBudgetChange: (field: string, value: string | number) => void;
  onSave: () => void;
  errors: BudgetErrors;
  isSubmitting: boolean;
}

export const NewBudgetModal: React.FC<NewBudgetModalProps> = ({
  isOpen,
  onClose,
  newBudget,
  onBudgetChange,
  onSave,
  errors,
  isSubmitting,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Presupuesto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">
                <div className="flex items-center gap-2">
                  <MdPerson size={16} />
                  Nombre del Cliente
                </div>
              </Label>
              <Input
                id="clientName"
                value={newBudget.clientName}
                onChange={(e) => onBudgetChange('clientName', e.target.value)}
                placeholder="Nombre completo"
              />
              {errors.clientName && (
                <p className="text-sm text-destructive">{errors.clientName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientPhone">
                <div className="flex items-center gap-2">
                  <MdPhone size={16} />
                  Teléfono
                </div>
              </Label>
              <Input
                id="clientPhone"
                value={newBudget.clientPhone}
                onChange={(e) => onBudgetChange('clientPhone', e.target.value)}
                placeholder="Número de teléfono"
              />
              {errors.clientPhone && (
                <p className="text-sm text-destructive">{errors.clientPhone}</p>
              )}
            </div>
          </div>

          {/* Dispositivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deviceType">
                <div className="flex items-center gap-2">
                  <MdDevices size={16} />
                  Tipo de Dispositivo
                </div>
              </Label>
              <select
                id="deviceType"
                value={newBudget.deviceType}
                onChange={(e) => onBudgetChange('deviceType', e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Seleccionar...</option>
                {DEVICE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.deviceType && (
                <p className="text-sm text-destructive">{errors.deviceType}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="device">Dispositivo</Label>
              <Input
                id="device"
                value={newBudget.device}
                onChange={(e) => onBudgetChange('device', e.target.value)}
                placeholder="Marca y modelo"
              />
              {errors.device && (
                <p className="text-sm text-destructive">{errors.device}</p>
              )}
            </div>
          </div>

          {/* Problema */}
          <div className="space-y-2">
            <Label htmlFor="issue">
              <div className="flex items-center gap-2">
                <MdBuild size={16} />
                Problema
              </div>
            </Label>
            <Input
              id="issue"
              value={newBudget.issue}
              onChange={(e) => onBudgetChange('issue', e.target.value)}
              placeholder="Descripción del problema"
            />
            {errors.issue && (
              <p className="text-sm text-destructive">{errors.issue}</p>
            )}
          </div>

          {/* Total y Técnico */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total">
                <div className="flex items-center gap-2">
                  <MdAttachMoney size={16} />
                  Total Estimado
                </div>
              </Label>
              <Input
                id="total"
                type="number"
                value={newBudget.total}
                onChange={(e) => onBudgetChange('total', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                min={0}
                step={0.01}
              />
              {errors.total && (
                <p className="text-sm text-destructive">{errors.total}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="technician">Técnico Asignado</Label>
              <select
                id="technician"
                value={newBudget.technician}
                onChange={(e) => onBudgetChange('technician', e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Seleccionar...</option>
                {TECHNICIANS.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
              {errors.technician && (
                <p className="text-sm text-destructive">{errors.technician}</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={isSubmitting}>
            {isSubmitting ? (
              'Guardando...'
            ) : (
              <>
                <MdSave size={16} className="mr-2" />
                Guardar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
