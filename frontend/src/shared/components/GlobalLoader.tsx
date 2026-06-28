import React from 'react';
import { Loader2 } from 'lucide-react';
import { useLoading } from '@/contexts/LoadingContext';

export const GlobalLoader: React.FC = () => {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-lg p-8 shadow-2xl flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-lg font-medium text-slate-900 dark:text-white">
          {loadingMessage || 'Cargando...'}
        </p>
      </div>
    </div>
  );
};
