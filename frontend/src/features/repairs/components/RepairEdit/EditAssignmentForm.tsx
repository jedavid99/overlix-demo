import React from 'react';
import { Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import type { FormData } from './RepairEdit.types';

interface EditAssignmentFormProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
}

export const EditAssignmentForm: React.FC<EditAssignmentFormProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Estado y Asignación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Técnico */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Técnico</label>
          <Input
            value={formData.tecnico_asignado_id}
            onChange={(e) => setFormData({ ...formData, tecnico_asignado_id: e.target.value })}
            placeholder="Nombre o ID del técnico"
          />
        </div>

        {/* Fecha Estimada y Tiempo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Fecha Estimada</label>
            <Input
              type="date"
              value={formData.fecha_estimada_entrega}
              onChange={(e) => setFormData({ ...formData, fecha_estimada_entrega: e.target.value })}
            />
          </div>
         
        </div>
      </CardContent>
    </Card>
  );
};
