import React from 'react';
import { motion } from 'framer-motion';
import { Search, Smartphone, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';

interface RepairSummaryProps {
  selectedClient: { id: string; name: string; phone: string; email?: string } | null;
  deviceType: string;
  brand: string;
  model: string;
  serial: string;
  hardwareChecks: Record<string, boolean>;
  currentHardwareItems: Array<{ key: string; label: string; icon: any }>;
  orderNumber: string;
}

export const RepairSummary: React.FC<RepairSummaryProps> = ({
  selectedClient,
  deviceType,
  brand,
  model,
  serial,
  hardwareChecks,
  currentHardwareItems,
  orderNumber,
}) => {
  const functionalCount = Object.values(hardwareChecks).filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-primary text-primary-foreground rounded-2xl p-5 lg:p-6 shadow-lg relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full -mr-16 -mt-16"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-base">Resumen del Ticket</h3>
          <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest">
            {orderNumber ? orderNumber : 'Nueva Orden'}
          </Badge>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-card/10 p-2 rounded-lg">
              <Search className="text-primary-foreground/80" size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-primary-foreground uppercase">Cliente</p>
              <p className="font-semibold text-sm">{selectedClient?.name || 'No Seleccionado'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-card/10 p-2 rounded-lg">
              <Smartphone className="text-primary-foreground/80" size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-primary-foreground uppercase">Dispositivo</p>
              <p className="font-semibold text-sm">
                {brand && model ? `${brand} ${model}` : 'No Especificado'}
              </p>
              {serial && <p className="text-xs text-primary-foreground/80">{deviceType === 'phone' ? 'IMEI' : 'S/N'}: {serial}</p>}
            </div>
          </div>
          {currentHardwareItems.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="bg-card/10 p-2 rounded-lg">
                <CheckCircle2 size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-primary-foreground uppercase">Pre-Check</p>
                <p className="font-semibold text-sm text-black">
                  {functionalCount}/{currentHardwareItems.length} funcionales
                </p>
                <p className="text-xs text-primary-foreground/80">
                  {currentHardwareItems.length - functionalCount} defectuoso{currentHardwareItems.length - functionalCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          )}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-primary-foreground text-sm">Mano de Obra</span>
              <span className="font-bold text-sm">$0.00</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-primary-foreground text-sm">Repuestos</span>
              <span className="font-bold text-sm">$0.00</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold pt-3 border-t border-white/20">
              <span>Total</span>
              <span className="text-blue-400">$0.00</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
