import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { clientService } from '@/services/clientService';
import { repairService } from '@/services/repairService';
import { Client } from '@/types/client.types';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  UserPlus,
  Smartphone,
  Laptop,
  Monitor,
  Tablet,
  Gamepad2,
  Grid3X3,
  CheckCircle2,
  Cable,
  ArrowRight,
  Settings,
  Power,
  Volume,
  Camera,
  Wifi,
  Fingerprint,
  Volume2,
  Mic,
  Zap,
  Battery,
  Lock,
  AlertCircle,
  Info,
  Check,
  Keyboard,
  Mouse,
  Usb,
  Headphones,
  HardDrive,
  Cpu,
  Shield,
  Key,
  DollarSign,
  CreditCard,
  Building2,
  Hash,
  ArrowLeft,
  Loader2,
  Eye,
} from 'lucide-react';
import { MdPerson, MdBuild, MdCheck } from 'react-icons/md';
import { RiSimCard2Line } from 'react-icons/ri';
import type { RepairData } from './RepairFlow';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { useNavigate } from 'react-router-dom';
// Mapa de hardware por categoría
const hardwareByCategory: Record<string, { key: string; label: string; icon: any }[]> = {
  phone: [
    { key: 'botonPawer', label: 'Botón de Power', icon: Power },
    { key: 'botonVolumen', label: 'Botón de Volumen', icon: Volume },
    { key: 'sensorProximidad', label: 'Sensor de Proximidad', icon: Eye },
    { key: 'camaraFrontal', label: 'Cámara Frontal', icon: Camera },
    { key: 'modulo', label: 'Módulo', icon: Smartphone },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'huella', label: 'Huella', icon: Fingerprint },
    { key: 'camaraTrasera', label: 'Cámara Trasera', icon: Camera },
    { key: 'audio', label: 'Audio', icon: Volume2 },
    { key: 'altavoz', label: 'Altavoz', icon: Mic },
    { key: 'fichaCarga', label: 'Ficha de Carga', icon: Zap },
    { key: 'bateria', label: 'Batería', icon: Battery },
    { key: 'lectorSimcard', label: 'Lector de Simcard', icon: RiSimCard2Line },
  ],
  notebook: [
    { key: 'teclado', label: 'Teclado', icon: Keyboard },
    { key: 'trackpad', label: 'Trackpad', icon: Mouse },
    { key: 'pantalla', label: 'Pantalla', icon: Monitor },
    { key: 'bateria', label: 'Batería', icon: Battery },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'camara', label: 'Cámara', icon: Camera },
    { key: 'altavoces', label: 'Altavoces', icon: Volume2 },
    { key: 'puertos', label: 'Puertos USB', icon: Usb },
    { key: 'cargador', label: 'Cargador', icon: Zap },
  ],
  pc: [
    { key: 'fuentePoder', label: 'Fuente de Poder', icon: Power },
    { key: 'cpu', label: 'CPU', icon: Cpu },
    { key: 'ram', label: 'Memoria RAM', icon: HardDrive },
    { key: 'disco', label: 'Disco Duro/SSD', icon: HardDrive },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'puertos', label: 'Puertos USB', icon: Usb },
    { key: 'audio', label: 'Audio', icon: Volume2 },
  ],
  tablet: [
    { key: 'pantalla', label: 'Pantalla', icon: Monitor },
    { key: 'bateria', label: 'Batería', icon: Battery },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'camara', label: 'Cámara', icon: Camera },
    { key: 'altavoces', label: 'Altavoces', icon: Volume2 },
    { key: 'botones', label: 'Botones Físicos', icon: Power },
    { key: 'cargador', label: 'Cargador', icon: Zap },
  ],
  console: [
    { key: 'fuentePoder', label: 'Fuente de Poder', icon: Power },
    { key: 'lectorDiscos', label: 'Lector de Discos', icon: HardDrive },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'puertos', label: 'Puertos USB', icon: Usb },
    { key: 'audio', label: 'Audio', icon: Volume2 },
    { key: 'control', label: 'Control/Gamepad', icon: Gamepad2 },
  ],
  other: [
    { key: 'bateria', label: 'Batería', icon: Battery },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'puertos', label: 'Puertos', icon: Usb },
    { key: 'audio', label: 'Audio', icon: Volume2 },
  ],
};
// Opciones de seguridad por categoría
const securityOptionsByCategory: Record<string, { id: string; label: string; icon: any }[]> = {
  phone: [
    { id: 'ninguno', label: 'Ninguno', icon: Shield },
    { id: 'pin', label: 'PIN', icon: Key },
    { id: 'patron', label: 'Patrón', icon: Grid3X3 },
    { id: 'huella', label: 'Huella', icon: Fingerprint },
  ],
  notebook: [
    { id: 'ninguno', label: 'Ninguno', icon: Shield },
    { id: 'pin', label: 'Contraseña', icon: Key },
    { id: 'huella', label: 'Huella', icon: Fingerprint },
  ],
  pc: [
    { id: 'ninguno', label: 'Ninguno', icon: Shield },
    { id: 'pin', label: 'Contraseña', icon: Key },
  ],
  tablet: [
    { id: 'ninguno', label: 'Ninguno', icon: Shield },
    { id: 'pin', label: 'PIN', icon: Key },
    { id: 'patron', label: 'Patrón', icon: Grid3X3 },
  ],
  console: [
    { id: 'ninguno', label: 'Ninguno', icon: Shield },
    { id: 'pin', label: 'Código', icon: Key },
  ],
  other: [
    { id: 'ninguno', label: 'Ninguno', icon: Shield },
    { id: 'pin', label: 'Contraseña', icon: Key },
  ],
};
// Categorías de dispositivo
const deviceCategories = [
  { id: 'phone', name: 'Teléfono', icon: Smartphone, color: 'text-primary', bgColor: 'bg-primary/10' },
  { id: 'notebook', name: 'Portátil', icon: Laptop, color: 'text-info', bgColor: 'bg-info/10' },
  { id: 'pc', name: 'PC', icon: Monitor, color: 'text-success', bgColor: 'bg-success/10' },
  { id: 'tablet', name: 'Tablet', icon: Tablet, color: 'text-warning', bgColor: 'bg-warning/10' },
  { id: 'console', name: 'Consola', icon: Gamepad2, color: 'text-destructive', bgColor: 'bg-destructive/10' },
  { id: 'other', name: 'Otro', icon: Grid3X3, color: 'text-muted-foreground', bgColor: 'bg-muted' },
];
// Estado inicial extendido
const defaultData: RepairData = {
  selectedClient: null,
  deviceType: 'phone',
  brand: '',
  model: '',
  serial: '',
  aestheticCondition: '',
  accessories: [],
  issueDescription: '',
  priority: 'Normal',
  estimatedDays: 3,
  hardwareChecks: {},
  securityType: 'ninguno',
  accessPin: '',
  patternDots: [false, false, false, false, false, false, false, false, false],
  patternSequence: [],
  technicianNotes: '',
  termsAccepted: false,
  signaturePad: '',
  printOption: 'both',
  paymentMethod: 'cash',
  installmentsCount: 1,
  paymentType: 'full',
  orderNumber: '',
};
interface RepairCreateProps {
  data?: RepairData;
  updateData?: (updates: Partial<RepairData>) => void;
  onSave?: () => void;
  currentStep?: number;
}
export default function RepairCreate({ data, updateData, onSave = () => {}, currentStep = 1 }: RepairCreateProps) {
  const [search, setSearch] = useState('');
  const [localData, setLocalData] = useState<RepairData>(defaultData);
  const state = data ?? localData;
  const applyUpdate = (updates: Partial<RepairData>) => {
    if (updateData) updateData(updates);
    else setLocalData((prev) => ({ ...prev, ...updates }));
  };
  
  // Estados para clientes
  const [clients, setClients] = useState<Client[]>([]);
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [searching, setSearching] = useState(false);
  const [lastClient, setLastClient] = useState<Client | null>(null);
  const [loadingClients, setLoadingClients] = useState(true);
  
  // Estados para flujo de orden
  const [orderStep, setOrderStep] = useState<'form' | 'confirm'>('form');
  const [repairPrice, setRepairPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Cargar último cliente al montar
  useEffect(() => {
    const fetchLastClient = async () => {
      try {
        const response = await clientService.list({ limit: 1, sort: 'created_at:desc' }) as any;
        console.log('Respuesta último cliente:', response);
        
        // Extraer datos según la estructura real (igual que en página de clientes)
        let clientesArray = response?.data?.data?.clientes ||
                           response?.data?.data?.data ||
                           response?.data?.data ||
                           response?.data ||
                           response;
        
        if (Array.isArray(clientesArray) && clientesArray.length > 0) {
          setLastClient(clientesArray[0]);
        }
      } catch (error) {
        console.error('Error al cargar último cliente:', error);
      } finally {
        setLoadingClients(false);
      }
    };
    fetchLastClient();
  }, []);
  
  // Búsqueda con debounce
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (search.length >= 2) {
        setSearching(true);
        try {
          const response = await clientService.list({ search: search, limit: 10 });
          console.log('Respuesta búsqueda:', response);
          
          // Extraer datos según la estructura real (igual que en página de clientes)
          let clientesArray = response?.data?.data?.clientes ||
                             response?.data?.data?.data ||
                             response?.data?.data ||
                             response?.data ||
                             response;
          
          if (Array.isArray(clientesArray)) {
            setSearchResults(clientesArray);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Error en búsqueda:', error);
          setSearchResults([]);
        } finally {
          setSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);
    
    return () => clearTimeout(debounceTimer);
  }, [search]);
  
  // Handlers para clientes
  const handleSelectClient = useCallback((client: Client) => {
    applyUpdate({
      selectedClient: {
        id: client.id,
        name: client.nombre_completo,
        phone: client.telefono,
        email: client.email || ''
      }
    });
    setSearch('');
    setSearchResults([]);
  }, [applyUpdate]);
  
  const handleSelectLastClient = useCallback(() => {
    if (lastClient) {
      handleSelectClient(lastClient);
    }
  }, [lastClient, handleSelectClient]);

  // Handlers para flujo de orden
  const handleCreateOrder = () => {
    console.log('handleCreateOrder llamado', { selectedClient: state.selectedClient, orderStep });
    if (!state.selectedClient) {
      toast({
        title: 'Error',
        description: 'Debe seleccionar un cliente',
        variant: 'destructive'
      });
      return;
    }
    setOrderStep('confirm');
    console.log('Cambiando a confirm step');
  };

  const handleConfirmOrder = async () => {
    if (!repairPrice || parseFloat(repairPrice) <= 0) {
      toast({
        title: 'Error',
        description: 'Debe ingresar un precio válido',
        variant: 'destructive'
      });
      return;
    }

    if (!state.selectedClient) {
      toast({
        title: 'Error',
        description: 'Debe seleccionar un cliente',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        cliente_id: state.selectedClient.id,
        dispositivo: state.brand && state.model ? `${state.brand} ${state.model}` : state.deviceType,
        marca: state.brand || undefined,
        modelo: state.model || undefined,
        problema_reportado: state.issueDescription,
        diagnosis: undefined,
        prioridad: state.priority === 'Normal' ? 'medium' : state.priority === 'Baja' ? 'low' : state.priority === 'Alta' ? 'high' : 'critical',
        fecha_ingreso: new Date().toISOString().split('T')[0],
        tecnico_asignado_id: undefined,
        notas: state.technicianNotes || undefined
      };

      console.log('Enviando payload:', payload);
      const response = await repairService.create(payload as any);
      console.log('Respuesta completa:', response);
      console.log('Campos de respuesta:', Object.keys(response || {}));
      
      toast({
        title: 'Orden creada',
        description: 'La orden de servicio se ha creado exitosamente'
      });
      
      // Extraer la orden creada de response.data.data (estructura: {success: true, data: {orden}})
      const createdOrder = response?.data?.data || response?.data;
      console.log('Orden creada:', createdOrder);
      console.log('Campos de orden:', Object.keys(createdOrder || {}));
      
      const orderId = createdOrder?.id || createdOrder?.numero_reparacion || createdOrder?._id;
      console.log('ID de orden a usar:', orderId);
      
      if (orderId) {
        navigate(`/reparaciones/confirmation?orderId=${orderId}`);
      } else {
        // Si no hay ID en la respuesta, intentar obtener de la lista
        try {
          const repairsList = await repairService.list({ limit: 1, sort: 'created_at:desc' }) as any;
          console.log('Lista de reparaciones:', repairsList);
          console.log('Campos de lista:', Object.keys(repairsList || {}));
          
          // Extraer datos según la estructura: {data: {reparaciones: [...], total: 10, pagina: 1, total_paginas: 10}}
          let repairsArray = repairsList?.data?.data?.reparaciones ||
                             repairsList?.data?.reparaciones ||
                             repairsList?.reparaciones;
          
          console.log('Array de reparaciones:', repairsArray);
          
          if (Array.isArray(repairsArray) && repairsArray.length > 0) {
            const lastOrder = repairsArray[0];
            const listOrderId = lastOrder.id || lastOrder.numero_reparacion || lastOrder._id;
            console.log('ID de última orden:', listOrderId);
            console.log('Última orden:', lastOrder);
            
            if (listOrderId) {
              navigate(`/reparaciones/confirmation?orderId=${listOrderId}`);
            } else {
              console.error('No se pudo obtener ID de la última orden');
              toast({
                title: 'Advertencia',
                description: 'Orden creada pero no se pudo obtener el ID. Ve a la lista de reparaciones.',
                variant: 'destructive'
              });
              navigate('/reparaciones/list');
            }
          } else {
            console.error('No se encontraron reparaciones en la lista');
            toast({
              title: 'Advertencia',
              description: 'Orden creada pero no se pudo obtener el ID. Ve a la lista de reparaciones.',
              variant: 'destructive'
            });
            navigate('/reparaciones/list');
          }
        } catch (listError) {
          console.error('Error al obtener lista de reparaciones:', listError);
          toast({
            title: 'Advertencia',
            description: 'Orden creada pero no se pudo obtener el ID. Ve a la lista de reparaciones.',
            variant: 'destructive'
          });
          navigate('/reparaciones/list');
        }
      }
    } catch (error: any) {
      console.error('Error al crear orden:', error);
      console.error('Error response:', error.response?.data);
      console.error('Errors array:', error.response?.data?.errors);
      toast({
        title: 'Error',
        description: error.response?.data?.errors?.join(', ') || error.response?.data?.message || 'No se pudo crear la orden de servicio',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToForm = () => {
    setOrderStep('form');
  };
  
  // Obtener items de hardware según categoría
  const currentHardwareItems = useMemo(() => {
    return hardwareByCategory[state.deviceType] || [];
  }, [state.deviceType]);
  // Obtener opciones de seguridad según categoría
  const currentSecurityOptions = useMemo(() => {
    return securityOptionsByCategory[state.deviceType] || securityOptionsByCategory.other;
  }, [state.deviceType]);
  // Inicializar hardwareChecks
  const hardwareKeys = currentHardwareItems.map((item) => item.key);
  const initialHardwareChecks = hardwareKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {});
  const mergedHardwareChecks = { ...initialHardwareChecks, ...state.hardwareChecks };
  const filteredHardwareChecks = Object.fromEntries(
    Object.entries(mergedHardwareChecks).filter(([key]) => hardwareKeys.includes(key))
  );
  React.useEffect(() => {
    const newChecks = { ...initialHardwareChecks, ...state.hardwareChecks };
    const filtered = Object.fromEntries(Object.entries(newChecks).filter(([key]) => hardwareKeys.includes(key)));
    applyUpdate({ hardwareChecks: filtered });
    // Si la categoría cambia y el tipo de seguridad actual no está disponible, lo resetamos a 'ninguno'
    const availableSecurityIds = currentSecurityOptions.map(opt => opt.id);
    if (!availableSecurityIds.includes(state.securityType)) {
      applyUpdate({ securityType: 'ninguno' });
    }
  }, [state.deviceType]);
  const handleHardwareToggle = (key: string) => {
    const updated = { ...state.hardwareChecks };
    updated[key] = !updated[key];
    applyUpdate({ hardwareChecks: updated });
  };
  const functionalCount = Object.values(state.hardwareChecks).filter(Boolean).length;
  // Generador de IMEI (15 dígitos) o serial aleatorio
  const generateSerial = () => {
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
  };
  const navigate = useNavigate();
  const handleGenerateSerial = () => {
    const newSerial = generateSerial();
    applyUpdate({ serial: newSerial });
  };
  // Accesorios según categoría
  const getAccessoriesForDevice = () => {
    const map: Record<string, string[]> = {
      phone: ['Caja Original', 'Cable Cargador', 'Adaptador de Corriente', 'Funda'],
      notebook: ['Cargador', 'Mouse', 'Caja Original'],
      pc: ['Teclado', 'Mouse', 'Cable de Alimentación'],
      tablet: ['Cargador', 'Funda', 'Lápiz'],
      console: ['Caja Original', 'Control', 'Cable HDMI'],
      other: ['Accesorios', 'Documentación'],
    };
    return map[state.deviceType] || [];
  };
  const handleAccessoryToggle = (accessory: string) => {
    if (state.accessories.includes(accessory)) {
      applyUpdate({ accessories: state.accessories.filter((a) => a !== accessory) });
    } else {
      applyUpdate({ accessories: [...state.accessories, accessory] });
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background"
    >
      <main className="max-w-[1400px] mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Registro de Reparación</h1>
            <p className="text-muted-foreground text-sm">Información de Cliente, Dispositivo y Diagnóstico</p>
          </div>
        </div>
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Cliente */}
            <Card>
  <CardContent className="p-4 space-y-4">
    {/* Último cliente registrado */}
    {!state.selectedClient && !search && (
      <div className="p-3 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Último cliente registrado</p>
          {loadingClients ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : null}
        </div>
        {lastClient ? (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">{lastClient.nombre_completo}</p>
              <p className="text-xs text-muted-foreground">{lastClient.telefono}</p>
            </div>
            <Button
              size="sm"
              onClick={handleSelectLastClient}
              className="h-7 text-xs"
            >
              Seleccionar
            </Button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No hay clientes registrados</p>
        )}
      </div>
    )}

    {/* Buscador de clientes */}
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cliente por nombre, teléfono..."
          className="w-full pl-9 pr-4 py-2.5 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-foreground"
        />
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-primary whitespace-nowrap px-3"
        onClick={() => navigate('/clients/add')}
      >
        <UserPlus size={16} className="mr-1" />
        Agregar
      </Button>
    </div>

    {/* Resultados de búsqueda */}
    {search && searchResults.length > 0 && (
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Nombre</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Teléfono</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {searchResults.map((client) => (
              <tr key={client.id} className="hover:bg-muted/50">
                <td className="px-3 py-2 text-xs font-medium text-foreground">{client.nombre_completo}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{client.telefono}</td>
                <td className="px-3 py-2 text-right">
                  <Button
                    size="sm"
                    onClick={() => handleSelectClient(client)}
                    className="h-6 text-xs"
                  >
                    Seleccionar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {search && searching && (
      <div className="flex items-center justify-center py-2">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )}

    {search && searchResults.length === 0 && !searching && (
      <p className="text-center text-xs text-muted-foreground py-2">
        No se encontraron clientes
      </p>
    )}

    {/* Cliente seleccionado */}
    {state.selectedClient ? (
      <div className="flex items-center justify-between p-2 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
            {state.selectedClient.name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">{state.selectedClient.name}</p>
            <p className="text-[10px] text-muted-foreground">{state.selectedClient.phone}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => applyUpdate({ selectedClient: null })}>
          Cambiar
        </Button>
      </div>
    ) : (
      !search && (
        <p className="text-center text-xs text-muted-foreground py-2">
          No hay cliente seleccionado.
        </p>
      )
    )}
  </CardContent>
</Card>
            {/* Dispositivo + Especificaciones */}
            <Card>
              <CardContent className="p-4">
                {/* Categoría */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 text-primary p-2 rounded-xl">
                    <Smartphone size={18} />
                  </div>
                  <h2 className="text-base font-bold text-foreground">Categoría de Dispositivo</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
                  {deviceCategories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = state.deviceType === category.id;
                    return (
                      <button
                        key={category.id}
                        onClick={() => applyUpdate({ deviceType: category.id })}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                          isSelected
                            ? 'border-2 border-primary bg-primary/5 shadow-sm'
                            : 'border border-border bg-muted hover:border-primary/30 hover:bg-primary/10 hover:shadow-sm'
                        }`}
                      >
                        <div className={`${category.bgColor} ${category.color} p-2 rounded-lg`}>
                          <Icon size={20} />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wide ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                          {category.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {/* Especificaciones Técnicas con generador de serial */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 text-primary p-2 rounded-xl">
                    <Settings size={18} />
                  </div>
                  <h2 className="text-base font-bold text-foreground">Especificaciones Técnicas</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Marca</label>
                    <input
                      type="text"
                      value={state.brand}
                      onChange={(e) => applyUpdate({ brand: e.target.value })}
                      placeholder="ej. Samsung, Apple..."
                      className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Modelo</label>
                    <input
                      type="text"
                      value={state.model}
                      onChange={(e) => applyUpdate({ model: e.target.value })}
                      placeholder="ej. Galaxy S24 Ultra..."
                      className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      {state.deviceType === 'phone' ? 'IMEI' : 'Serial / Número de Serie'}
                    </label>
                    <div className="flex gap-2">
                      
                      
                      <input
                        type="text"
                        value={state.serial}
                        onChange={(e) => applyUpdate({ serial: e.target.value })}
                        placeholder={state.deviceType === 'phone' ? '15 dígitos' : '12 caracteres'}
                        className="flex-1 min-w-0 px-3 py-2.5 bg-muted border border-border rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm text-foreground"
                      />
                      
                    </div>
                  </div>
                </div>
                {/* Condición y Accesorios */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-border rounded-xl p-4">
                    <h3 className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-muted-foreground" />
                      Condición Estética
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['Nuevo', 'Rayones Leves', 'Pantalla Rota', 'Desgaste Intenso'].map((condition) => (
                        <button
                          key={condition}
                          onClick={() => applyUpdate({ aestheticCondition: condition })}
                          className={`py-1.5 px-2 text-[10px] font-bold border rounded-lg transition-all ${
                            state.aestheticCondition === condition
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border text-muted-foreground hover:border-border'
                          }`}
                        >
                          {condition}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border border-border rounded-xl p-4">
                    <h3 className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
                      <Cable size={16} className="text-muted-foreground" />
                      Accesorios Incluidos
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {getAccessoriesForDevice().map((accessory) => (
                        <button
                          key={accessory}
                          onClick={() => handleAccessoryToggle(accessory)}
                          className={`px-3 py-1 text-[10px] font-bold rounded-full border transition-all flex items-center gap-1 ${
                            state.accessories.includes(accessory)
                              ? 'bg-primary/5 border-primary text-primary'
                              : 'bg-muted border-border text-foreground hover:border-border'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={state.accessories.includes(accessory)}
                            onChange={() => {}}
                            className="w-3 h-3 rounded"
                          />
                          {accessory}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Chequeo rápido de hardware (dinámico) */}
            <AnimatePresence mode="wait">
              {state.deviceType && currentHardwareItems.length > 0 && (
                <motion.section
                  key={state.deviceType}
                  initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card rounded-2xl p-4 shadow-sm border border-border"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 text-primary p-2 rounded-xl">
                      <CheckCircle2 size={18} />
                    </div>
                    <h2 className="text-base font-bold text-foreground">Chequeo rápido de hardware</h2>
                    <Badge variant="outline" className="ml-auto text-xs">{functionalCount}/{currentHardwareItems.length} funcionales</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                    {currentHardwareItems.map((item) => {
                      const Icon = item.icon;
                      const isChecked = state.hardwareChecks[item.key] ?? false;
                      return (
                        <div
                          key={item.key}
                          className="flex items-center justify-between p-2 bg-muted rounded-xl border border-border hover:border-border transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Icon size={16} className={isChecked ? 'text-primary' : 'text-muted-foreground'} />
                            <span className="text-xs font-medium text-foreground">{item.label}</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleHardwareToggle(item.key)}
                              className="sr-only"
                            />
                            <div className={`w-8 h-4 rounded-full transition-colors ${isChecked ? 'bg-primary' : 'bg-muted'}`}>
                              <div
                                className={`absolute left-0.5 top-0.5 bg-card w-3 h-3 rounded-full transition-transform shadow-sm ${
                                  isChecked ? 'translate-x-4' : ''
                                }`}
                              />
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
            {/* Seguridad y Acceso (dinámico) */}
            <AnimatePresence mode="wait">
              {state.deviceType && currentSecurityOptions.length > 0 && (
                <motion.section
                  key={`security-${state.deviceType}`}
                  initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card rounded-2xl p-4 shadow-sm border border-border"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-warning/10 text-warning p-2 rounded-xl">
                      <Lock size={18} />
                    </div>
                    <h2 className="text-base font-bold text-foreground">Seguridad y Acceso</h2>
                  </div>
                  <div className="flex gap-2 mb-4">
                    {currentSecurityOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = state.securityType === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => applyUpdate({ securityType: opt.id })}
                          className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-full border transition-all ${
                            isSelected
                              ? 'bg-primary/5 border-primary text-primary'
                              : 'bg-muted border-border text-muted-foreground hover:border-primary/30'
                          }`}
                        >
                          <Icon size={14} />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                  {state.securityType === 'pin' && (
                    <div className="max-w-xs">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                        {state.deviceType === 'phone' ? 'PIN' : 'Contraseña'}
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          value={state.accessPin}
                          onChange={(e) => applyUpdate({ accessPin: e.target.value })}
                          placeholder="••••••"
                          className="w-full pl-8 pr-3 py-2.5 bg-muted border border-border rounded-lg focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-mono text-sm text-foreground"
                        />
                        <Lock size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                  {state.securityType === 'patron' && (
                    <div className="flex flex-col items-start gap-3">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Dibuja el patrón (3x3)</p>
                      <div className="relative bg-card p-4 rounded-2xl border-2 border-primary/20 shadow-md" style={{ width: '200px', height: '200px' }}>
                        <div className="grid grid-cols-3 gap-4 w-full h-full">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="w-full h-full bg-muted rounded-full hover:bg-primary/20 transition-colors" />
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs">Limpiar patrón</Button>
                    </div>
                  )}
                  {state.securityType === 'huella' && (
                    <div className="flex items-center gap-3">
                      <Fingerprint size={24} className="text-primary" />
                      <span className="text-sm text-foreground">Dispositivo con lector de huellas</span>
                    </div>
                  )}
                </motion.section>
              )}
            </AnimatePresence>
            {/* Diagnóstico y Notas */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-success/10 text-success p-2 rounded-xl">
                    <AlertCircle size={18} />
                  </div>
                  <h2 className="text-base font-bold text-foreground">Diagnóstico y Notas</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Descripción del Problema
                    </label>
                    <textarea
                      value={state.issueDescription}
                      onChange={(e) => applyUpdate({ issueDescription: e.target.value })}
                      placeholder="Pantalla rota, puerto de carga suelto..."
                      rows={3}
                      className="w-full bg-muted border border-border rounded-lg p-2 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      Notas del Técnico
                    </label>
                    <textarea
                      value={state.technicianNotes}
                      onChange={(e) => applyUpdate({ technicianNotes: e.target.value })}
                      placeholder="Observaciones adicionales..."
                      rows={3}
                      className="w-full bg-muted border border-border rounded-lg p-2 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-foreground"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Prioridad</label>
                    <select
                      value={state.priority}
                      onChange={(e) => applyUpdate({ priority: e.target.value })}
                      className="w-full bg-muted border border-border rounded-lg py-2 px-3 text-sm focus:ring-primary/10 focus:border-primary transition-all text-foreground"
                    >
                      <option>Normal</option>
                      <option>Urgente</option>
                      <option>Baja</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Días Estimados</label>
                    <input
                      type="number"
                      value={state.estimatedDays}
                      onChange={(e) => applyUpdate({ estimatedDays: parseInt(e.target.value) })}
                      className="w-full bg-muted border border-border rounded-lg py-2 px-3 text-sm focus:ring-primary/10 focus:border-primary transition-all text-foreground"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Botón Guardar */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex justify-end"
            >
              <Button
                onClick={handleCreateOrder}
                size="lg"
                className="px-8 py-5 text-base"
              >
                <Check size={20} className="mr-2" />
                Crear Orden de Servicio
              </Button>
            </motion.div>
          </div>
          {/* Right Column - Resumen + Método de Pago */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              {/* Resumen del Ticket */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-primary text-primary-foreground rounded-2xl p-5 lg:p-6 shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-base">Resumen del Ticket</h3>
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest">
                      {state.orderNumber ? state.orderNumber : 'Nueva Orden'}
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-card/10 p-2 rounded-lg">
                        <Search className="text-primary-foreground/80" size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary-foreground uppercase">Cliente</p>
                        <p className="font-semibold text-sm">{state.selectedClient?.name || 'No Seleccionado'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-card/10 p-2 rounded-lg">
                        <Smartphone className="text-primary-foreground/80" size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-primary-foreground uppercase">Dispositivo</p>
                        <p className="font-semibold text-sm">
                          {state.brand && state.model ? `${state.brand} ${state.model}` : 'No Especificado'}
                        </p>
                        {state.serial && <p className="text-xs text-primary-foreground/80">{state.deviceType === 'phone' ? 'IMEI' : 'S/N'}: {state.serial}</p>}
                      </div>
                    </div>
                    {currentHardwareItems.length > 0 && (
                      <div className="flex items-start gap-3">
                        <div className="bg-card/10 p-2 rounded-lg">
                          <CheckCircle2 size={16} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-primary-foreground uppercase">Pre-Check</p>
                          <p className="font-semibold text-sm text-black">
                            {functionalCount}/{currentHardwareItems.length} funcionales
                          </p>
                          <p className="text-xs text-primary-foreground/80">
                            {currentHardwareItems.length - functionalCount} defectuoso{currentHardwareItems.length - functionalCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-primary-foreground text-sm">Mano de Obra</span>
                        <span className="font-bold text-sm">$0.00</span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-primary-foreground text-sm">Repuestos</span>
                        <span className="font-bold text-sm">$0.00</span>
                      </div>
                      <div className="flex items-center justify-between text-lg font-bold pt-3 border-t border-white/20">
                        <span>Total</span>
                        <span className="text-blue-400">$0.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              {/* Método de Pago (NUEVA UBICACIÓN) */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 text-primary p-2 rounded-xl">
                      <DollarSign size={18} />
                    </div>
                    <h2 className="text-base font-bold text-foreground">Método de Pago</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                        Tipo de Pago
                      </label>
                      <div className="flex gap-2">
                        {[
                          { id: 'cash', label: 'Efectivo', icon: DollarSign },
                          { id: 'transfer', label: 'Transferencia', icon: Building2 },
                          { id: 'installments', label: 'Cuotas', icon: CreditCard },
                        ].map((method) => {
                          const Icon = method.icon;
                          const isSelected = state.paymentMethod === method.id;
                          return (
                            <button
                              key={method.id}
                              onClick={() => applyUpdate({ paymentMethod: method.id })}
                              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-full border transition-all ${
                                isSelected
                                  ? 'bg-primary/5 border-primary text-primary'
                                  : 'bg-muted border-border text-muted-foreground hover:border-primary/30'
                              }`}
                            >
                              <Icon size={14} />
                              {method.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                        Modalidad de Pago
                      </label>
                      <div className="flex gap-2">
                        {[
                          { id: 'full', label: 'Completo' },
                          { id: 'half', label: 'Mitad (50%)' },
                        ].map((type) => (
                          <button
                            key={type.id}
                            onClick={() => applyUpdate({ paymentType: type.id })}
                            className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ${
                              state.paymentType === type.id
                                ? 'bg-primary/5 border-primary text-primary'
                                : 'bg-muted border-border text-muted-foreground hover:border-primary/30'
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {state.paymentMethod === 'installments' && (
                      <div className="max-w-xs">
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                          Número de Cuotas
                        </label>
                        <select
                          value={state.installmentsCount}
                          onChange={(e) => applyUpdate({ installmentsCount: parseInt(e.target.value) })}
                          className="w-full bg-muted border border-border rounded-lg py-2 px-3 text-sm focus:ring-primary/10 focus:border-primary transition-all text-foreground"
                        >
                          {[1, 2, 3, 4, 5, 6, 9, 12].map((num) => (
                            <option key={num} value={num}>{num} cuota{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              {/* Ayuda */}
              <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={16} className="text-primary" />
                  <span className="text-xs font-bold text-muted-foreground">Ayuda</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Completa todos los campos para crear la orden. El número de orden se genera automáticamente.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Paso de Confirmación */}
        <AnimatePresence>
          {orderStep === 'confirm' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
            >
              <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="text-primary" />
                    Confirmar Orden de Servicio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Datos del cliente */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold text-sm mb-3">Datos del Cliente</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Nombre:</span> {state.selectedClient?.name}</p>
                      <p><span className="text-muted-foreground">Teléfono:</span> {state.selectedClient?.phone}</p>
                      <p><span className="text-muted-foreground">Email:</span> {state.selectedClient?.email || '—'}</p>
                    </div>
                  </div>

                  {/* Datos del dispositivo */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold text-sm mb-3">Datos del Dispositivo</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Dispositivo:</span> {state.deviceType}</p>
                      <p><span className="text-muted-foreground">Marca:</span> {state.brand || '—'}</p>
                      <p><span className="text-muted-foreground">Modelo:</span> {state.model || '—'}</p>
                      <p><span className="text-muted-foreground">Serial:</span> {state.serial || '—'}</p>
                      <p><span className="text-muted-foreground">Problema:</span> {state.issueDescription}</p>
                    </div>
                  </div>

                  {/* Información */}
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">Estado</p>
                        <p className="text-lg font-bold text-primary">Pendiente de confirmación</p>
                      </div>
                      <Badge variant="default" className="text-xs">Pendiente</Badge>
                    </div>
                  </div>

                  {/* Precio */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Precio de Reparación *</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <input
                        type="number"
                        value={repairPrice}
                        onChange={(e) => setRepairPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-semibold"
                      />
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={handleBackToForm}
                      disabled={submitting}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Volver
                    </Button>
                    <Button
                      onClick={handleConfirmOrder}
                      disabled={submitting}
                      className="min-w-[150px]"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Confirmar Orden
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
