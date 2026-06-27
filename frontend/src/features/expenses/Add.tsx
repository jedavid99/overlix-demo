import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Info, CreditCard, Cloud, Save, X, AlertCircle, LucideBanknote, Landmark } from 'lucide-react'
import { MdAdd, MdCreditCard, MdAttachFile } from 'react-icons/md'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Badge } from '@/shared/components/ui/badge'
export default function ExpensesAdd() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    amount: '',
    currency: 'USD',
    date: '',
    category: '',
    supplier: '',
    paymentMethod: 'cash',
  })
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.title.trim()) newErrors.title = 'La descripción es obligatoria'
    if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = 'El monto debe ser mayor a 0'
    if (!form.date) newErrors.date = 'La fecha es obligatoria'
    if (!form.category) newErrors.category = 'La categoría es obligatoria'
    if (!form.supplier) newErrors.supplier = 'El proveedor es obligatorio'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Gasto guardado:', { ...form, file })
    alert('Gasto registrado correctamente')
    setIsLoading(false)
    navigate('/expenses')
  }
  const categories = [
    { value: 'spare_parts', label: 'Repuestos' },
    { value: 'utilities', label: 'Servicios' },
    { value: 'rent', label: 'Alquiler' },
    { value: 'salaries', label: 'Salarios' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'other', label: 'Otros' },
  ]
  const suppliers = [
    { value: '1', label: 'Logística Global S.A.' },
    { value: '2', label: 'Propiedades Main Street' },
    { value: '3', label: 'Tech Supplies Co.' },
    { value: '4', label: 'Red Eléctrica' },
  ]
  const currencies = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'JPY', label: 'JPY' },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Encabezado compacto */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Nuevo gasto</h1>
            <p className="text-sm text-muted-foreground">Registra una nueva transacción para el control de costos.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/expenses')} size="sm">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} size="sm" disabled={isLoading}>
              {isLoading ? (
                <span className="animate-spin mr-2">⟳</span>
              ) : (
                <Save size={16} className="mr-2" />
              )}
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tarjeta única con todos los campos */}
          <Card>
            <CardContent className="p-4 md:p-6 space-y-5">
              {/* Fila 1: Título + Categoría + Proveedor */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="col-span-1 space-y-1">
                  <Label htmlFor="title" className="text-xs font-semibold">
                    Descripción <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Ej. Alquiler mensual"
                    className={`h-9 text-sm ${errors.title ? 'border-destructive' : ''}`}
                  />
                  {errors.title && (
                    <p className="text-[10px] text-destructive flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.title}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="category" className="text-xs font-semibold">
                    Categoría <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className={`w-full h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.category ? 'border-destructive' : ''}`}
                  >
                    <option value="">Seleccionar</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-[10px] text-destructive flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.category}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="supplier" className="text-xs font-semibold">
                    Proveedor <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-1">
                    <select
                      id="supplier"
                      value={form.supplier}
                      onChange={(e) => handleChange('supplier', e.target.value)}
                      className={`flex-1 h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.supplier ? 'border-destructive' : ''}`}
                    >
                      <option value="">Seleccionar</option>
                      {suppliers.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                    <button type="button" className="h-9 px-3 rounded-lg border border-input bg-muted/30 hover:bg-muted flex items-center text-primary text-xs font-medium">
                      <MdAdd size={16} />
                    </button>
                  </div>
                  {errors.supplier && (
                    <p className="text-[10px] text-destructive flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.supplier}
                    </p>
                  )}
                </div>
              </div>
              {/* Fila 2: Monto + Moneda + Fecha + Método de pago */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="amount" className="text-xs font-semibold">
                    Monto <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={form.amount}
                      onChange={(e) => handleChange('amount', e.target.value)}
                      placeholder="0.00"
                      className={`h-9 pl-7 text-sm ${errors.amount ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-[10px] text-destructive flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.amount}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="currency" className="text-xs font-semibold">Moneda</Label>
                  <select
                    id="currency"
                    value={form.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    {currencies.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="date" className="text-xs font-semibold">
                    Fecha <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className={`h-9 text-sm ${errors.date ? 'border-destructive' : ''}`}
                  />
                  {errors.date && (
                    <p className="text-[10px] text-destructive flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.date}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Método de pago</Label>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { value: 'cash', label: 'Efectivo', icon: <LucideBanknote size={16} /> },
                      { value: 'card', label: 'Tarjeta', icon: <MdCreditCard size={16} /> },
                      { value: 'bank', label: 'Transferencia', icon: <Landmark size={16} /> },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`
                          flex flex-col items-center justify-center gap-0.5 p-1.5 border rounded-lg cursor-pointer transition-all text-xs
                          ${form.paymentMethod === method.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/40 hover:bg-muted/30'}
                        `}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={form.paymentMethod === method.value}
                          onChange={() => handleChange('paymentMethod', method.value)}
                          className="sr-only"
                        />
                        <span className="text-base">{method.icon}</span>
                        <span className="font-medium">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              {/* Fila 3: Adjuntar comprobante (más compacto) */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-3">
                  <Cloud size={18} className="text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">Comprobante</span>
                  <label
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed rounded-lg cursor-pointer
                      transition-all hover:border-primary/50 hover:bg-muted/20 text-sm
                      ${file ? 'border-primary/50 bg-muted/20' : 'border-border'}
                    `}
                  >
                    <Cloud size={18} className="text-muted-foreground/60" />
                    <span className="text-muted-foreground">
                      {file ? file.name : 'Subir factura o recibo (PNG, JPG, PDF)'}
                    </span>
                    <input
                      onChange={handleFileChange}
                      className="hidden"
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf"
                    />
                  </label>
                  {file && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setFile(null)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
                {file && (
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <MdAttachFile size={14} />
                    <span>{file.name}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {(file.size / 1024).toFixed(1)} KB
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Botones de acción (ya están en el header, pero mantenemos uno al final para consistencia) */}
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="outline" onClick={() => navigate('/expenses')} size="sm">
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={isLoading}>
              {isLoading ? (
                <span className="animate-spin mr-2">⟳</span>
              ) : (
                <Save size={16} className="mr-2" />
              )}
              {isLoading ? 'Guardando...' : 'Guardar gasto'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}
