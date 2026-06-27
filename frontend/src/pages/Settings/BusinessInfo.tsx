import React, { useState, useEffect } from 'react';
import { useBusinessInfo, useBusinessInfoMutations } from '@/hooks/useBusinessInfo';
import { BusinessInfoUpdate } from '@/types/businessInfo.types';
import { Button } from '@/shared/components/ui/button';
import { Save, Building2, Mail, Phone, MapPin, Globe, Facebook, Instagram, Twitter, Linkedin, Upload } from 'lucide-react';

export const BusinessInfo = () => {
  const { data: businessInfo, loading, error, refetch } = useBusinessInfo();
  const { updateBusinessInfo, updateLogo, loading: mutationLoading, error: mutationError } = useBusinessInfoMutations();

  const [formData, setFormData] = useState<BusinessInfoUpdate>({
    nombre_negocio: '',
    propietario_nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    codigo_postal: '',
    sitio_web: '',
    descripcion: '',
    horarios: {
      lunes: '09:00-18:00',
      martes: '09:00-18:00',
      miercoles: '09:00-18:00',
      jueves: '09:00-18:00',
      viernes: '09:00-18:00',
      sabado: '09:00-13:00',
      domingo: 'Cerrado'
    }
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');

  useEffect(() => {
    if (businessInfo) {
      setFormData({
        nombre_negocio: businessInfo.nombre_negocio,
        propietario_nombre: businessInfo.propietario_nombre,
        email: businessInfo.email,
        telefono: businessInfo.telefono,
        direccion: businessInfo.direccion,
        ciudad: businessInfo.ciudad,
        provincia: businessInfo.provincia,
        codigo_postal: businessInfo.codigo_postal,
        sitio_web: businessInfo.sitio_web,
        descripcion: businessInfo.descripcion,
        horarios: businessInfo.horarios
      });
      setLogoUrl(businessInfo.logo_url || '');
    }
  }, [businessInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('horarios.')) {
      const dayField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        horarios: {
          ...prev.horarios,
          [dayField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateBusinessInfo(formData);
    if (result) {
      refetch();
    }
  };

  const handleLogoUpload = async () => {
    if (logoUrl) {
      const result = await updateLogo(logoUrl);
      if (result) {
        refetch();
        toast({
          title: 'Logo actualizado',
          description: 'El logo se ha actualizado exitosamente'
        });
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64">Cargando información de la empresa...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Información de la Empresa</h1>
        <p className="text-muted-foreground">Configura los datos de tu negocio</p>
      </div>

      {mutationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {mutationError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Información básica */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Información Básica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre del Negocio *</label>
              <input
                type="text"
                name="nombre_negocio"
                value={formData.nombre_negocio}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre del Propietario *</label>
              <input
                type="text"
                name="propietario_nombre"
                value={formData.propietario_nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Contacto */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Información de Contacto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Teléfono *
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Sitio Web
              </label>
              <input
                type="url"
                name="sitio_web"
                value={formData.sitio_web}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Horario de Atención</label>
              <input
                type="text"
                name="horario_atencion"
                value={formData.horario_atencion}
                onChange={handleChange}
                placeholder="Lun-Vie 9:00-18:00"
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Dirección */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Dirección
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Dirección *</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ciudad *</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Provincia *</label>
              <input
                type="text"
                name="provincia"
                value={formData.provincia}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Código Postal *</label>
              <input
                type="text"
                name="codigo_postal"
                value={formData.codigo_postal}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Horarios */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Horarios de Atención</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Lunes</label>
              <input
                type="text"
                name="horarios.lunes"
                value={formData.horarios?.lunes || ''}
                onChange={handleChange}
                placeholder="09:00-18:00"
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Martes</label>
              <input
                type="text"
                name="horarios.martes"
                value={formData.horarios?.martes || ''}
                onChange={handleChange}
                placeholder="09:00-18:00"
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Miércoles</label>
              <input
                type="text"
                name="horarios.miercoles"
                value={formData.horarios?.miercoles || ''}
                onChange={handleChange}
                placeholder="09:00-18:00"
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Jueves</label>
              <input
                type="text"
                name="horarios.jueves"
                value={formData.horarios?.jueves || ''}
                onChange={handleChange}
                placeholder="09:00-18:00"
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Viernes</label>
              <input
                type="text"
                name="horarios.viernes"
                value={formData.horarios?.viernes || ''}
                onChange={handleChange}
                placeholder="09:00-18:00"
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sábado</label>
              <input
                type="text"
                name="horarios.sabado"
                value={formData.horarios?.sabado || ''}
                onChange={handleChange}
                placeholder="09:00-13:00"
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Domingo</label>
              <input
                type="text"
                name="horarios.domingo"
                value={formData.horarios?.domingo || ''}
                onChange={handleChange}
                placeholder="Cerrado"
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Logo de la Empresa</h2>
          <div className="flex items-start gap-4">
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Logo de la empresa"
                className="w-32 h-32 object-contain border rounded-lg"
              />
            )}
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">URL del Logo</label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button
              type="button"
              onClick={handleLogoUpload}
              disabled={!logoUrl || mutationLoading}
              className="mt-6"
            >
              <Upload className="w-4 h-4 mr-2" />
              {mutationLoading ? 'Actualizando...' : 'Actualizar Logo'}
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={mutationLoading} size="lg">
            <Save className="w-4 h-4 mr-2" />
            {mutationLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BusinessInfo;
