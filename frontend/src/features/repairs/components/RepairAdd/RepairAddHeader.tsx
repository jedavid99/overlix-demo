import React from 'react';

interface RepairAddHeaderProps {
  title?: string;
  subtitle?: string;
}

export const RepairAddHeader: React.FC<RepairAddHeaderProps> = ({
  title = 'Registro de Reparación',
  subtitle = 'Información de Cliente, Dispositivo y Diagnóstico',
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </div>
    </div>
  );
};
