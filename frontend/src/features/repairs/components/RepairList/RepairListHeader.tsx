import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface RepairListHeaderProps {
  onNewRepair: () => void;
}

export const RepairListHeader: React.FC<RepairListHeaderProps> = ({ onNewRepair }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Reparaciones</h1>
        <p className="text-muted-foreground">Gestiona y rastrea todos los tickets de reparación</p>
      </div>
      <Button onClick={onNewRepair}>
        <Plus size={16} className="mr-2" />
        Nueva reparación
      </Button>
    </div>
  );
};
