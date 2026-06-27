import React from 'react';
import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { formatCurrency } from './RepairEdit.types';
import type { FormData } from './RepairEdit.types';

interface EditCostsFormProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
}

export const EditCostsForm: React.FC<EditCostsFormProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          Costos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Costo de Mano de Obra</label>
          <Input
            type="number"
            value={formData.costo_mano_obra}
            onChange={(e) => setFormData({ ...formData, costo_mano_obra: parseFloat(e.target.value) || 0 })}
            placeholder="Costo de mano de obra"
            min={0}
            step={0.01}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Costo de Piezas</label>
            <Input
              type="number"
              value={formData.costo_piezas}
              onChange={(e) => setFormData({ ...formData, costo_piezas: parseFloat(e.target.value) || 0 })}
              placeholder="Costo de piezas"
              min={0}
              step={0.01}
              disabled
              className="bg-muted"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Total Reparación</label>
            <Input
              type="number"
              value={formData.total_reparacion}
              onChange={(e) => setFormData({ ...formData, total_reparacion: parseFloat(e.target.value) || 0 })}
              placeholder="Total"
              min={0}
              step={0.01}
              disabled
              className="bg-muted"
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total a cobrar</span>
            <span className="text-lg font-bold text-foreground">
              {formatCurrency(formData.total_reparacion)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
