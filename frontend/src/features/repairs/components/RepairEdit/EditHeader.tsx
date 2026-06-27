import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { RepairData } from './RepairEdit.types';

interface EditHeaderProps {
  repairData: RepairData | null;
}

export const EditHeader: React.FC<EditHeaderProps> = ({ repairData }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/reparaciones/list')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Editar Reparación</h1>
          <p className="text-muted-foreground text-sm">
            {repairData?.numero_reparacion || `#${repairData?.id}`}
          </p>
        </div>
      </div>
    </div>
  );
};
