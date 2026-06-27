import React from 'react';
import { Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';
import type { FormData } from './RepairEdit.types';

interface EditHardwareFormProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
}

export const EditHardwareForm: React.FC<EditHardwareFormProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Wrench className="h-4 w-4 text-muted-foreground" />
          Chequeo de Hardware
        </CardTitle>
      </CardHeader>
      <CardContent>
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          Estado del Hardware (JSON)
        </label>
        <Textarea
          value={formData.chequeo_hardware}
          onChange={(e) => setFormData({ ...formData, chequeo_hardware: e.target.value })}
          placeholder='{"pantalla": true, "bateria": false, "wifi": true}'
          rows={6}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Formato JSON con el estado de cada componente del hardware
        </p>
      </CardContent>
    </Card>
  );
};
