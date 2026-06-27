import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepairList } from './useRepairList';
import { RepairListHeader } from './RepairListHeader';
import { RepairListKPIs } from './RepairListKPIs';
import { RepairListFilters } from './RepairListFilters';
import { RepairListTable } from './RepairListTable';
import { MarkDeliveredModal } from './MarkDeliveredModal';
import { EditStatusModal } from './EditStatusModal';
import RepairPreviewModal from '../../RepairPreviewModal';

export default function RepairsList() {
  const navigate = useNavigate();
  const {
    currentPage,
    setCurrentPage,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    loading,
    activeDropdown,
    setActiveDropdown,
    previewModalOpen,
    setPreviewModalOpen,
    selectedRepairId,
    setSelectedRepairId,
    dropdownRefs,
    isMarkDeliveredModalOpen,
    setIsMarkDeliveredModalOpen,
    isMarkingDelivered,
    isEditStatusModalOpen,
    setIsEditStatusModalOpen,
    selectedRepairIdForStatus,
    setSelectedRepairIdForStatus,
    selectedRepairCurrentStatus,
    setSelectedRepairCurrentStatus,
    pendingToday,
    expiringSoon,
    readyToPickup,
    totalRevenue,
    paginatedRepairs,
    totalPages,
    totalFiltered,
    handleDelete,
    handleMarkAsDelivered,
    openMarkDeliveredModal,
    openEditStatusModal,
    openPreviewModal,
    navigateToEdit,
    navigateToPDF,
    loadRepairs,
  } = useRepairList();

  const handleDropdownToggle = (repairId: string) => {
    setActiveDropdown(activeDropdown === repairId ? null : repairId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <RepairListHeader onNewRepair={() => navigate('/reparaciones/add')} />

      {/* KPIs */}
      <RepairListKPIs
        pendingToday={pendingToday}
        expiringSoon={expiringSoon}
        readyToPickup={readyToPickup}
        totalRevenue={totalRevenue}
      />

      {/* Filtros */}
      <RepairListFilters
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Tabla */}
      <RepairListTable
        loading={loading}
        paginatedRepairs={paginatedRepairs}
        currentPage={currentPage}
        totalPages={totalPages}
        totalFiltered={totalFiltered}
        activeDropdown={activeDropdown}
        dropdownRefs={dropdownRefs}
        onDropdownToggle={handleDropdownToggle}
        onPreview={openPreviewModal}
        onEdit={navigateToEdit}
        onEditStatus={openEditStatusModal}
        onPDF={navigateToPDF}
        onMarkDelivered={openMarkDeliveredModal}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
      />

      {/* Modal para marcar entregado */}
      <MarkDeliveredModal
        isOpen={isMarkDeliveredModalOpen}
        onOpenChange={setIsMarkDeliveredModalOpen}
        onConfirm={() => {
          if (selectedRepairId) {
            handleMarkAsDelivered(selectedRepairId);
          }
        }}
        isProcessing={isMarkingDelivered}
      />

      {/* Modal para editar estado */}
      {selectedRepairIdForStatus && (
        <EditStatusModal
          open={isEditStatusModalOpen}
          onClose={() => {
            setIsEditStatusModalOpen(false);
            setSelectedRepairIdForStatus(null);
            setSelectedRepairCurrentStatus('');
          }}
          repairId={selectedRepairIdForStatus}
          currentStatus={selectedRepairCurrentStatus}
          onSuccess={() => {
            loadRepairs();
          }}
        />
      )}

      {/* Modal de vista previa */}
      {selectedRepairId && (
        <RepairPreviewModal
          isOpen={previewModalOpen}
          onClose={() => {
            setPreviewModalOpen(false);
            setSelectedRepairId(null);
          }}
          repairId={selectedRepairId}
        />
      )}
    </div>
  );
}
