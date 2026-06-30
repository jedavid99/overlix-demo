import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';
import { estadoOptions } from './RepairEdit.types';
import type { FormData } from './RepairEdit.types';

interface EditStatusFormProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
}

export const EditStatusForm: React.FC<EditStatusFormProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Estado y Diagnóstico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado - Select nativo */}
        <div>
          <label htmlFor="estado-select" className="block text-sm font-medium text-muted-foreground mb-1">
            Estado
          </label>
          <select
            id="estado-select"
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
          >
            {estadoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Problema Reportado */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Problema Reportado</label>
          <Textarea
            value={formData.problema_reportado}
            onChange={(e) => setFormData({ ...formData, problema_reportado: e.target.value })}
            placeholder="Descripción del problema"
            rows={3}
          />
        </div>

        {/* Diagnóstico */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Diagnóstico</label>
          <Textarea
            value={formData.diagnosis}
            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
            placeholder="Diagnóstico técnico"
            rows={3}
          />
        </div>

        {/* Reparación Realizada */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Reparación Realizada</label>
          <Textarea
            value={formData.reparacion_realizada}
            onChange={(e) => setFormData({ ...formData, reparacion_realizada: e.target.value })}
            placeholder="Descripción de la reparación realizada"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};