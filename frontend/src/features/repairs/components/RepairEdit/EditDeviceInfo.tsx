import React from 'react';
import { Smartphone, User, Phone, Hash, Tag, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { RepairData } from './RepairEdit.types';

interface EditDeviceInfoProps {
  repairData: RepairData | null;
}

export const EditDeviceInfo: React.FC<EditDeviceInfoProps> = ({ repairData }) => {
  if (!repairData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            Información del Dispositivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No hay datos disponibles</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Smartphone className="h-4 w-4 text-muted-foreground" />
          Información del Dispositivo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Cliente
            </label>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {repairData.cliente_nombre || '—'}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Teléfono
            </label>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {repairData.cliente_telefono || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Dispositivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Dispositivo
            </label>
            <p className="text-sm font-medium text-foreground">
              {repairData.dispositivo || '—'}
            </p>
          </div>
        <div className="space-y-1">
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Modelo
            </label>
            <p className="text-sm text-foreground">
              {repairData.modelo || '—'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          
        </div>

        
      </CardContent>
    </Card>
  );
};