import React from 'react';
import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import type { FormData } from './RepairEdit.types';

// Opciones para el método de pago (puedes moverlo a un archivo de constantes)
const METODO_PAGO_OPTIONS = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia Bancaria' },
  { value: 'tarjeta', label: 'Tarjeta de Crédito' },
  { value: 'cuotas', label: 'Cuotas' },
];

interface EditPaymentFormProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
}

export const EditPaymentForm: React.FC<EditPaymentFormProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          Pago
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado de pago */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Estado de pago</span>
            <Badge
              variant={formData.pagado ? 'success' : 'destructive'}
              className="text-xs"
            >
              {formData.pagado ? 'Pagado' : 'Pendiente'}
            </Badge>
          </div>
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                pagado: !prev.pagado,
                monto_pagado: !prev.pagado ? prev.total_reparacion : 0,
              }))
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              formData.pagado ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.pagado ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Método de pago */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Método de Pago
          </label>
          <select
            value={formData.metodo_pago}
            onChange={(e) =>
              setFormData({ ...formData, metodo_pago: e.target.value })
            }
            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Seleccionar método</option>
            {METODO_PAGO_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Monto pagado */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Monto Pagado
          </label>
          <Input
            type="number"
            value={formData.monto_pagado}
            onChange={(e) =>
              setFormData({
                ...formData,
                monto_pagado: parseFloat(e.target.value) || 0,
              })
            }
            placeholder="0.00"
            min={0}
            step={0.01}
          />
        </div>
      </CardContent>
    </Card>
  );
};