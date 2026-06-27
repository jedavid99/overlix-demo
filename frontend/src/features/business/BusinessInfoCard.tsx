import React from 'react';
import { Building2, Mail, Phone, MapPin, Globe, Clock, Edit } from 'lucide-react';
import { BusinessInfo } from '@/types/businessInfo.types';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

interface BusinessInfoCardProps {
  businessInfo: BusinessInfo;
  onEdit: () => void;
}

export const BusinessInfoCard: React.FC<BusinessInfoCardProps> = ({
  businessInfo,
  onEdit
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Header con logo y nombre */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Logo o placeholder */}
            {businessInfo.logo_url ? (
              <img
                src={businessInfo.logo_url}
                alt="Logo de la empresa"
                className="w-20 h-20 object-contain border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            ) : (
              <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                <span className="text-2xl font-bold text-primary">
                  {getInitials(businessInfo.nombre_negocio)}
                </span>
              </div>
            )}
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {businessInfo.nombre_negocio}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                {businessInfo.propietario_nombre}
              </p>
              <Badge className="mt-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Activo
              </Badge>
            </div>
          </div>
          
          <Button onClick={onEdit} variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      {/* Información de contacto */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Información de Contacto
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                <p className="text-slate-900 dark:text-white font-medium">{businessInfo.email}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Teléfono</p>
                <p className="text-slate-900 dark:text-white font-medium">{businessInfo.telefono}</p>
              </div>
            </div>
            
            {businessInfo.sitio_web && (
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Sitio Web</p>
                  <a
                    href={businessInfo.sitio_web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    {businessInfo.sitio_web}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Dirección
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Dirección</p>
                <p className="text-slate-900 dark:text-white font-medium">{businessInfo.direccion}</p>
                <p className="text-slate-900 dark:text-white">
                  {businessInfo.ciudad}, {businessInfo.provincia}
                </p>
                <p className="text-slate-900 dark:text-white">
                  {businessInfo.codigo_postal}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Descripción */}
      {businessInfo.descripcion && (
        <div className="px-6 pb-6">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
            Descripción
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {businessInfo.descripcion}
          </p>
        </div>
      )}

      {/* Horarios */}
      <div className="px-6 pb-6 border-t border-slate-100 dark:border-slate-800 pt-6">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Horarios de Atención
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { day: 'Lunes', hours: businessInfo.horarios.lunes },
            { day: 'Martes', hours: businessInfo.horarios.martes },
            { day: 'Miércoles', hours: businessInfo.horarios.miercoles },
            { day: 'Jueves', hours: businessInfo.horarios.jueves },
            { day: 'Viernes', hours: businessInfo.horarios.viernes },
            { day: 'Sábado', hours: businessInfo.horarios.sabado },
            { day: 'Domingo', hours: businessInfo.horarios.domingo },
          ].map((schedule) => (
            <div
              key={schedule.day}
              className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 text-center"
            >
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {schedule.day}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {schedule.hours}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
