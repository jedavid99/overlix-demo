import { useState, useEffect, useCallback } from 'react';
import { repairService } from '@/services/repairService';
import { Repair, RepairCreate, RepairUpdate, RepairFilters, PaginatedResponse, RepairStatusUpdate } from '@/types/repair.types';
import { useLoading } from '@/contexts/LoadingContext';

export const useRepairs = (filters?: RepairFilters) => {
  const [data, setData] = useState<PaginatedResponse<Repair> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await repairService.list(filters);
      setData(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar reparaciones');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export const useRepair = (id: string) => {
  const [data, setData] = useState<Repair | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await repairService.getById(id);
      setData(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar reparación');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export const useRepairMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setLoading: setGlobalLoading, setMessage: setGlobalMessage } = useLoading();

  const createRepair = async (data: RepairCreate): Promise<Repair | null> => {
    setLoading(true);
    setGlobalLoading(true);
    setGlobalMessage('Creando reparación...');
    setError(null);
    try {
      const response = await repairService.create(data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al crear reparación');
      return null;
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const updateRepair = async (id: string, data: RepairUpdate): Promise<Repair | null> => {
    setLoading(true);
    setGlobalLoading(true);
    setGlobalMessage('Actualizando reparación...');
    setError(null);
    try {
      const response = await repairService.update(id, data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar reparación');
      return null;
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const deleteRepair = async (id: string): Promise<boolean> => {
    setLoading(true);
    setGlobalLoading(true);
    setGlobalMessage('Eliminando reparación...');
    setError(null);
    try {
      await repairService.delete(id);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al eliminar reparación');
      return false;
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const updateStatus = async (id: string, data: RepairStatusUpdate): Promise<Repair | null> => {
    setLoading(true);
    setGlobalLoading(true);
    setGlobalMessage('Actualizando estado...');
    setError(null);
    try {
      const response = await repairService.updateStatus(id, data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar estado');
      return null;
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const completeRepair = async (id: string, data?: { costo_final?: number; notas?: string }): Promise<Repair | null> => {
    setLoading(true);
    setGlobalLoading(true);
    setGlobalMessage('Completando reparación...');
    setError(null);
    try {
      const response = await repairService.complete(id, data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al completar reparación');
      return null;
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const assignTechnician = async (id: string, tecnico_id: string): Promise<Repair | null> => {
    setLoading(true);
    setGlobalLoading(true);
    setGlobalMessage('Asignando técnico...');
    setError(null);
    try {
      const response = await repairService.assignTechnician(id, tecnico_id);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al asignar técnico');
      return null;
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const addPart = async (id: string, part: { repuesto_id: string; cantidad: number }): Promise<Repair | null> => {
    setLoading(true);
    setGlobalLoading(true);
    setGlobalMessage('Agregando repuesto...');
    setError(null);
    try {
      const response = await repairService.addPart(id, part);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al agregar repuesto');
      return null;
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  return { 
    loading, 
    error, 
    createRepair, 
    updateRepair, 
    deleteRepair, 
    updateStatus, 
    completeRepair, 
    assignTechnician, 
    addPart 
  };
};

export const useClientRepairs = (clientId: string, filters?: RepairFilters) => {
  const [data, setData] = useState<PaginatedResponse<Repair> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!clientId) return;
    setLoading(true);
    try {
      const response = await repairService.getByClient(clientId, filters);
      setData(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar reparaciones del cliente');
    } finally {
      setLoading(false);
    }
  }, [clientId, filters]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export const useTechnicianRepairs = (technicianId: string, filters?: RepairFilters) => {
  const [data, setData] = useState<PaginatedResponse<Repair> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!technicianId) return;
    setLoading(true);
    try {
      const response = await repairService.getByTechnician(technicianId, filters);
      setData(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar reparaciones del técnico');
    } finally {
      setLoading(false);
    }
  }, [technicianId, filters]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};
