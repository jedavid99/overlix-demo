import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield,
  Smartphone,
  Calendar,
  DollarSign,
  FileText,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Info,
} from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Badge } from '@/shared/components/ui/badge'
interface InsuranceFormData {
  imei: string
  serialNumber: string
  model: string
  insuranceProvider: string
  policyNumber: string
  coverageType: 'screen' | 'theft' | 'full' | 'custom'
  startDate: string
  endDate: string
  premium: string
  deductible: string
  coverageAmount: string
  notes: string
}
export default function IPhoneInsurance() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<InsuranceFormData>({
    imei: '',
    serialNumber: '',
    model: '',
    insuranceProvider: '',
    policyNumber: '',
    coverageType: 'full',
    startDate: '',
    endDate: '',
    premium: '',
    deductible: '',
    coverageAmount: '',
    notes: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const handleInputChange = (field: keyof InsuranceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.imei || formData.imei.length < 14) {
      newErrors.imei = 'IMEI inválido (15 dígitos)'
    }
    if (!formData.serialNumber) {
      newErrors.serialNumber = 'Número de serie requerido'
    }
    if (!formData.model) {
      newErrors.model = 'Selecciona un modelo'
    }
    if (!formData.insuranceProvider) {
      newErrors.insuranceProvider = 'Proveedor requerido'
    }
    if (!formData.policyNumber) {
      newErrors.policyNumber = 'Número de póliza requerido'
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Fecha de inicio requerida'
    }
    if (!formData.endDate) {
      newErrors.endDate = 'Fecha de fin requerida'
    }
    if (!formData.premium || parseFloat(formData.premium) <= 0) {
      newErrors.premium = 'Prima inválida'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = () => {
    if (!validate()) return
    setIsSaving(true)
    setTimeout(() => {
      alert('Seguro agregado correctamente')
      setIsSaving(false)
      navigate('/products/inventory')
    }, 1500)
  }
  const models = ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14']
  const providers = ['AppleCare+', 'Asurion', 'SquareTrade', 'Seguros Atlas', 'Seguros Sura', 'Otro']
  const coverageTypes = [
    { value: 'screen', label: 'Pantalla', description: 'Rotura de pantalla' },
    { value: 'theft', label: 'Robo', description: 'Robo del dispositivo' },
    { value: 'full', label: 'Completo', description: 'Daños y robo' },
    { value: 'custom', label: 'Personalizado', description: 'Cobertura a medida' },
  ]
  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return '—'
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)
    if (years > 0) return `${years} año(s)`
    if (months > 0) return `${months} mes(es)`
    return `${diffDays} días`
  }
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Agregar Seguro de iPhone</h1>
            <p className="text-sm text-muted-foreground">Registra la información del seguro del dispositivo</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/iphone/insurance')}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} size="sm" disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar seguro'}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Información del dispositivo */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <Smartphone size={16} className="text-primary" />
                  <h2 className="text-sm font-bold text-foreground">Información del Dispositivo</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="imei" className="text-xs font-semibold">IMEI *</Label>
                    <Input
                      id="imei"
                      value={formData.imei}
                      onChange={(e) => handleInputChange('imei', e.target.value)}
                      placeholder="15 dígitos"
                      className="h-8 text-sm"
                    />
                    {errors.imei && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.imei}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="serialNumber" className="text-xs font-semibold">Número de Serie *</Label>
                    <Input
                      id="serialNumber"
                      value={formData.serialNumber}
                      onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                      placeholder="Ej. G6TXXXXXXX"
                      className="h-8 text-sm"
                    />
                    {errors.serialNumber && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.serialNumber}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="model" className="text-xs font-semibold">Modelo *</Label>
                    <select
                      id="model"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      className="w-full h-8 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Seleccionar</option>
                      {models.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    {errors.model && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.model}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Información del seguro */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <Shield size={16} className="text-primary" />
                  <h2 className="text-sm font-bold text-foreground">Información del Seguro</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="insuranceProvider" className="text-xs font-semibold">Proveedor *</Label>
                    <select
                      id="insuranceProvider"
                      value={formData.insuranceProvider}
                      onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                      className="w-full h-8 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Seleccionar</option>
                      {providers.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    {errors.insuranceProvider && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.insuranceProvider}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="policyNumber" className="text-xs font-semibold">Número de Póliza *</Label>
                    <Input
                      id="policyNumber"
                      value={formData.policyNumber}
                      onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                      placeholder="Ej. POL-123456789"
                      className="h-8 text-sm"
                    />
                    {errors.policyNumber && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.policyNumber}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Tipo de Cobertura</Label>
                    <select
                      value={formData.coverageType}
                      onChange={(e) => handleInputChange('coverageType', e.target.value)}
                      className="w-full h-8 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {coverageTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Grid de coberturas (versión compacta) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {coverageTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleInputChange('coverageType', type.value as any)}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        formData.coverageType === type.value
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-0.5">
                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                          formData.coverageType === type.value ? 'border-primary bg-primary' : 'border-border'
                        }`}>
                          {formData.coverageType === type.value && <CheckCircle size={8} className="text-white" />}
                        </div>
                        <span className="text-xs font-semibold">{type.label}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{type.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Fechas y montos */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <Calendar size={16} className="text-primary" />
                  <h2 className="text-sm font-bold text-foreground">Fechas y Montos</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="startDate" className="text-xs font-semibold">Inicio *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="h-8 text-sm"
                    />
                    {errors.startDate && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.startDate}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="endDate" className="text-xs font-semibold">Fin *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="h-8 text-sm"
                    />
                    {errors.endDate && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.endDate}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="premium" className="text-xs font-semibold">Prima Anual ($) *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                      <Input
                        id="premium"
                        type="number"
                        step="0.01"
                        value={formData.premium}
                        onChange={(e) => handleInputChange('premium', e.target.value)}
                        placeholder="0.00"
                        className="h-8 pl-7 text-sm"
                      />
                    </div>
                    {errors.premium && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.premium}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="deductible" className="text-xs font-semibold">Deducible ($)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                      <Input
                        id="deductible"
                        type="number"
                        step="0.01"
                        value={formData.deductible}
                        onChange={(e) => handleInputChange('deductible', e.target.value)}
                        placeholder="0.00"
                        className="h-8 pl-7 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor="coverageAmount" className="text-xs font-semibold">Cobertura Máxima ($) *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                      <Input
                        id="coverageAmount"
                        type="number"
                        step="0.01"
                        value={formData.coverageAmount}
                        onChange={(e) => handleInputChange('coverageAmount', e.target.value)}
                        placeholder="0.00"
                        className="h-8 pl-7 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Notas adicionales */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <FileText size={16} className="text-primary" />
                  <h2 className="text-sm font-bold text-foreground">Notas Adicionales</h2>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="notes" className="text-xs font-semibold">Observaciones</Label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={2}
                    placeholder="Detalles adicionales sobre el seguro..."
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Columna derecha (1/3) – Resumen */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <Shield size={16} className="text-primary" />
                  <h2 className="text-sm font-bold text-foreground">Resumen</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Duración</span>
                    <Badge variant="outline" className="text-xs font-mono">
                      {calculateDuration()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Costo mensual</span>
                    <span className="text-sm font-bold text-success">
                      {formData.premium ? `$${(parseFloat(formData.premium) / 12).toFixed(2)}` : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Cobertura</span>
                    <span className="text-xs font-medium">
                      {coverageTypes.find((t) => t.value === formData.coverageType)?.label || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Deducible</span>
                    <span className="text-xs font-medium">
                      {formData.deductible ? `$${formData.deductible}` : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">Prima anual</span>
                    <span className="text-sm font-bold text-foreground">
                      {formData.premium ? `$${formData.premium}` : '—'}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/40">
                  <Info size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-blue-700 dark:text-blue-300">
                    Guarda el número de póliza y contacto del proveedor para futuras reclamaciones.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Button onClick={handleSubmit} className="w-full" disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar seguro'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
