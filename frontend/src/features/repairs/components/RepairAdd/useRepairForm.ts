import { useState, useMemo, useEffect, useCallback } from 'react';
import type { RepairData } from '../RepairFlow';
import { defaultData, hardwareByCategory, securityOptionsByCategory } from './RepairAdd.types';

export const useRepairForm = (initialData?: RepairData, updateData?: (updates: Partial<RepairData>) => void) => {
  const [localData, setLocalData] = useState<RepairData>(defaultData);
  const state = initialData ?? localData;

  const applyUpdate = useCallback((updates: Partial<RepairData>) => {
    if (updateData) updateData(updates);
    else setLocalData((prev) => ({ ...prev, ...updates }));
  }, [updateData]);

  // Obtener items de hardware según categoría
  const currentHardwareItems = useMemo(() => {
    return hardwareByCategory[state.deviceType] || [];
  }, [state.deviceType]);

  // Obtener opciones de seguridad según categoría
  const currentSecurityOptions = useMemo(() => {
    return securityOptionsByCategory[state.deviceType] || securityOptionsByCategory.other;
  }, [state.deviceType]);

  // Inicializar hardwareChecks cuando cambia la categoría
  useEffect(() => {
    const hardwareKeys = currentHardwareItems.map((item) => item.key);
    const initialHardwareChecks = hardwareKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {});
    const mergedHardwareChecks = { ...initialHardwareChecks, ...state.hardwareChecks };
    const filteredHardwareChecks = Object.fromEntries(
      Object.entries(mergedHardwareChecks).filter(([key]) => hardwareKeys.includes(key))
    );
    applyUpdate({ hardwareChecks: filteredHardwareChecks });

    // Si la categoría cambia y el tipo de seguridad actual no está disponible, lo reseteamos a 'ninguno'
    const availableSecurityIds = currentSecurityOptions.map(opt => opt.id);
    if (!availableSecurityIds.includes(state.securityType)) {
      applyUpdate({ securityType: 'ninguno' });
    }
  }, [state.deviceType, currentHardwareItems, currentSecurityOptions, applyUpdate]);

  const handleHardwareToggle = useCallback((key: string) => {
    const updated = { ...state.hardwareChecks };
    updated[key] = !updated[key];
    applyUpdate({ hardwareChecks: updated });
  }, [state.hardwareChecks, applyUpdate]);

  const functionalCount = Object.values(state.hardwareChecks).filter(Boolean).length;

  // Generador de IMEI (15 dígitos) o serial aleatorio
  const generateSerial = useCallback(() => {
    const isPhone = state.deviceType === 'phone';
    if (isPhone) {
      let imei = '35';
      for (let i = 0; i < 13; i++) {
        imei += Math.floor(Math.random() * 10);
      }
      return imei;
    } else {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let serial = '';
      for (let i = 0; i < 12; i++) {
        serial += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return serial;
    }
  }, [state.deviceType]);

  const handleGenerateSerial = useCallback(() => {
    const newSerial = generateSerial();
    applyUpdate({ serial: newSerial });
  }, [generateSerial, applyUpdate]);

  // Accesorios según categoría
  const getAccessoriesForDevice = useCallback(() => {
    const map: Record<string, string[]> = {
      phone: ['Caja Original', 'Cable Cargador', 'Adaptador de Corriente', 'Funda'],
      notebook: ['Cargador', 'Mouse', 'Caja Original'],
      pc: ['Teclado', 'Mouse', 'Cable de Alimentación'],
      tablet: ['Cargador', 'Funda', 'Lápiz'],
      console: ['Caja Original', 'Control', 'Cable HDMI'],
      other: ['Accesorios', 'Documentación'],
    };
    return map[state.deviceType] || [];
  }, [state.deviceType]);

  const handleAccessoryToggle = useCallback((accessory: string) => {
    if (state.accessories.includes(accessory)) {
      applyUpdate({ accessories: state.accessories.filter((a) => a !== accessory) });
    } else {
      applyUpdate({ accessories: [...state.accessories, accessory] });
    }
  }, [state.accessories, applyUpdate]);

  return {
    state,
    applyUpdate,
    currentHardwareItems,
    currentSecurityOptions,
    handleHardwareToggle,
    functionalCount,
    generateSerial,
    handleGenerateSerial,
    getAccessoriesForDevice,
    handleAccessoryToggle,
  };
};
