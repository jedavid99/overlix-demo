import React from 'react';
import { motion } from 'framer-motion';
import { useBudgets } from './useBudgets';
import { BudgetsHeader } from './BudgetsHeader';
import { BudgetsKPIs } from './BudgetsKPIs';
import { BudgetsFilters } from './BudgetsFilters';
import { BudgetsTable } from './BudgetsTable';
import { BudgetsChart } from './BudgetsChart';
import { NewBudgetModal } from './NewBudgetModal';
import { BudgetsLoading } from './BudgetsLoading';
import { BudgetsError } from './BudgetsError';
import { ITEMS_PER_PAGE } from './Budgets.types';

export default function Budgets() {
  const {
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
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
  } = useBudgets();

  if (loading) {
    return <BudgetsLoading />;
  }

  if (error) {
    return <BudgetsError onRetry={handleRetry} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <BudgetsHeader
        onExport={handleExport}
        onNewBudget={() => setIsModalOpen(true)}
        hasBudgets={totalBudgets > 0}
      />

      {/* KPIs */}
      <BudgetsKPIs
        totalBudgets={totalBudgets}
        totalPending={totalPending}
        totalApproved={totalApproved}
        totalValue={totalValue}
      />

      {/* Filtros */}
      <BudgetsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onClearFilters={clearFilters}
        hasActiveFilters={searchQuery !== '' || statusFilter !== 'all'}
      />

      {/* Gráfico de estado y tabla */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla de presupuestos (ocupa 2 columnas) */}
        <div className="lg:col-span-2">
          <BudgetsTable
            budgets={paginatedBudgets}
            currentPage={1}
            totalPages={totalPages}
            onPageChange={(page) => console.log('Page change:', page)}
            itemsPerPage={ITEMS_PER_PAGE}
            totalFiltered={totalBudgets}
          />
        </div>

        {/* Gráfico de distribución por estado */}
        <div>
          <BudgetsChart statusData={statusData} />
        </div>
      </div>

      {/* Modal para nuevo presupuesto */}
      <NewBudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newBudget={newBudget}
        onBudgetChange={handleNewBudgetChange}
        onSave={handleSaveBudget}
        errors={errors}
        isSubmitting={isSubmitting}
      />
    </motion.div>
  );
}
