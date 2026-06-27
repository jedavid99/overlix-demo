import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { repairService } from '@/services/repairService';
import { toast } from '@/hooks/use-toast';
import type { Repair } from './RepairList.types';
import { PAGE_SIZE } from './RepairList.types';

export const useRepairList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [allRepairs, setAllRepairs] = useState<Repair[]>([]);
  const [totalRepairs, setTotalRepairs] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedRepairId, setSelectedRepairId] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement>>({});

  // Estado para el modal de "Marcar Entregado"
  const [isMarkDeliveredModalOpen, setIsMarkDeliveredModalOpen] = useState(false);
  const [selectedRepairIdForDelivery, setSelectedRepairIdForDelivery] = useState<string | null>(null);
  const [isMarkingDelivered, setIsMarkingDelivered] = useState(false);

  // Estado para el modal de "Editar Estado"
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [selectedRepairIdForStatus, setSelectedRepairIdForStatus] = useState<string | null>(null);
  const [selectedRepairCurrentStatus, setSelectedRepairCurrentStatus] = useState<string>('');

  // Cargar TODAS las reparaciones (sin paginación)
  const loadRepairs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await repairService.list({
        limit: 1000,
        sort: 'updated_at:desc',
      }) as any;

      const rawArray =
        response?.data?.data?.reparaciones ||
        response?.data?.reparaciones ||
        response?.reparaciones ||
        response?.data?.data?.data ||
        response?.data?.data ||
        response?.data ||
        [];

      const repairsArray = (Array.isArray(rawArray) ? rawArray : []).map((r: any) => ({
        ...r,
        cliente_nombre: r.cliente_nombre || r.cliente?.nombre_completo || 'Cliente no especificado',
        problema_reportado: r.problema_reportado || 'Sin problema',
        categoria_dispositivo: r.categoria_dispositivo || 'Sin categoría',
      }));

      const total =
        response?.data?.data?.total ||
        response?.data?.total ||
        response?.total ||
        repairsArray.length;

      setAllRepairs(repairsArray);
      setTotalRepairs(total);
    } catch (error: any) {
      console.error('Error al cargar reparaciones:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las reparaciones',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRepairs();
  }, [loadRepairs]);

  // Recargar cuando se vuelve de editar
  useEffect(() => {
    if (location.state?.reload) {
      loadRepairs();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, loadRepairs, navigate]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && dropdownRefs.current[activeDropdown] && !dropdownRefs.current[activeDropdown].contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  // KPIs calculados sobre TODAS las reparaciones
  const pendingToday = allRepairs.filter(
    (r) => r.estado === 'pending' || r.estado === 'diagnostic'
  ).length;
  const expiringSoon = allRepairs.filter((r) => r.estado === 'waiting_parts').length;
  const readyToPickup = allRepairs.filter((r) => r.estado === 'ready').length;
  const totalRevenue = allRepairs
    .filter((r) => r.estado === 'delivered' && r.total_reparacion)
    .reduce((sum, r) => sum + (Number(r.total_reparacion) || 0), 0);

  // Filtros
  const filteredRepairs = allRepairs.filter((repair) => {
    const matchesStatus = filterStatus === 'all' || repair.estado === filterStatus;
    const matchesSearch =
      repair.cliente_nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.dispositivo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.numero_reparacion?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Paginación local
  const totalFiltered = filteredRepairs.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const paginatedRepairs = filteredRepairs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Funciones CRUD
  const handleDelete = async (repairId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta reparación?')) return;
    try {
      await repairService.delete(repairId);
      toast({ title: 'Éxito', description: 'Reparación eliminada correctamente' });
      loadRepairs();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la reparación',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAsDelivered = async (repairId: string) => {
    setIsMarkingDelivered(true);
    try {
      await repairService.updateStatus(repairId, { estado: 'delivered' });
      toast({ title: 'Éxito', description: 'Reparación marcada como entregada' });
      setIsMarkDeliveredModalOpen(false);
      setSelectedRepairIdForDelivery(null);
      loadRepairs();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo marcar la reparación como entregada',
        variant: 'destructive',
      });
    } finally {
      setIsMarkingDelivered(false);
    }
  };

  // Abrir modal de marcar entregado
  const openMarkDeliveredModal = (repairId: string) => {
    setSelectedRepairIdForDelivery(repairId);
    setIsMarkDeliveredModalOpen(true);
    setActiveDropdown(null);
  };

  // Abrir modal de editar estado
  const openEditStatusModal = (repairId: string) => {
    const repair = allRepairs.find(r => r.id === repairId);
    if (repair) {
      setSelectedRepairIdForStatus(repairId);
      setSelectedRepairCurrentStatus(repair.estado);
      setIsEditStatusModalOpen(true);
      setActiveDropdown(null);
    }
  };

  const openPreviewModal = (repairId: string) => {
    setSelectedRepairId(repairId);
    setPreviewModalOpen(true);
    setActiveDropdown(null);
  };

  const navigateToEdit = (repairId: string) => {
    setActiveDropdown(null);
    navigate(`/reparaciones/edit/${repairId}`, {
      state: { reload: true },
    });
  };

  const navigateToPDF = (repairId: string) => {
    setActiveDropdown(null);
    navigate(`/reparaciones/confirmation?orderId=${repairId}&print=true`);
  };

  return {
    currentPage,
    setCurrentPage,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    loading,
    allRepairs,
    totalRepairs,
    activeDropdown,
    setActiveDropdown,
    previewModalOpen,
    setPreviewModalOpen,
    selectedRepairId,
    setSelectedRepairId,
    dropdownRefs,
    isMarkDeliveredModalOpen,
    setIsMarkDeliveredModalOpen,
    selectedRepairIdForDelivery,
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
    filteredRepairs,
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
  };
};
