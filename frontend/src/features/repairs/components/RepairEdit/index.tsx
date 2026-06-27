import React from 'react';
import { useParams } from 'react-router-dom';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useRepairEdit } from './useRepairEdit';
import { EditHeader } from './EditHeader';
import { EditDeviceInfo } from './EditDeviceInfo';
import { EditStatusForm } from './EditStatusForm';
import { EditPartsForm } from './EditPartsForm';
import { EditCostsForm } from './EditCostsForm';
import { EditAssignmentForm } from './EditAssignmentForm';
import { EditPhotoEvidence } from './EditPhotoEvidence';
import { EditNotesForm } from './EditNotesForm';
import { EditPaymentForm } from './EditPaymentForm';
import { EditSecurityForm } from './EditSecurityForm';
import { EditHardwareForm } from './EditHardwareForm';

export default function RepairEdit() {
  const { id } = useParams<{ id: string }>();
  
  const {
    loading,
    saving,
    repairData,
    formData,
    setFormData,
    repuestos,
    setRepuestos,
    nuevoRepuesto,
    setNuevoRepuesto,
    uploadingPhoto,
    setUploadingPhoto,
    agregarRepuesto,
    eliminarRepuesto,
    handleSave,
  } = useRepairEdit(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <EditHeader repairData={repairData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna Izquierda */}
          <div className="space-y-6">
            <EditDeviceInfo
              repairData={repairData}
              formData={formData}
              setFormData={setFormData}
            />
            <EditStatusForm
              formData={formData}
              setFormData={setFormData}
            />
            <EditPartsForm
              repuestos={repuestos}
              nuevoRepuesto={nuevoRepuesto}
              setNuevoRepuesto={setNuevoRepuesto}
              agregarRepuesto={agregarRepuesto}
              eliminarRepuesto={eliminarRepuesto}
            />
          
          <EditCostsForm
              formData={formData}
              setFormData={setFormData}
            />
          </div>

         
          <div className="space-y-6">
            <EditAssignmentForm
              formData={formData}
              setFormData={setFormData}
            />
            <EditPhotoEvidence
              formData={formData}
              setFormData={setFormData}
              uploadingPhoto={uploadingPhoto}
              setUploadingPhoto={setUploadingPhoto}
            />
            <EditNotesForm
              formData={formData}
              setFormData={setFormData}
            />
            <EditPaymentForm
              formData={formData}
              setFormData={setFormData}
            />
              
            
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
            className="px-8"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
