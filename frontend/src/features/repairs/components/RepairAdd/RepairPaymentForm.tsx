import React from 'react';
import { DollarSign, Building2, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';

interface RepairPaymentFormProps {
  paymentMethod: string;
  paymentType: string;
  installmentsCount: number;
  onPaymentMethodChange: (method: string) => void;
  onPaymentTypeChange: (type: string) => void;
  onInstallmentsCountChange: (count: number) => void;
}

export const RepairPaymentForm: React.FC<RepairPaymentFormProps> = ({
  paymentMethod,
  paymentType,
  installmentsCount,
  onPaymentMethodChange,
  onPaymentTypeChange,
  onInstallmentsCountChange,
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 text-primary p-2 rounded-xl">
            <DollarSign size={18} />
          </div>
          <h2 className="text-base font-bold text-foreground">Método de Pago</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
              Tipo de Pago
            </label>
            <div className="flex gap-2">
              {[
                { id: 'cash', label: 'Efectivo', icon: DollarSign },
                { id: 'transfer', label: 'Transferencia', icon: Building2 },
                { id: 'installments', label: 'Cuotas', icon: CreditCard },
              ].map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => onPaymentMethodChange(method.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-full border transition-all ${
                      isSelected
                        ? 'bg-primary/5 border-primary text-primary'
                        : 'bg-muted border-border text-muted-foreground hover:border-primary/30'
                    }`}
                  >
                    <Icon size={14} />
                    {method.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
              Modalidad de Pago
            </label>
            <div className="flex gap-2">
              {[
                { id: 'full', label: 'Completo' },
                { id: 'half', label: 'Mitad (50%)' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => onPaymentTypeChange(type.id)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ${
                    paymentType === type.id
                      ? 'bg-primary/5 border-primary text-primary'
                      : 'bg-muted border-border text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          {paymentMethod === 'installments' && (
            <div className="max-w-xs">
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                Número de Cuotas
              </label>
              <select
                value={installmentsCount}
                onChange={(e) => onInstallmentsCountChange(parseInt(e.target.value))}
                className="w-full bg-muted border border-border rounded-lg py-2 px-3 text-sm focus:ring-primary/10 focus:border-primary transition-all text-foreground"
              >
                {[1, 2, 3, 4, 5, 6, 9, 12].map((num) => (
                  <option key={num} value={num}>{num} cuota{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
