import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, MapPin, Phone, Mail, Hash, MessageCircle } from 'lucide-react'
import { useClientMutations } from '@/hooks/useClients'

export default function ClientAdd() {
  const navigate = useNavigate()
  const { createClient, loading, error } = useClientMutations()
  const [form, setForm] = useState({
    name: '', phoneCode: '+34', phone: '', email: '', dni: '', address: '', city: '', zip: '', notes: '', whatsapp: true,
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const val = (type === 'checkbox') ? (e.target as HTMLInputElement).checked : value
    setForm({ ...form, [name]: val })
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('ClientAdd - Datos del formulario:', form)
    
    // Mapear campos del formulario al formato del backend
    const clientData = {
      nombre_completo: form.name,
      telefono: form.phone,
      email: form.email || undefined,
      dni: form.dni || undefined,
      direccion: form.address || undefined,
      ciudad: form.city || undefined,
      provincia: form.city || undefined, // Usando city como provincia por ahora
      notas: form.notes || undefined
    }
    
    console.log('ClientAdd - Datos a enviar al backend:', clientData)
    
    const result = await createClient(clientData)
    if (result) {
      console.log('ClientAdd - Cliente creado exitosamente')
      navigate('/clients')
    } else {
      console.error('ClientAdd - Error al crear cliente:', error)
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
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-50 rounded-full text-emerald-600"><User size={16} /></div>
              <h3 className="font-medium">Datos Personales</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Nombre Completo</label>
                <div className="relative">
                  <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg bg-gray-50" placeholder="Ej. Juan Pérez" />
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
    <label className="block text-sm text-gray-600 mb-2">Teléfono</label>
    <input
      name="phone"
      value={form.phone}
      onChange={handleChange}
      className="w-full px-4 py-3 border rounded-lg bg-gray-50"
      placeholder="000 000 000"
    />
  </div>
</div>
             
              <div>
                <label className="block text-sm text-gray-600 mb-2">DNI </label>
                <input name="dni" value={form.dni} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg bg-gray-50" placeholder="12345678X" />
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
                <input name="address" value={form.address} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg bg-gray-50" placeholder="Calle Principal 123" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Provicia</label>
                  <input name="city" value={form.city} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg bg-gray-50" placeholder="Buenos Aires" />
                </div>
                
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
            <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded shadow disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Guardando...' : 'Registrar Cliente'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
