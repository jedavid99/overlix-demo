import React from 'react';
import { motion } from 'framer-motion';
import { MdErrorOutline } from 'react-icons/md';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

interface BudgetsErrorProps {
  onRetry: () => void;
}

export const BudgetsError: React.FC<BudgetsErrorProps> = ({ onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <Card className="p-12 text-center">
        <MdErrorOutline size={64} className="mx-auto text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error al cargar los presupuestos</h2>
        <p className="text-muted-foreground mb-4">Hubo un problema al obtener los datos.</p>
        <Button onClick={onRetry}>Reintentar</Button>
      </Card>
    </motion.div>
  );
};
