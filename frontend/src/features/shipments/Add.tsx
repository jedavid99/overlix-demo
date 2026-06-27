import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Info, Phone, Tag, MapPin, Save, X, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Badge } from '@/shared/components/ui/badge'
export default function ProviderAdd() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    businessName: '',
    taxId: '',
    website: '',
    contactName: '',
    role: '',
    phone: '',
    email: '',
    categories: [] as string[],
    parts: [] as string[],
    address: '',
    city: '',
    postal: '',
    incoterms: 'DDP',
    leadTime: '2-3 Business Days',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }
  const toggleCategory = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }))
  }
  const handlePartsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value)
    setForm((prev) => ({ ...prev, parts: selectedOptions }))
  }
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.businessName.trim()) newErrors.businessName = 'El nombre del negocio es obligatorio'
    if (!form.contactName.trim()) newErrors.contactName = 'El nombre del contacto es obligatorio'
    if (!form.phone.trim()) newErrors.phone = 'El teléfono es obligatorio'
    if (!form.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Correo electrónico inválido'
    }
    if (!form.address.trim()) newErrors.address = 'La dirección es obligatoria'
    if (!form.city.trim()) newErrors.city = 'La ciudad es obligatoria'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    console.log('Proveedor guardado:', form)
    alert('Proveedor guardado correctamente')
    navigate('/providers')
  }
  const categories = ['Teléfonos', 'PCs / Portátiles', 'Consolas', 'Accesorios']
  const partOptions = [
    'Pantallas LCD / OLED',
    'Baterías de repuesto',
    'Puertos de carga',
    'Placas base',
    'Ventiladores internos',
    'Módulos de cámara',
    'Carcasa / Chasis',
    'Pasta térmica / Herramientas',
    'Cables flex',
    'Conectores',
  ]
  const incotermsOptions = ['DDP', 'EXW', 'FOB', 'CIF']
  const leadTimeOptions = ['Entrega al día siguiente', '2-3 días hábiles', '1 semana', '2+ semanas (Internacional)']
  const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.3, ease: 'easeOut' },
    }),
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Encabezado compacto */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Nuevo proveedor</h1>
            <p className="text-sm text-muted-foreground">Crea un perfil de proveedor para gestionar compras y reposición.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/providers')} size="sm">
              Cancelar
            </Button>
            <Button type="submit" onClick={handleSubmit} size="sm">
              <Save size={16} className="mr-2" />
              Guardar
            </Button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 pb-12">
          {/* Información básica */}
          <motion.section
            variants={sectionVariants}
            custom={0}
            initial="hidden"
            animate="visible"
            className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
              <Info size={18} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground">Información básica</h2>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-3 space-y-1">
                <Label htmlFor="businessName" className="text-xs font-semibold">
                  Nombre del negocio <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="businessName"
                  value={form.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                  placeholder="Ej. Soluciones Tecnológicas Globales"
                  className={`h-9 text-sm ${errors.businessName ? 'border-destructive' : ''}`}
                />
                {errors.businessName && (
                  <p className="text-[10px] text-destructive flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.businessName}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="taxId" className="text-xs font-semibold">NIF / CIF</Label>
                <Input
                  id="taxId"
                  value={form.taxId}
                  onChange={(e) => handleChange('taxId', e.target.value)}
                  placeholder="XX-123456789"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="website" className="text-xs font-semibold">Sitio web</Label>
                <Input
                  id="website"
                  value={form.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://www.proveedor.com"
                  type="url"
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </motion.section>
          {/* Contacto principal */}
          <motion.section
            variants={sectionVariants}
            custom={1}
            initial="hidden"
            animate="visible"
            className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
              <Phone size={18} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground">Contacto principal</h2>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="contactName" className="text-xs font-semibold">
                  Nombre del contacto <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactName"
                  value={form.contactName}
                  onChange={(e) => handleChange('contactName', e.target.value)}
                  placeholder="Juan Pérez"
                  className={`h-9 text-sm ${errors.contactName ? 'border-destructive' : ''}`}
                />
                {errors.contactName && (
                  <p className="text-[10px] text-destructive flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.contactName}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="role" className="text-xs font-semibold">Cargo / Puesto</Label>
                <Input
                  id="role"
                  value={form.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  placeholder="Gerente de Cuentas"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs font-semibold">
                  Teléfono directo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+34 600 000 000"
                  className={`h-9 text-sm ${errors.phone ? 'border-destructive' : ''}`}
                />
                {errors.phone && (
                  <p className="text-[10px] text-destructive flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.phone}
                  </p>
                )}
              </div>
              <div className="md:col-span-3 space-y-1">
                <Label htmlFor="email" className="text-xs font-semibold">
                  Correo electrónico <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="juan@proveedor.com"
                  type="email"
                  className={`h-9 text-sm ${errors.email ? 'border-destructive' : ''}`}
                />
                {errors.email && (
                  <p className="text-[10px] text-destructive flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.email}
                  </p>
                )}
              </div>
            </div>
          </motion.section>
          {/* Categorías y piezas */}
          <motion.section
            variants={sectionVariants}
            custom={2}
            initial="hidden"
            animate="visible"
            className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
              <Tag size={18} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground">Categorías y piezas</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <Label className="text-xs font-semibold block mb-2">Categorías de suministro</Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <label
                      key={cat}
                      className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg cursor-pointer transition-all text-sm ${
                        form.categories.includes(cat)
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      <input
                        checked={form.categories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                        type="checkbox"
                      />
                      <span className="font-medium">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="parts" className="text-xs font-semibold block mb-1.5">
                  Piezas específicas que suministra
                </Label>
                <select
                  id="parts"
                  multiple
                  value={form.parts}
                  onChange={handlePartsChange}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px]"
                >
                  {partOptions.map((part) => (
                    <option key={part} value={part}>{part}</option>
                  ))}
                </select>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  Mantén <kbd className="px-1 py-0.5 bg-muted rounded text-[10px] font-mono">Ctrl</kbd> o <kbd className="px-1 py-0.5 bg-muted rounded text-[10px] font-mono">⌘</kbd> para seleccionar múltiples.
                </p>
                {form.parts.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.parts.map((part) => (
                      <Badge key={part} variant="secondary" className="text-xs px-2 py-0.5">
                        {part}
                        <button
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              parts: prev.parts.filter((p) => p !== part),
                            }))
                          }}
                          className="ml-1 hover:text-destructive transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.section>
          {/* Dirección y envío */}
          <motion.section
            variants={sectionVariants}
            custom={3}
            initial="hidden"
            animate="visible"
            className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
              <MapPin size={18} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground">Dirección y envío</h2>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-3 space-y-1">
                <Label htmlFor="address" className="text-xs font-semibold">
                  Dirección <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Calle, número, parque industrial"
                  className={`h-9 text-sm ${errors.address ? 'border-destructive' : ''}`}
                />
                {errors.address && (
                  <p className="text-[10px] text-destructive flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.address}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="city" className="text-xs font-semibold">
                  Ciudad <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Madrid"
                  className={`h-9 text-sm ${errors.city ? 'border-destructive' : ''}`}
                />
                {errors.city && (
                  <p className="text-[10px] text-destructive flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.city}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="postal" className="text-xs font-semibold">Código postal</Label>
                <Input
                  id="postal"
                  value={form.postal}
                  onChange={(e) => handleChange('postal', e.target.value)}
                  placeholder="28001"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="incoterms" className="text-xs font-semibold">Términos de envío</Label>
                <select
                  id="incoterms"
                  value={form.incoterms}
                  onChange={(e) => handleChange('incoterms', e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  {incotermsOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="leadTime" className="text-xs font-semibold">Tiempo de entrega</Label>
                <select
                  id="leadTime"
                  value={form.leadTime}
                  onChange={(e) => handleChange('leadTime', e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  {leadTimeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.section>
          {/* Botones de acción */}
          <motion.div
            variants={sectionVariants}
            custom={4}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-border"
          >
            <Button variant="outline" onClick={() => navigate('/providers')} size="sm">
              Cancelar
            </Button>
            <Button type="submit" size="sm">
              <Save size={16} className="mr-2" />
              Guardar proveedor
            </Button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  )
}
