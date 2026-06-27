import { useState, useEffect, useCallback } from 'react';
import { businessInfoService } from '@/services/businessInfoService';
import { BusinessInfo, BusinessInfoUpdate } from '@/types/businessInfo.types';
import { toast } from '@/hooks/use-toast';

export const useBusinessInfo = () => {
  const [data, setData] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await businessInfoService.get();
      setData(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar información de la empresa');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo cargar la información de la empresa'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
};

export const useBusinessInfoMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBusinessInfo = async (data: BusinessInfoUpdate): Promise<BusinessInfo | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await businessInfoService.update(data);
      toast({
        title: 'Éxito',
        description: 'Información de la empresa actualizada correctamente'
      });
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar información de la empresa');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo actualizar la información de la empresa'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateLogo = async (logoUrl: string): Promise<{ logo_url: string } | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await businessInfoService.updateLogo(logoUrl);
      toast({
        title: 'Éxito',
        description: 'Logo actualizado correctamente'
      });
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar logo');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo actualizar el logo'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, updateBusinessInfo, updateLogo };
};
