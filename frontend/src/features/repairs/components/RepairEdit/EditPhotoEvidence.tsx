import React from 'react';
import { Camera, X, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { FormData } from './RepairEdit.types';

interface EditPhotoEvidenceProps {
  formData: FormData;
  setFormData: (data: FormData | ((prev: FormData) => FormData)) => void;
  uploadingPhoto: boolean;
  setUploadingPhoto: (uploading: boolean) => void;
}

export const EditPhotoEvidence: React.FC<EditPhotoEvidenceProps> = ({
  formData,
  setFormData,
  uploadingPhoto,
  setUploadingPhoto,
}) => {
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      // Aquí iría la lógica de subida de fotos
      // Por ahora, simulamos una URL
      const mockUrl = URL.createObjectURL(file);
      setFormData({ ...formData, foto_evidencia: mockUrl });
    } catch (error) {
      console.error('Error al subir foto:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setFormData({ ...formData, foto_evidencia: '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Camera className="h-4 w-4 text-muted-foreground" />
          Foto de Evidencia
        </CardTitle>
      </CardHeader>
      <CardContent>
        {formData.foto_evidencia ? (
          <div className="relative">
            <img
              src={formData.foto_evidencia}
              alt="Evidencia"
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              onClick={handleRemovePhoto}
              className="absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-4">
              Arrastra una imagen o haz clic para subir
            </p>
            <Input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploadingPhoto}
              className="max-w-xs mx-auto"
            />
            {uploadingPhoto && (
              <p className="text-xs text-muted-foreground mt-2">Subiendo...</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
