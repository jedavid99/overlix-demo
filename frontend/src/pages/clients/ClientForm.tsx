import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClient, useClientMutations } from '@/hooks/useClients';
import { ClientCreate, ClientUpdate } from '@/types/client.types';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';

export const ClientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { data: client, loading: loadingClient } = useClient(id || '');
  const { createClient, updateClient, loading, error } = useClientMutations();

  const [formData, setFormData] = useState<ClientCreate>({
    nombre_completo: '',
    email: '',
    telefono: '',
    dni: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    notas: ''
  });

  useEffect(() => {
    if (client && isEdit) {
      setFormData({
        nombre_completo: client.nombre_completo,
        email: client.email || '',
        telefono: client.telefono,
        dni: client.dni || '',
        direccion: client.direccion || '',
        ciudad: client.ciudad || '',
        provincia: client.provincia || '',
        notas: client.notas || ''
      });
    }
  }, [client, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('ClientForm.handleSubmit - Datos del formulario:', formData);
    console.log('ClientForm.handleSubmit - Modo:', isEdit ? 'edición' : 'creación');
    
    if (isEdit && id) {
      console.log('ClientForm.handleSubmit - Actualizando cliente ID:', id);
      const result = await updateClient(id, formData as ClientUpdate);
      if (result) {
        console.log('ClientForm.handleSubmit - Actualización exitosa, navegando a:', `/clients/${id}`);
        navigate(`/clients/${id}`);
      } else {
        console.error('ClientForm.handleSubmit - La actualización falló');
      }
    } else {
      console.log('ClientForm.handleSubmit - Creando nuevo cliente');
      const result = await createClient(formData);
      if (result) {
        console.log('ClientForm.handleSubmit - Creación exitosa, navegando a /clients');
        navigate('/clients');
      } else {
        console.error('ClientForm.handleSubmit - La creación falló');
      }
    }
  };

  if (loadingClient && isEdit) return <div>Cargando cliente...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/clients')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Actualiza la información del cliente' : 'Registra un nuevo cliente'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre completo *</label>
            <input
              type="text"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Teléfono *</label>
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
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">DNI</label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ciudad</label>
            <input
              type="text"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Provincia</label>
            <input
              type="text"
              name="provincia"
              value={formData.provincia}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Notas</label>
            <textarea
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/clients')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
