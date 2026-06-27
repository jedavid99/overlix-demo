import api from './api';
import { BusinessInfo, BusinessInfoUpdate } from '@/types/businessInfo.types';

export const businessInfoService = {
  // Obtener información de la empresa
  get: (): Promise<BusinessInfo> => {
    return api.get('/business-info').then(res => res.data.data);
  },

  // Actualizar información de la empresa
  update: (data: BusinessInfoUpdate): Promise<BusinessInfo> => {
    return api.put('/business-info', data).then(res => res.data.data);
  },

  // Actualizar logo
  updateLogo: (logoUrl: string): Promise<{ logo_url: string }> => {
    return api.put('/business-info/logo', { logo_url: logoUrl }).then(res => res.data.data);
  }
};
