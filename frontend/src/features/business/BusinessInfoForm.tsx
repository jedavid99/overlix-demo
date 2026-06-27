import React, { useState } from 'react';
import { Building2, Mail, Phone, MapPin, Globe, Clock, Upload, X } from 'lucide-react';
import { BusinessInfo, BusinessInfoUpdate } from '@/types/businessInfo.types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

interface BusinessInfoFormProps {
  businessInfo: BusinessInfo;
  onSubmit: (data: BusinessInfoUpdate) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({
  businessInfo,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<BusinessInfoUpdate>({
    nombre_negocio: businessInfo.nombre_negocio,
    propietario_nombre: businessInfo.propietario_nombre,
    email: businessInfo.email,
    telefono: businessInfo.telefono,
    direccion: businessInfo.direccion,
    ciudad: businessInfo.ciudad,
    provincia: businessInfo.provincia,
    codigo_postal: businessInfo.codigo_postal,
    sitio_web: businessInfo.sitio_web || '',
    descripcion: businessInfo.descripcion || '',
    logo_url: businessInfo.logo_url || '',
    horarios: { ...businessInfo.horarios }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre_negocio?.trim()) {
      newErrors.nombre_negocio = 'El nombre del negocio es obligatorio';
    }
    if (!formData.propietario_nombre?.trim()) {
      newErrors.propietario_nombre = 'El nombre del propietario es obligatorio';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.telefono?.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    }
    if (!formData.direccion?.trim()) {
      newErrors.direccion = 'La dirección es obligatoria';
    }
    if (!formData.ciudad?.trim()) {
      newErrors.ciudad = 'La ciudad es obligatoria';
    }
    if (!formData.provincia?.trim()) {
      newErrors.provincia = 'La provincia es obligatoria';
    }
    if (!formData.codigo_postal?.trim()) {
      newErrors.codigo_postal = 'El código postal es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    await onSubmit(formData);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Logo */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Logo de la Empresa
        </h3>
        
        <div className="flex items-start gap-4">
          {formData.logo_url ? (
            <div className="relative">
              <img
                src={formData.logo_url}
                alt="Logo de la empresa"
                className="w-24 h-24 object-contain border border-slate-200 dark:border-slate-700 rounded-lg"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, logo_url: '' }))}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
              <span className="text-xl font-bold text-primary">
                {getInitials(formData.nombre_negocio || 'NN')}
              </span>
            </div>
          )}
          
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">URL del Logo</label>
            <Input
              type="url"
              name="logo_url"
              value={formData.logo_url}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              className="w-full"
            />
            <p className="text-xs text-slate-500">
              Ingresa la URL de la imagen del logo. Se recomienda una imagen cuadrada de al menos 200x200px.
            </p>
          </div>
        </div>
      </div>

      {/* Información básica */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Información Básica
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Nombre del Negocio <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="nombre_negocio"
              value={formData.nombre_negocio}
              onChange={handleChange}
              className={errors.nombre_negocio ? 'border-red-500' : ''}
            />
            {errors.nombre_negocio && (
              <p className="text-xs text-red-500">{errors.nombre_negocio}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Nombre del Propietario <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="propietario_nombre"
              value={formData.propietario_nombre}
              onChange={handleChange}
              className={errors.propietario_nombre ? 'border-red-500' : ''}
            />
            {errors.propietario_nombre && (
              <p className="text-xs text-red-500">{errors.propietario_nombre}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Descripción</label>
          <Textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
            placeholder="Describe tu negocio..."
          />
        </div>
      </div>

      {/* Información de contacto */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Información de Contacto
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <Input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+54 11 1234 5678"
              className={errors.telefono ? 'border-red-500' : ''}
            />
            {errors.telefono && (
              <p className="text-xs text-red-500">{errors.telefono}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Sitio Web
            </label>
            <Input
              type="url"
              name="sitio_web"
              value={formData.sitio_web}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Dirección */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Dirección
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">
              Dirección <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className={errors.direccion ? 'border-red-500' : ''}
            />
            {errors.direccion && (
              <p className="text-xs text-red-500">{errors.direccion}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Ciudad <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              className={errors.ciudad ? 'border-red-500' : ''}
            />
            {errors.ciudad && (
              <p className="text-xs text-red-500">{errors.ciudad}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Provincia <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="provincia"
              value={formData.provincia}
              onChange={handleChange}
              className={errors.provincia ? 'border-red-500' : ''}
            />
            {errors.provincia && (
              <p className="text-xs text-red-500">{errors.provincia}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Código Postal <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="codigo_postal"
              value={formData.codigo_postal}
              onChange={handleChange}
              className={errors.codigo_postal ? 'border-red-500' : ''}
            />
            {errors.codigo_postal && (
              <p className="text-xs text-red-500">{errors.codigo_postal}</p>
            )}
          </div>
        </div>
      </div>

      {/* Horarios */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Horarios de Atención
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { day: 'Lunes', field: 'lunes' },
            { day: 'Martes', field: 'martes' },
            { day: 'Miércoles', field: 'miercoles' },
            { day: 'Jueves', field: 'jueves' },
            { day: 'Viernes', field: 'viernes' },
            { day: 'Sábado', field: 'sabado' },
            { day: 'Domingo', field: 'domingo' },
          ].map((schedule) => (
            <div key={schedule.field} className="space-y-2">
              <label className="text-sm font-medium">{schedule.day}</label>
              <Input
                type="text"
                name={`horarios.${schedule.field}`}
                value={formData.horarios?.[schedule.field as keyof typeof formData.horarios] || ''}
                onChange={handleChange}
                placeholder="09:00-18:00 o Cerrado"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
};
