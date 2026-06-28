import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, MapPin, Phone, Mail, Hash, MessageCircle } from 'lucide-react'
import { useClientMutations } from '@/hooks/useClients'
import { logger } from '@/utils/logger';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientCreateSchema, ClientCreateFormData } from '@/validations/client.validation';

export default function ClientAdd() {
  const navigate = useNavigate()
  const { createClient, loading, error } = useClientMutations()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientCreateFormData>({
    resolver: zodResolver(clientCreateSchema),
    defaultValues: {
      nombre_completo: '',
      telefono: '',
      email: '',
      dni: '',
      direccion: '',
      ciudad: '',
      provincia: '',
      notas: '',
    },
  })

  const onSubmit = async (data: ClientCreateFormData) => {
    logger.log('ClientAdd - Datos del formulario validados:', data)
    
    const result = await createClient(data)
    if (result) {
      logger.log('ClientAdd - Cliente creado exitosamente')
      navigate('/clients')
    } else {
      logger.error('ClientAdd - Error al crear cliente:', error)
    }
  }
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/clients" className="inline-flex items-center justify-center w-9 h-9 bg-white border rounded-md shadow-sm hover:bg-gray-50">
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
          </Link>
          <h2 className="text-2xl font-semibold">Nuevo Registro de Cliente</h2>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow p-6 border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-50 rounded-full text-emerald-600"><User size={16} /></div>
              <h3 className="font-medium">Datos Personales</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Nombre Completo *</label>
                <div className="relative">
                  <input 
                    {...register('nombre_completo')}
                    className={`w-full px-4 py-3 border rounded-lg bg-gray-50 ${errors.nombre_completo ? 'border-red-500' : ''}`} 
                    placeholder="Ej. Juan Pérez" 
                  />
                  {errors.nombre_completo && (
                    <p className="text-red-500 text-xs mt-1">{errors.nombre_completo.message}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-3 items-end">
  {/* Código de país fijo */}
  <div className="w-24 flex-shrink-0">
    <label className="block text-sm text-gray-600 mb-2">Código</label>
    <div className="px-3 py-3 border rounded-lg bg-gray-50 text-gray-700 font-medium text-center select-none">
      +54
    </div>
  </div>
  
  {/* Campo de teléfono */}
  <div className="flex-1">
    <label className="block text-sm text-gray-600 mb-2">Teléfono *</label>
    <input
      {...register('telefono')}
      className={`w-full px-4 py-3 border rounded-lg bg-gray-50 ${errors.telefono ? 'border-red-500' : ''}`}
      placeholder="000 000 000"
    />
    {errors.telefono && (
      <p className="text-red-500 text-xs mt-1">{errors.telefono.message}</p>
    )}
  </div>
</div>
             
              <div>
                <label className="block text-sm text-gray-600 mb-2">DNI</label>
                <input 
                  {...register('dni')}
                  className={`w-full px-4 py-3 border rounded-lg bg-gray-50 ${errors.dni ? 'border-red-500' : ''}`} 
                  placeholder="12345678X" 
                />
                {errors.dni && (
                  <p className="text-red-500 text-xs mt-1">{errors.dni.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Email</label>
                <input 
                  {...register('email')}
                  className={`w-full px-4 py-3 border rounded-lg bg-gray-50 ${errors.email ? 'border-red-500' : ''}`} 
                  placeholder="cliente@email.com" 
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>
          </section>
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-indigo-50 rounded-full text-indigo-600"><MapPin size={16} /></div>
              <h3 className="font-medium">Dirección y Facturación</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Calle / Dirección</label>
                <input 
                  {...register('direccion')}
                  className={`w-full px-4 py-3 border rounded-lg bg-gray-50 ${errors.direccion ? 'border-red-500' : ''}`} 
                  placeholder="Calle Principal 123" 
                />
                {errors.direccion && (
                  <p className="text-red-500 text-xs mt-1">{errors.direccion.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Ciudad</label>
                  <input 
                    {...register('ciudad')}
                    className={`w-full px-4 py-3 border rounded-lg bg-gray-50 ${errors.ciudad ? 'border-red-500' : ''}`} 
                    placeholder="Buenos Aires" 
                  />
                  {errors.ciudad && (
                    <p className="text-red-500 text-xs mt-1">{errors.ciudad.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Provincia</label>
                  <input 
                    {...register('provincia')}
                    className={`w-full px-4 py-3 border rounded-lg bg-gray-50 ${errors.provincia ? 'border-red-500' : ''}`} 
                    placeholder="Buenos Aires" 
                  />
                  {errors.provincia && (
                    <p className="text-red-500 text-xs mt-1">{errors.provincia.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Notas</label>
                <textarea 
                  {...register('notas')}
                  className={`w-full px-4 py-3 border rounded-lg bg-gray-50 ${errors.notas ? 'border-red-500' : ''}`} 
                  rows={3}
                  placeholder="Notas adicionales..."
                />
                {errors.notas && (
                  <p className="text-red-500 text-xs mt-1">{errors.notas.message}</p>
                )}
              </div>
            </div>
          </section>
        </div>
        <div className="mt-6 border-t pt-4">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="mt-6 flex items-center justify-end gap-3">
            <button type="button" onClick={() => navigate('/clients')} className="px-4 py-2 border rounded">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded shadow disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Guardando...' : 'Registrar Cliente'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
