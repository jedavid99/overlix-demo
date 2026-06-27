import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { repairService } from '@/services/repairService';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { RepairCreateProps } from './RepairAdd.types';
import { RepairAddHeader } from './RepairAddHeader';
import { ClientSelector } from './ClientSelector';
import { RepairDeviceForm } from './RepairDeviceForm';
import { RepairSecurityForm } from './RepairSecurityForm';
import { RepairDiagnosticForm } from './RepairDiagnosticForm';
import { RepairSummary } from './RepairSummary';
import { RepairPaymentForm } from './RepairPaymentForm';
import { RepairConfirmModal } from './RepairConfirmModal';
import { useClientSearch } from './useClientSearch';
import { useRepairForm } from './useRepairForm';

export default function RepairCreate({ data, updateData, onSave = () => {}, currentStep = 1 }: RepairCreateProps) {
  const navigate = useNavigate();
  
  // Hooks personalizados
  const {
    search,
    setSearch,
    searchResults,
    searching,
    lastClient,
    loadingClients,
    handleSelectClient: handleSelectClientSearch,
    handleSelectLastClient,
  } = useClientSearch();

  const {
    state,
    applyUpdate,
    currentHardwareItems,
    currentSecurityOptions,
    handleHardwareToggle,
    functionalCount,
    handleGenerateSerial,
    getAccessoriesForDevice,
    handleAccessoryToggle,
  } = useRepairForm(data, updateData);

  // Estados para flujo de orden
  const [orderStep, setOrderStep] = useState<'form' | 'confirm'>('form');
  const [repairPrice, setRepairPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Handlers para clientes
  const handleSelectClient = useCallback((client: any) => {
    handleSelectClientSearch(client, (selectedClient) => {
      applyUpdate({ selectedClient });
    });
  }, [handleSelectClientSearch, applyUpdate]);

  const handleSelectLastClientWrapper = useCallback(() => {
    handleSelectLastClient((selectedClient) => {
      applyUpdate({ selectedClient });
    });
  }, [handleSelectLastClient, applyUpdate]);

  const handleClearClient = useCallback(() => {
    applyUpdate({ selectedClient: null });
  }, [applyUpdate]);

  // Handlers para flujo de orden
  const handleCreateOrder = useCallback(() => {
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
  }, [state.selectedClient]);

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
      const payload: any = {
        cliente_id: state.selectedClient.id,
        dispositivo: state.brand && state.model ? `${state.brand} ${state.model}` : state.deviceType,
        problema_reportado: state.issueDescription,
        fecha_ingreso: new Date().toISOString().split('T')[0],
      };

      // Campos opcionales (solo si tienen valor)
      if (state.deviceType) payload.categoria_dispositivo = state.deviceType;
      if (state.brand) payload.marca = state.brand;
      if (state.model) payload.modelo = state.model;
      if (state.serial) payload.numero_serie = state.serial;
      if (state.aestheticCondition) payload.condicion_estetica = state.aestheticCondition;
      if (state.accessories && state.accessories.length > 0) payload.accesorios_incluidos = state.accessories;
      if (state.priority) payload.prioridad = state.priority === 'Normal' ? 'medium' : state.priority === 'Baja' ? 'low' : state.priority === 'Alta' ? 'high' : 'critical';
      if (state.estimatedDays) payload.fecha_estimada_entrega = new Date(Date.now() + state.estimatedDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      if (state.estimatedDays) payload.tiempo_estimado_minutos = state.estimatedDays * 60 * 8; // Asumiendo 8 horas por día
      if (repairPrice) payload.total_reparacion = parseFloat(repairPrice);
      if (state.technicianNotes) payload.notas = state.technicianNotes;
      // No enviar metodo_pago_id si no es un UUID válido
      // if (state.paymentMethod) payload.metodo_pago_id = state.paymentMethod;
      // Mapear tipo_seguridad a valores válidos del backend
      if (state.securityType) {
        const securityMap: Record<string, string> = {
          'none': 'none',
          'pin': 'pin',
          'pattern': 'pattern',
          'fingerprint': 'fingerprint',
          'face': 'face',
          'sin_seguridad': 'none',
          'con_pin': 'pin',
          'con_patron': 'pattern',
          'huella_digital': 'fingerprint',
          'reconocimiento_facial': 'face',
        };
        payload.tipo_seguridad = securityMap[state.securityType] || 'none';
      }
      if (state.securityType === 'pin' && state.accessPin) payload.pin_acceso = state.accessPin;
      if (state.securityType === 'pattern') {
        payload.patron_puntos = null; // Implementar si es necesario
        payload.secuencia_patron = null; // Implementar si es necesario
      }

      // Chequeo de hardware
      if (state.hardwareChecks && Object.keys(state.hardwareChecks).length > 0) {
        payload.chequeo_hardware = state.hardwareChecks;
      }

      console.log('Enviando payload:', JSON.stringify(payload, null, 2));
      const response = await repairService.create(payload as any);
      console.log('Respuesta completa:', response);
      console.log('Campos de respuesta:', Object.keys(response || {}));
      
      toast({
        title: 'Orden creada',
        description: 'La orden de servicio se ha creado exitosamente'
      });
      
      const createdOrder = response?.data?.data || response?.data;
      console.log('Orden creada:', createdOrder);
      console.log('Campos de orden:', Object.keys(createdOrder || {}));
      
      const orderId = createdOrder?.id || createdOrder?.numero_reparacion || createdOrder?._id;
      console.log('ID de orden a usar:', orderId);
      
      if (orderId) {
        navigate(`/reparaciones/confirmation?orderId=${orderId}`);
      } else {
        try {
          const repairsList = await repairService.list({ limit: 1, sort: 'created_at:desc' }) as any;
          console.log('Lista de reparaciones:', repairsList);
          console.log('Campos de lista:', Object.keys(repairsList || {}));
          
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

  const handleBackToForm = useCallback(() => {
    setOrderStep('form');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background"
    >
      <main className="max-w-[1400px] mx-auto p-4 md:p-6">
        {/* Header */}
        <RepairAddHeader />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Cliente */}
            <ClientSelector
              selectedClient={state.selectedClient}
              onSelectClient={handleSelectClient}
              onClearClient={handleClearClient}
              search={search}
              searchResults={searchResults}
              searching={searching}
              lastClient={lastClient}
              loadingClients={loadingClients}
              onSearchChange={setSearch}
              onSelectFromSearch={handleSelectClient}
              onSelectLastClient={handleSelectLastClientWrapper}
            />

            {/* Dispositivo + Especificaciones */}
            <RepairDeviceForm
              deviceType={state.deviceType}
              brand={state.brand}
              model={state.model}
              serial={state.serial}
              aestheticCondition={state.aestheticCondition}
              accessories={state.accessories}
              onDeviceTypeChange={(type) => applyUpdate({ deviceType: type })}
              onBrandChange={(brand) => applyUpdate({ brand })}
              onModelChange={(model) => applyUpdate({ model })}
              onSerialChange={(serial) => applyUpdate({ serial })}
              onConditionChange={(condition) => applyUpdate({ aestheticCondition: condition })}
              onAccessoryToggle={handleAccessoryToggle}
              onGenerateSerial={handleGenerateSerial}
              getAccessoriesForDevice={getAccessoriesForDevice}
            />

            {/* Chequeo rápido de hardware y Seguridad */}
            <RepairSecurityForm
              deviceType={state.deviceType}
              securityType={state.securityType}
              accessPin={state.accessPin}
              hardwareChecks={state.hardwareChecks}
              currentHardwareItems={currentHardwareItems}
              currentSecurityOptions={currentSecurityOptions}
              functionalCount={functionalCount}
              onSecurityTypeChange={(type) => applyUpdate({ securityType: type })}
              onAccessPinChange={(pin) => applyUpdate({ accessPin: pin })}
              onHardwareToggle={handleHardwareToggle}
            />

            {/* Diagnóstico y Notas */}
            <RepairDiagnosticForm
              issueDescription={state.issueDescription}
              technicianNotes={state.technicianNotes}
              priority={state.priority}
              estimatedDays={state.estimatedDays}
              onIssueDescriptionChange={(desc) => applyUpdate({ issueDescription: desc })}
              onTechnicianNotesChange={(notes) => applyUpdate({ technicianNotes: notes })}
              onPriorityChange={(priority) => applyUpdate({ priority })}
              onEstimatedDaysChange={(days) => applyUpdate({ estimatedDays: days })}
            />

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
              <RepairSummary
                selectedClient={state.selectedClient}
                deviceType={state.deviceType}
                brand={state.brand}
                model={state.model}
                serial={state.serial}
                hardwareChecks={state.hardwareChecks}
                currentHardwareItems={currentHardwareItems}
                orderNumber={state.orderNumber}
              />

              {/* Método de Pago */}
              <RepairPaymentForm
                paymentMethod={state.paymentMethod}
                paymentType={state.paymentType}
                installmentsCount={state.installmentsCount}
                onPaymentMethodChange={(method) => applyUpdate({ paymentMethod: method })}
                onPaymentTypeChange={(type) => applyUpdate({ paymentType: type })}
                onInstallmentsCountChange={(count) => applyUpdate({ installmentsCount: count })}
              />

              {/* Ayuda */}
              <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary">i</span>
                  </div>
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
        <RepairConfirmModal
          isOpen={orderStep === 'confirm'}
          selectedClient={state.selectedClient}
          deviceType={state.deviceType}
          brand={state.brand}
          model={state.model}
          serial={state.serial}
          issueDescription={state.issueDescription}
          repairPrice={repairPrice}
          submitting={submitting}
          onBack={handleBackToForm}
          onConfirm={handleConfirmOrder}
          onPriceChange={setRepairPrice}
        />
      </main>
    </motion.div>
  );
}
