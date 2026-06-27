import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Smartphone,
  Fingerprint,
  ShoppingCart,
  Tag,
  Camera,
  Upload,
  Info,
  Save,
  X,
  AlertCircle,
  Shield,  // ← AGREGAR ESTA LÍNEA
} from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
interface IPhoneFormData {
  model: string
  storage: string
  color: string
  condition: 'New' | 'Refurbished'
  imei1: string
  imei2: string
  serialNumber: string
  partNumber: string
  supplier: string
  purchaseDate: string
  purchaseCost: string
  retailPrice: string
  taxRate: string
}
export default function IPhoneInventory() {
  const navigate = useNavigate()  // ← AGREGAR ESTA LÍNEA
  const [formData, setFormData] = useState<IPhoneFormData>({
    model: 'iPhone 15 Pro Max',
    storage: '256 GB',
    color: 'Titanium Black',
    condition: 'New',
    imei1: '',
    imei2: '',
    serialNumber: '',
    partNumber: '',
    supplier: 'Apple Inc. Official',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchaseCost: '',
    retailPrice: '1199.00',
    taxRate: '8.5',
  })
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [autoSaveTime] = useState('14:24')
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const handleInputChange = (field: keyof IPhoneFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.model) newErrors.model = 'Selecciona un modelo'
    if (!formData.storage) newErrors.storage = 'Selecciona capacidad'
    if (!formData.imei1 || formData.imei1.length < 14) {
      newErrors.imei1 = 'IMEI inválido (15 dígitos)'
    }
    if (!formData.serialNumber) newErrors.serialNumber = 'Número de serie requerido'
    if (!formData.purchaseCost || parseFloat(formData.purchaseCost) <= 0) {
      newErrors.purchaseCost = 'Costo de compra inválido'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = () => {
    if (!validate()) return
    setIsSaving(true)
    setTimeout(() => {
      alert('Producto agregado al inventario')
      setIsSaving(false)
    }, 1500)
  }
  const calculatedMargin = formData.retailPrice && formData.purchaseCost
    ? (((parseFloat(formData.retailPrice) - parseFloat(formData.purchaseCost)) / parseFloat(formData.retailPrice)) * 100).toFixed(1)
    : '0.0'
  const projectedProfit = formData.retailPrice && formData.purchaseCost
    ? (parseFloat(formData.retailPrice) - parseFloat(formData.purchaseCost)).toFixed(2)
    : '0.00'
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setUploadedPhotos((prev) => [...prev, ev.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
    // Resetear el input para permitir seleccionar el mismo archivo de nuevo
    e.target.value = ''
  }
  const removePhoto = (index: number, e: React.MouseEvent) => {
    e.stopPropagation() // Evita que el clic llegue al label y abra el selector
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index))
  }
  const colors = [
    { name: 'Titanium Black', value: 'Titanium Black', class: 'bg-slate-800' },
    { name: 'Natural Titanium', value: 'Natural Titanium', class: 'bg-slate-200' },
    { name: 'Blue Titanium', value: 'Blue Titanium', class: 'bg-blue-200' },
    { name: 'White Titanium', value: 'White Titanium', class: 'bg-white' },
  ]
  const models = ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15']
  const storageOptions = ['128 GB', '256 GB', '512 GB', '1 TB']
  const suppliers = ['Apple Inc. Official', 'Tech Distribution Co.', 'Global Wholesale']
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Agregar iPhone al Inventario</h1>
            <p className="text-sm text-muted-foreground">Completa las especificaciones técnicas y financieras para el nuevo stock.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">Guardar borrador</Button>
            <Button onClick={handleSubmit} size="sm" disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Confirmar y agregar'}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Sección 1: Modelo y especificaciones */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <Smartphone size={18} className="text-primary" />
                  <h2 className="text-sm font-bold text-foreground">1. Modelo y especificaciones</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="model" className="text-xs font-semibold">Modelo</Label>
                    <select
                      id="model"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {models.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    {errors.model && (
                      <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.model}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="storage" className="text-xs font-semibold">Capacidad</Label>
                    <select
                      id="storage"
                      value={formData.storage}
                      onChange={(e) => handleInputChange('storage', e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {storageOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.storage && (
                      <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.storage}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Color</Label>
                    <div className="flex gap-2">
                      {colors.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => handleInputChange('color', c.value)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            formData.color === c.value
                              ? 'border-primary ring-2 ring-primary/30'
                              : 'border-border hover:border-primary/50'
                          }`}
                          style={{ backgroundColor: c.value.includes('White') ? '#f5f5f5' : undefined }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Condición</Label>
                    <div className="flex gap-2">
                      {['New', 'Refurbished'].map((cond) => (
                        <button
                          key={cond}
                          onClick={() => handleInputChange('condition', cond as 'New' | 'Refurbished')}
                          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg border transition-all ${
                            formData.condition === cond
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border text-muted-foreground hover:border-primary/40'
                          }`}
                        >
                          {cond === 'New' ? 'Nuevo' : 'Reacondicionado'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Sección 2: Identificación única */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <Fingerprint size={18} className="text-primary" />
                  <h2 className="text-sm font-bold text-foreground">2. Identificación única</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="imei1" className="text-xs font-semibold">IMEI 1</Label>
                    <Input
                      id="imei1"
                      value={formData.imei1}
                      onChange={(e) => handleInputChange('imei1', e.target.value)}
                      placeholder="15 dígitos"
                      className="h-9 text-sm"
                    />
                    {errors.imei1 && (
                      <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.imei1}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="imei2" className="text-xs font-semibold">IMEI 2 (eSIM)</Label>
                    <Input
                      id="imei2"
                      value={formData.imei2}
                      onChange={(e) => handleInputChange('imei2', e.target.value)}
                      placeholder="Opcional"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="serialNumber" className="text-xs font-semibold">Número de serie</Label>
                    <Input
                      id="serialNumber"
                      value={formData.serialNumber}
                      onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                      placeholder="Ej. G6TXXXXXXX"
                      className="h-9 text-sm"
                    />
                    {errors.serialNumber && (
                      <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.serialNumber}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="partNumber" className="text-xs font-semibold">Número de pieza (MPN)</Label>
                    <Input
                      id="partNumber"
                      value={formData.partNumber}
                      onChange={(e) => handleInputChange('partNumber', e.target.value)}
                      placeholder="Ej. MU7A3LL/A"
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Sección 3: Abastecimiento */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <ShoppingCart size={18} className="text-primary" />
                  <h2 className="text-sm font-bold text-foreground">3. Abastecimiento</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="supplier" className="text-xs font-semibold">Proveedor</Label>
                    <select
                      id="supplier"
                      value={formData.supplier}
                      onChange={(e) => handleInputChange('supplier', e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {suppliers.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="purchaseDate" className="text-xs font-semibold">Fecha de compra</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="purchaseCost" className="text-xs font-semibold">Costo de compra (USD)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                      <Input
                        id="purchaseCost"
                        type="number"
                        step="0.01"
                        value={formData.purchaseCost}
                        onChange={(e) => handleInputChange('purchaseCost', e.target.value)}
                        placeholder="0.00"
                        className="h-9 pl-7 text-sm"
                      />
                    </div>
                    {errors.purchaseCost && (
                      <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={12} /> {errors.purchaseCost}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Columna derecha (1/3) */}
          <div className="space-y-4">
            {/* Sección 4: Información de venta */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <Tag size={18} className="text-primary" />
                  <h2 className="text-sm font-bold text-foreground">4. Información de venta</h2>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="retailPrice" className="text-xs font-semibold">Precio de venta (SRP)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                      <Input
                        id="retailPrice"
                        type="number"
                        step="0.01"
                        value={formData.retailPrice}
                        onChange={(e) => handleInputChange('retailPrice', e.target.value)}
                        placeholder="0.00"
                        className="h-9 pl-7 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="taxRate" className="text-xs font-semibold">Impuesto (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      step="0.1"
                      value={formData.taxRate}
                      onChange={(e) => handleInputChange('taxRate', e.target.value)}
                      placeholder="0"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">Margen proyectado</span>
                      <span className="text-xs font-bold text-success">+{calculatedMargin}%</span>
                    </div>
                    <div className="text-xl font-bold text-foreground">${projectedProfit}</div>
                    <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${Math.min(Math.max(parseFloat(calculatedMargin) / 50 * 100, 0), 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Sección 5: Multimedia (CORREGIDA) */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <Camera size={18} className="text-primary" />
                  <h2 className="text-sm font-bold text-foreground">5. Multimedia</h2>
                </div>
                <div>
                  {/* Área de carga – solo este div abre el selector */}
                  <label
                    htmlFor="photo-upload"
                    className="block border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-all"
                  >
                    <Upload size={28} className="mx-auto text-muted-foreground/60 mb-1" />
                    <p className="text-xs font-medium text-muted-foreground">Suelta imágenes aquí</p>
                    <p className="text-[10px] text-muted-foreground">PNG, JPG hasta 10MB</p>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {/* Previsualización de fotos */}
                  {uploadedPhotos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {uploadedPhotos.map((photo, idx) => (
                        <div key={idx} className="aspect-square rounded-lg bg-muted border border-border overflow-hidden relative group">
                          <img src={photo} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={(e) => removePhoto(idx, e)}
                            className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-start gap-2 mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900/40">
                    <Info size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-blue-700 dark:text-blue-300">Asegura que IMEI y Serie sean visibles en al menos una foto.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Botón de acción final */}
                       {/* Botón de acción final */}
            <Button onClick={handleSubmit} className="w-full" disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Agregar al inventario'}
            </Button>
            <Button
              onClick={() => navigate('/stock/iphone-insurance')}
              variant="outline"
              className="w-full gap-2"
            >
              <Shield size={16} />
              Agregar seguro
            </Button>
            <p className="text-center text-[10px] text-muted-foreground">Último auto-guardado a las {autoSaveTime}</p> </div>
        </div>
      </div>
    </div>
  )
}
