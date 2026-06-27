import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { exportToCSV } from '@/shared/lib/export';
import type { Budget, NewBudget, BudgetErrors } from './Budgets.types';
import { initialNewBudget, ITEMS_PER_PAGE, STATUS_FILTERS } from './Budgets.types';

export const useBudgets = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Estado del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState<NewBudget>(initialNewBudget);
  const [errors, setErrors] = useState<BudgetErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos
  useEffect(() => {
    // 🔌 Conectar con API real:
    // api.get('/budgets').then(res => setBudgets(res.data)).catch(() => setError(true)).finally(() => setLoading(false))
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  // Filtrar presupuestos
  const filteredBudgets = budgets.filter((budget) => {
    const matchesSearch =
      budget.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      budget.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
      budget.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || budget.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPIs
  const totalBudgets = filteredBudgets.length;
  const totalPending = filteredBudgets.filter((b) => b.status === 'Pendiente').length;
  const totalApproved = filteredBudgets.filter((b) => b.status === 'Aprobado').length;
  const totalValue = filteredBudgets.reduce((sum, b) => sum + b.total, 0);

  // Datos para gráfico de estado
  const statusData = [
    { name: 'Pendiente', value: totalPending },
    { name: 'Aprobado', value: totalApproved },
    {
      name: 'Rechazado',
      value: filteredBudgets.filter((b) => b.status === 'Rechazado').length,
    },
    {
      name: 'Completado',
      value: filteredBudgets.filter((b) => b.status === 'Completado').length,
    },
  ].filter((d) => d.value > 0);

  // Paginación
  const paginatedBudgets = filteredBudgets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredBudgets.length / ITEMS_PER_PAGE);

  // Exportar CSV
  const handleExport = useCallback(() => {
    const csvData = filteredBudgets.map((budget) => ({
      ID: budget.id,
      Cliente: budget.clientName,
      Teléfono: budget.clientPhone,
      Dispositivo: budget.device,
      Problema: budget.issue,
      Total: budget.total,
      Estado: budget.status,
      Fecha: format(budget.date, 'dd/MM/yyyy', { locale: es }),
      Técnico: budget.technician,
    }));
    exportToCSV(csvData, 'presupuestos');
  }, [filteredBudgets]);

  const handleRetry = useCallback(() => {
    setError(false);
    setLoading(true);
    // api.get('/budgets').then(...)
    setLoading(false);
  }, []);

  // Manejadores del modal
  const handleNewBudgetChange = useCallback((field: string, value: string | number) => {
    setNewBudget((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof BudgetErrors]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateNewBudget = useCallback((): boolean => {
    const newErrors: BudgetErrors = {};
    if (!newBudget.clientName.trim()) newErrors.clientName = 'El nombre del cliente es obligatorio';
    if (!newBudget.clientPhone.trim()) newErrors.clientPhone = 'El teléfono es obligatorio';
    if (!newBudget.device.trim()) newErrors.device = 'El dispositivo es obligatorio';
    if (!newBudget.deviceType.trim()) newErrors.deviceType = 'El tipo de dispositivo es obligatorio';
    if (!newBudget.issue.trim()) newErrors.issue = 'El problema es obligatorio';
    if (!newBudget.total || newBudget.total <= 0) newErrors.total = 'El total debe ser mayor a 0';
    if (!newBudget.technician.trim()) newErrors.technician = 'El técnico es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [newBudget]);

  const handleSaveBudget = useCallback(async () => {
    if (!validateNewBudget()) return;
    setIsSubmitting(true);
    
    // Simular llamada a la API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const budget: Budget = {
      id: `BUD-${Date.now()}`,
      ...newBudget,
      status: 'Pendiente',
      date: new Date(),
    };
    
    setBudgets((prev) => [budget, ...prev]);
    setIsModalOpen(false);
    setNewBudget(initialNewBudget);
    setErrors({});
    setIsSubmitting(false);
  }, [newBudget, validateNewBudget]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('all');
  }, []);

  return {
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    budgets,
    setBudgets,
    currentPage,
    setCurrentPage,
    filteredBudgets,
    paginatedBudgets,
    totalPages,
    totalBudgets,
    totalPending,
    totalApproved,
    totalValue,
    statusData,
    isModalOpen,
    setIsModalOpen,
    newBudget,
    setNewBudget,
    errors,
    setErrors,
    isSubmitting,
    handleExport,
    handleRetry,
    handleNewBudgetChange,
    handleSaveBudget,
    clearFilters,
  };
};
