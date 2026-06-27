import React from 'react';
import { Shield, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import type { FormData } from './RepairEdit.types';

interface EditSecurityFormProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
}

export const EditSecurityForm: React.FC<EditSecurityFormProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="h-4 w-4 text-muted-foreground" />
          Seguridad y Acceso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tipo de seguridad */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Tipo de Seguridad</label>
          <select
            value={formData.tipo_seguridad}
            onChange={(e) => setFormData({ ...formData, tipo_seguridad: e.target.value })}
            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="none">Ninguno</option>
            <option value="pin">PIN / Contraseña</option>
            <option value="pattern">Patrón</option>
            <option value="fingerprint">Huella</option>
          </select>
        </div>

        {/* PIN de acceso */}
        {formData.tipo_seguridad === 'pin' && (
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">PIN / Contraseña</label>
            <Input
              type="password"
              value={formData.pin_acceso}
              onChange={(e) => setFormData({ ...formData, pin_acceso: e.target.value })}
              placeholder="••••••"
            />
          </div>
        )}

        {/* Patrón */}
        {formData.tipo_seguridad === 'pattern' && (
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Puntos del Patrón</label>
            <Textarea
              value={formData.patron_puntos}
              onChange={(e) => setFormData({ ...formData, patron_puntos: e.target.value })}
              placeholder="Separar por comas: 0,1,2,5,8..."
              rows={2}
            />
            <label className="block text-sm font-medium text-muted-foreground mb-1 mt-3">Secuencia</label>
            <Textarea
              value={formData.secuencia_patron}
              onChange={(e) => setFormData({ ...formData, secuencia_patron: e.target.value })}
              placeholder="Descripción de la secuencia"
              rows={2}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
