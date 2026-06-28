import React, { useState, useEffect } from 'react'
import { Plus, Cloud, Clock, Bell, Key, Smartphone, Laptop, Monitor, Gamepad2, Edit, Trash2, ChevronDown, Info, DollarSign, ChevronRight, Building2, AlertCircle, CheckCircle2, Ticket, Eye, RotateCcw, CreditCard, FileText } from 'lucide-react'
import { MdContentCopy, MdDelete, MdLink, MdEdit, MdCalendarToday, MdEmail, MdBarChart } from 'react-icons/md'
import PDFConfig from './PDFConfig'
import { BusinessInfoCard } from '@/features/business/BusinessInfoCard'
import { BusinessInfoForm } from '@/features/business/BusinessInfoForm'
import { useBusinessInfo, useBusinessInfoMutations } from '@/hooks/useBusinessInfo'
const sections = [
  { id: 'general', label: 'General', icon: <Cloud size={16} /> },
  { id: 'business', label: 'Información del negocio', icon: <Clock size={16} /> },
  { id: 'Categoria', label: 'Categorías de reparación', icon: <Plus size={16} /> },
  { id: 'taxes', label: 'Impuestos y pagos', icon: <Key size={16} /> },
  { id: 'notificationes', label: 'Notificaciones', icon: <Bell size={16} /> },
  { id: 'api', label: 'API e integraciones', icon: <Cloud size={16} /> },
  { id: 'pdf', label: 'Configuración PDF', icon: <FileText size={16} /> },
]
function LeftNav({ current, onChange }: { current: string; onChange: (id: string) => void }) {
  return (
    <aside className="w-64 pr-6 hidden lg:block">
      <div className="sticky top-6 space-y-4">
        <div className="text-sm font-semibold text-slate-700">CONFIGURACIÓN</div>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm divide-y">
          <div className="p-3">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => onChange(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors ${current === s.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'}`}>
                <div className="text-slate-400">{s.icon}</div>
                <div className="flex-1">{s.label}</div>
              </button>
            ))}
          </div>
          <div className="p-3">
            <div className="rounded bg-blue-50 p-3 text-sm text-blue-600">PLAN PRO<br/><span className="text-xs text-slate-500">Sin datos de uso disponibles</span></div>
          </div>
        </div>
      </div>
    </aside>
  )
}
export default function Settings() {
  const [section, setSection] = useState('general')
  const [isEditingBusiness, setIsEditingBusiness] = useState(false)
  const [generalForm, setGeneralForm] = useState({
    nombre_negocio: '',
    direccion: '',
    moneda: 'USD',
    formato_fecha: 'DD/MM/YYYY',
    zona_horaria: 'UTC-03:00'
  })
  
  const { data: businessInfo, loading, error, refetch } = useBusinessInfo()
  const { updateBusinessInfo, loading: mutationLoading } = useBusinessInfoMutations()
  
  // Cargar datos del negocio en el formulario general
  useEffect(() => {
    if (businessInfo) {
      setGeneralForm({
        nombre_negocio: businessInfo.nombre_negocio || '',
        direccion: businessInfo.direccion || '',
        moneda: 'USD',
        formato_fecha: 'DD/MM/YYYY',
        zona_horaria: 'UTC-03:00'
      })
    }
  }, [businessInfo])
  
  // Función para guardar cambios de la sección general
  const handleGeneralSave = async () => {
    try {
      // Validaciones básicas
      if (!generalForm.nombre_negocio.trim()) {
        alert('El nombre del negocio es requerido')
        return
      }
      
      const result = await updateBusinessInfo({
        nombre_negocio: generalForm.nombre_negocio,
        direccion: generalForm.direccion
      })
      
      if (result) {
        refetch()
        alert('Configuración general guardada correctamente')
      }
    } catch (error) {
      console.error('Error al guardar configuración general:', error)
      alert('Error al guardar la configuración')
    }
  }
  
  // Función para guardar otras secciones (placeholder)
  const handleSave = (sectionId: string) => {
    if (sectionId === 'general') {
      handleGeneralSave()
    } else {
      alert(`La sección ${sections.find(s => s.id === sectionId)?.label} aún no está implementada`)
    }
  }

  const handleBusinessEdit = async (data: any) => {
    const result = await updateBusinessInfo(data)
    if (result) {
      refetch()
      setIsEditingBusiness(false)
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto flex gap-6">
        <LeftNav current={section} onChange={setSection} />
        <main className="flex-1">
          {/* Header sin botones */}
          <div className="mb-6">
            {/* Eliminamos los botones del header */}
          </div>
          {/* Sections */}
          {section === 'general' && (
            <div className="space-y-6 pb-24">
              {/* Business Profile */}
              <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Perfil del negocio</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Identidad pública de tu taller</p>
                  </div>
                  <Info size={18} className="text-slate-400 cursor-help" />
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nombre del negocio *</label>
                      <input 
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white" 
                        type="text" 
                        placeholder="Ej. Reparaciones Tech"
                        value={generalForm.nombre_negocio}
                        onChange={(e) => setGeneralForm({...generalForm, nombre_negocio: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Dirección</label>
                      <textarea 
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white" 
                        rows={3} 
                        placeholder="Calle, ciudad, código postal, país"
                        value={generalForm.direccion}
                        onChange={(e) => setGeneralForm({...generalForm, direccion: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 bg-slate-50 dark:bg-slate-800/50">
                    <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                      <Cloud className="text-primary text-3xl" />
                    </div>
                    <p className="text-sm font-bold mb-1">Subir logo</p>
                    <p className="text-xs text-slate-500 text-center">PNG, JPG o SVG hasta 10MB. Recomendado 512x512px.</p>
                    <button className="mt-4 px-4 py-2 text-xs font-bold text-primary border border-primary/30 rounded-lg hover:bg-primary hover:text-white transition-all">Seleccionar archivo</button>
                  </div>
                </div>
              </section>
              {/* System Preferences */}
              <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Preferencias del sistema</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Localización y formato regional</p>
                  </div>
                  <Info size={18} className="text-slate-400" />
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Moneda</label>
                    <select className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white">
                      <option value="">Seleccionar moneda</option>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>JPY (¥)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Formato de fecha</label>
                    <select className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white">
                      <option value="">Seleccionar formato</option>
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Zona horaria</label>
                    <select className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white">
                      <option value="">Seleccionar zona</option>
                      <option>(UTC-08:00) Pacific Time</option>
                      <option>(UTC+00:00) London</option>
                      <option>(UTC+01:00) Paris</option>
                    </select>
                  </div>
                </div>
              </section>
              {/* Repair Statuses */}
              <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Estados de reparación</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Define tu ciclo de vida personalizado</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all">
                    <Plus size={14} /> Agregar estado
                  </button>
                </div>
                <div className="p-6">
                  <div className="text-center py-8 text-slate-500">
                    <p className="font-medium">No hay estados configurados</p>
                    <p className="text-xs">Agrega un estado para empezar a personalizar el flujo</p>
                  </div>
                </div>
              </section>
              {/* Payment Methods */}
              <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Métodos de pago aceptados</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Activa las opciones de pago disponibles durante el checkout</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                        <DollarSign className="text-slate-600 dark:text-slate-300" />
                      </div>
                      <div>
                        <p className="font-bold">Efectivo</p>
                        <p className="text-xs text-slate-500">Pagos estándar en mostrador</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                        <CreditCard className="text-slate-600 dark:text-slate-300" />
                      </div>
                      <div>
                        <p className="font-bold">Tarjeta de crédito/débito</p>
                        <p className="text-xs text-slate-500">Visa, Mastercard, AMEX vía terminal integrada</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                        <Building2 className="text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="font-bold">Transferencia bancaria</p>
                        <p className="text-xs text-slate-500">Pagos facturados para clientes corporativos</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </section>
              {/* 🔽 Botón Guardar al final de la sección */}
              <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => handleSave('general')}
                  disabled={mutationLoading}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mutationLoading ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          )}
          {section === 'business' && (
            <div className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-slate-500">Cargando información de la empresa...</div>
                </div>
              ) : error ? (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
                    <p className="font-semibold">No se pudo cargar la información</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md">
                    <p className="font-semibold">Modo offline</p>
                    <p className="text-sm mt-1">Puedes configurar la información del negocio manualmente. Los cambios se guardarán cuando tengas conexión.</p>
                  </div>
                  <BusinessInfoForm
                    businessInfo={{
                      id: '',
                      empresa_id: '',
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
                      },
                      fecha_creacion: new Date().toISOString(),
                      fecha_actualizacion: new Date().toISOString()
                    }}
                    onSubmit={handleBusinessEdit}
                    onCancel={() => setSection('general')}
                    loading={mutationLoading}
                  />
                </div>
              ) : businessInfo ? (
                isEditingBusiness ? (
                  <BusinessInfoForm
                    businessInfo={businessInfo}
                    onSubmit={handleBusinessEdit}
                    onCancel={() => setIsEditingBusiness(false)}
                    loading={mutationLoading}
                  />
                ) : (
                  <BusinessInfoCard
                    businessInfo={businessInfo}
                    onEdit={() => setIsEditingBusiness(true)}
                  />
                )
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
                    No hay información de la empresa configurada
                  </div>
                  <BusinessInfoForm
                    businessInfo={{
                      id: '',
                      empresa_id: '',
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
                      },
                      fecha_creacion: new Date().toISOString(),
                      fecha_actualizacion: new Date().toISOString()
                    }}
                    onSubmit={handleBusinessEdit}
                    onCancel={() => setSection('general')}
                    loading={mutationLoading}
                  />
                </div>
              )}
            </div>
          )}
          {section === 'Categoria' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Categorías de reparación</h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Gestiona los tipos de dispositivo y marcas admitidas.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                  <Plus size={18} /> Agregar categoría
                </button>
              </div>
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500">
                  <p className="font-medium">No hay categorías configuradas</p>
                  <p className="text-sm">Agrega tu primera categoría para empezar a organizar tus servicios</p>
                </div>
              </div>
              <div className="mt-6 p-6 bg-slate-900 dark:bg-slate-800 rounded-2xl text-white flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Categorías activas</p>
                    <p className="text-2xl font-black">0</p>
                  </div>
                  <div className="h-10 w-px bg-slate-700"></div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Marcas soportadas</p>
                    <p className="text-2xl font-black">0</p>
                  </div>
                  <div className="h-10 w-px bg-slate-700"></div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Modelos totales</p>
                    <p className="text-2xl font-black">0</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                  <Info size={18} className="text-primary flex-shrink-0" />
                  <p className="text-sm text-slate-300 max-w-xs">Define exactamente qué dispositivos acepta tu sistema para agilizar el proceso de admisión.</p>
                </div>
              </div>
              {/* 🔽 Botón Guardar al final de la sección */}
              <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => handleSave('Categoria')}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          )}
          {section === 'taxes' && (
            <div className="space-y-6 pb-24">
              {/* Tax Configuration */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Configuración de impuestos</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Ajustes globales de impuestos aplicados a pedidos</p>
                  </div>
                  <Info size={18} className="text-slate-400 cursor-help" />
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nombre del impuesto</label>
                    <input type="text" placeholder="Ej. IVA, VAT, Sales Tax" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tasa global (%)</label>
                    <div className="relative">
                      <input type="number" step="0.01" placeholder="0.00" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 pr-10 text-slate-900 dark:text-white" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Invoice Settings */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Configuración de facturas</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Personaliza la apariencia y numeración de tus facturas</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Prefijo personalizado</label>
                      <input type="text" placeholder="Ej. INV-" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Número inicial</label>
                      <input type="number" placeholder="1001" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Texto al pie de factura</label>
                    <textarea rows={3} placeholder="Gracias por confiar en nosotros. La garantía completa está disponible en nuestro sitio web." className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white" />
                  </div>
                </div>
              </div>
              {/* Payment Gateway Integrations */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Integraciones de pasarelas de pago</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Conecta servicios de terceros para aceptar pagos online</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-indigo-600 text-white font-bold px-3 py-1 rounded text-xs">Stripe</div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">Acepta Apple Pay, Google Pay y todas las tarjetas principales a nivel global.</p>
                    <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">Conectar cuenta <ChevronRight size={14} /></button>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-blue-600 text-white font-bold px-3 py-1 rounded text-xs">PayPal</div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">Permite a los clientes pagar con su saldo PayPal o cuentas bancarias vinculadas.</p>
                    <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">Conectar cuenta <ChevronRight size={14} /></button>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-black text-white font-bold px-3 py-1 rounded text-xs">Square</div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">Ideal para sincronizar con hardware Square POS en tu tienda física.</p>
                    <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">Conectar cuenta <ChevronRight size={14} /></button>
                  </div>
                </div>
              </div>
              {/* Saved Bank Accounts */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Cuentas bancarias guardadas</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Datos bancarios que aparecerán en facturas para transferencias manuales</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-sm">
                    <Plus size={14} /> Agregar cuenta
                  </button>
                </div>
                <div className="p-6">
                  <div className="text-center py-8 text-slate-500">
                    <p className="font-medium">No hay cuentas bancarias configuradas</p>
                    <p className="text-xs">Agrega una cuenta para mostrarla en tus facturas</p>
                  </div>
                </div>
              </div>
              {/* 🔽 Botón Guardar al final de la sección */}
              <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => handleSave('taxes')}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          )}
          {section === 'notificationes' && (
            <div className="space-y-6 pb-24">
              {/* Event Notifications */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notificaciones de eventos</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Configura qué eventos activan alertas a clientes</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Evento</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Email</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">SMS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {[
                        { name: 'Nuevo ticket creado', description: 'Se envía cuando se abre una nueva orden de reparación', icon: Ticket, color: 'blue' },
                        { name: 'Reparación finalizada', description: 'Se envía cuando el estado cambia a "Listo para recoger"', icon: CheckCircle2, color: 'green' },
                        { name: 'Pago vencido', description: 'Se envía cuando una factura permanece impagada después de la fecha de vencimiento', icon: AlertCircle, color: 'amber' }
                      ].map((event, idx) => {
                        const IconComponent = event.icon
                        const colorClasses = {
                          blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500',
                          green: 'bg-green-50 dark:bg-green-900/20 text-green-500',
                          amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-500'
                        }
                        return (
                          <tr key={idx}>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className={`size-8 ${colorClasses[event.color as keyof typeof colorClasses]} rounded flex items-center justify-center`}>
                                  <IconComponent size={20} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900 dark:text-white">{event.name}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">{event.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                              </label>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                              </label>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Template Editor */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Editor de plantillas</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Personaliza el contenido de tus mensajes automatizados</p>
                  </div>
                  <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option>Selecciona una plantilla</option>
                    <option>Nuevo ticket creado (Email)</option>
                    <option>Reparación finalizada (Email)</option>
                    <option>Pago vencido (SMS)</option>
                  </select>
                </div>
                <div className="p-6">
                  <div className="flex flex-col gap-6">
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Placeholders disponibles</p>
                      <div className="flex flex-wrap gap-2">
                        {['{customer_name}', '{ticket_id}', '{device_model}', '{repair_cost}', '{shop_name}'].map((placeholder, idx) => (
                          <span key={idx} className="px-2 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs font-mono text-primary cursor-pointer hover:bg-primary hover:text-white transition-colors">
                            {placeholder}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Asunto del email</label>
                      <input type="text" placeholder="Ej. Actualización de reparación: Ticket {ticket_id}" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Cuerpo del mensaje</label>
                      <textarea rows={8} placeholder="Escribe tu mensaje aquí..." className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white font-mono text-sm leading-relaxed" />
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">Los cambios aquí afectan solo a la plantilla seleccionada.</p>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center gap-1">
                      <Eye size={14} /> Previsualizar
                    </button>
                    <button className="px-4 py-2 text-xs font-bold text-primary border border-primary/30 rounded-lg hover:bg-primary hover:text-white transition-all flex items-center gap-1">
                      <RotateCcw size={14} /> Restaurar predeterminado
                    </button>
                  </div>
                </div>
              </div>
              {/* 🔽 Botón Guardar al final de la sección */}
              <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => handleSave('notificationes')}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          )}
          {section === 'api' && (
            <div className="space-y-6">
              {/* API Keys */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Claves API</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Autentica solicitudes a la API de TechRepair</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    <span>+</span> Generar nueva clave
                  </button>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-xs uppercase font-bold tracking-wider">
                      <tr>
                        <th className="px-6 py-3">Nombre</th>
                        <th className="px-6 py-3">Clave API</th>
                        <th className="px-6 py-3">Creada</th>
                        <th className="px-6 py-3">Último uso</th>
                        <th className="px-6 py-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                          <p className="font-medium">No hay claves API generadas</p>
                          <p className="text-xs">Crea tu primera clave para integrar con aplicaciones externas</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Webhooks */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Webhooks</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Envía datos de eventos en tiempo real a tus endpoints</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                    <MdLink size={16} /> Agregar endpoint
                  </button>
                </div>
                <div className="p-6">
                  <div className="text-center py-8 text-slate-500">
                    <p className="font-medium">No hay webhooks configurados</p>
                    <p className="text-xs">Agrega un endpoint para recibir notificaciones de eventos</p>
                  </div>
                </div>
              </div>
              {/* Third-Party Integrations */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Integraciones de terceros</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Conecta con plataformas y herramientas externas</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'WhatsApp Business API', icon: '💬', description: 'Envía notificaciones de estado y chatea con clientes desde el panel.' },
                    { name: 'Google Calendar', icon: <MdCalendarToday size={24} />, description: 'Sincroniza citas de reparación y plazos con los calendarios de tu equipo.' },
                    { name: 'Mailchimp', icon: <MdEmail size={24} />, description: 'Sincroniza automáticamente los emails de clientes para listas de marketing y seguimiento.' },
                    { name: 'QuickBooks Online', icon: <MdBarChart size={24} />, description: 'Sincroniza facturas, pagos y costes de inventario con tu software de contabilidad.' }
                  ].map((integration, idx) => (
                    <div key={idx} className="flex flex-col p-5 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/30 hover:border-primary/30 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="size-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 text-2xl">
                          {integration.icon}
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">No conectado</span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{integration.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6 leading-relaxed">{integration.description}</p>
                      <button className="mt-auto w-full py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/10">
                        Conectar cuenta
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {/* 🔽 Botón Guardar al final de la sección */}
              <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => handleSave('api')}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
            
          )}
          {section === 'pdf' && <PDFConfig />}
        </main>
      </div>
    </div>
  )
}
