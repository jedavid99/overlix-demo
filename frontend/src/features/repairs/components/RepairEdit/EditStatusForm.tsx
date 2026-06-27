import React, { useRef, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
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
  const estadoRef = useRef<HTMLDivElement>(null);
  const [isEstadoOpen, setIsEstadoOpen] = React.useState(false);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (estadoRef.current && !estadoRef.current.contains(event.target as Node)) {
        setIsEstadoOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const CurrentIcon = estadoOptions.find(o => o.value === formData.estado)?.icon || estadoOptions[0].icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Estado y Diagnóstico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado - Custom Dropdown */}
       

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
