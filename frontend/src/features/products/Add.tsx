import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Info,
  Package,
  DollarSign,
  Settings,
  Image,
  Save,
  Trash2,
  X,
  CheckCircle,
  Cloud,
  Plus,
  Tag,
  Layers,
  MapPin,
  Percent,
} from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Badge } from '@/shared/components/ui/badge'
import { MdBarcodeReader } from 'react-icons/md'
export default function StockAdd() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    itemName: '',
    sku: '',
    category: '',
    brand: '',
    initialQuantity: '',
    minStockLevel: '',
    storageLocation: '',
    purchaseCost: '',
    sellingPrice: '',
    tax: '',
  })
  const [compatibility, setCompatibility] = useState<string[]>([])
  const [compatibilityInput, setCompatibilityInput] = useState('')
  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }
  const addCompatibility = (device: string) => {
    const newDevice = device || compatibilityInput
    if (newDevice && !compatibility.includes(newDevice)) {
      setCompatibility([...compatibility, newDevice])
      setCompatibilityInput('')
    }
  }
  const removeCompatibility = (device: string) => {
    setCompatibility(compatibility.filter(d => d !== device))
  }
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCompatibility(compatibilityInput)
    }
  }
  const handleSubmit = (e: React.FormEvent, asDraft: boolean = false) => {
    e.preventDefault()
    console.log('Producto guardado:', { ...form, compatibility })
    alert('Producto guardado correctamente')
    navigate('/stock')
  }
  const categories = [
    { value: '', label: 'Seleccionar categoría' },
    { value: 'screens', label: 'Pantallas' },
    { value: 'batteries', label: 'Baterías' },
    { value: 'charging-ports', label: 'Puertos de carga' },
    { value: 'mainboards', label: 'Placas base' },
    { value: 'cameras', label: 'Cámaras' },
    { value: 'accessories', label: 'Accesorios' },
  ]
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Agregar producto</h1>
            <p className="text-sm text-muted-foreground">Completa los detalles del nuevo repuesto o producto.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/stock')} size="sm">
              Cancelar
            </Button>
            <Button onClick={(e) => handleSubmit(e, false)} size="sm">
              <Save size={16} className="mr-2" />
              Guardar
            </Button>
          </div>
        </div>
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4 pb-12">
          {/* Sección 1: Información General */}
          <motion.section
            variants={sectionVariants}
            custom={0}
            initial="hidden"
            animate="visible"
            className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
              <Info size={18} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground">Información general</h2>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label htmlFor="itemName" className="text-xs font-semibold">
                  Nombre del producto
                </Label>
                <Input
                  id="itemName"
                  value={form.itemName}
                  onChange={(e) => handleChange('itemName', e.target.value)}
                  placeholder="Ej. Pantalla OLED iPhone 13"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sku" className="text-xs font-semibold flex items-center gap-1">
                  <MdBarcodeReader size={14} className="text-muted-foreground" />
                  SKU
                </Label>
                <Input
                  id="sku"
                  value={form.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  placeholder="Ej. SCRN-IP13-001"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="category" className="text-xs font-semibold flex items-center gap-1">
                  <Layers size={14} className="text-muted-foreground" />
                  Categoría
                </Label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="brand" className="text-xs font-semibold flex items-center gap-1">
                  <Tag size={14} className="text-muted-foreground" />
                  Marca
                </Label>
                <Input
                  id="brand"
                  value={form.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                  placeholder="Ej. Apple OEM"
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </motion.section>
          {/* Sección 2: Detalles de inventario */}
          <motion.section
            variants={sectionVariants}
            custom={1}
            initial="hidden"
            animate="visible"
            className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
              <Package size={18} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground">Detalles de inventario</h2>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="initialQuantity" className="text-xs font-semibold">
                  Cantidad inicial
                </Label>
                <Input
                  id="initialQuantity"
                  type="number"
                  value={form.initialQuantity}
                  onChange={(e) => handleChange('initialQuantity', e.target.value)}
                  placeholder="0"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="minStockLevel" className="text-xs font-semibold">
                  Stock mínimo
                </Label>
                <Input
                  id="minStockLevel"
                  type="number"
                  value={form.minStockLevel}
                  onChange={(e) => handleChange('minStockLevel', e.target.value)}
                  placeholder="5"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="storageLocation" className="text-xs font-semibold flex items-center gap-1">
                  <MapPin size={14} className="text-muted-foreground" />
                  Ubicación
                </Label>
                <Input
                  id="storageLocation"
                  value={form.storageLocation}
                  onChange={(e) => handleChange('storageLocation', e.target.value)}
                  placeholder="Ej. Estante A-12"
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </motion.section>
          {/* Sección 3: Precios */}
          <motion.section
            variants={sectionVariants}
            custom={2}
            initial="hidden"
            animate="visible"
            className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
              <DollarSign size={18} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground">Precios</h2>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="purchaseCost" className="text-xs font-semibold">
                  Costo de compra ($)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input
                    id="purchaseCost"
                    value={form.purchaseCost}
                    onChange={(e) => handleChange('purchaseCost', e.target.value)}
                    placeholder="0.00"
                    className="h-9 pl-7 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="sellingPrice" className="text-xs font-semibold">
                  Precio de venta ($)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                  <Input
                    id="sellingPrice"
                    value={form.sellingPrice}
                    onChange={(e) => handleChange('sellingPrice', e.target.value)}
                    placeholder="0.00"
                    className="h-9 pl-7 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="tax" className="text-xs font-semibold flex items-center gap-1">
                  <Percent size={14} className="text-muted-foreground" />
                  Impuesto (%)
                </Label>
                <div className="relative">
                  <Input
                    id="tax"
                    value={form.tax}
                    onChange={(e) => handleChange('tax', e.target.value)}
                    placeholder="0"
                    className="h-9 pr-7 text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                </div>
              </div>
            </div>
          </motion.section>
          {/* Sección 4: Compatibilidad */}
          <motion.section
            variants={sectionVariants}
            custom={3}
            initial="hidden"
            animate="visible"
            className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
              <Settings size={18} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground">Compatibilidad</h2>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                Agrega los dispositivos compatibles con este repuesto:
              </p>
              <div className="flex flex-wrap gap-1.5 p-3 border-2 border-dashed border-border rounded-lg bg-muted/30 min-h-[48px] items-center">
                {compatibility.map((device) => (
                  <Badge
                    key={device}
                    variant="secondary"
                    className="px-2.5 py-1 text-xs font-medium flex items-center gap-1"
                  >
                    {device}
                    <button
                      type="button"
                      onClick={() => removeCompatibility(device)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
                <div className="flex items-center ml-1">
                  <input
                    value={compatibilityInput}
                    onChange={(e) => setCompatibilityInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-transparent border-none focus:ring-0 text-xs placeholder:text-muted-foreground p-1 outline-none min-w-[100px]"
                    placeholder="Escribe y Enter..."
                    type="text"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['iPhone 14', 'PS5', 'Nintendo Switch', 'iPad Pro'].map((device) => (
                  <Button
                    key={device}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addCompatibility(device)}
                    className="h-7 text-[10px] px-2.5"
                  >
                    <Plus size={12} className="mr-1" />
                    {device}
                  </Button>
                ))}
              </div>
            </div>
          </motion.section>
          {/* Sección 5: Imagen del producto */}
          <motion.section
            variants={sectionVariants}
            custom={4}
            initial="hidden"
            animate="visible"
            className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
              <Image size={18} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground">Imagen del producto</h2>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group relative aspect-video w-full rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all overflow-hidden p-4">
                <Cloud size={36} className="text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                <p className="text-xs font-medium text-muted-foreground text-center">Haz clic o arrastra</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">PNG, JPG hasta 10MB</p>
              </div>
              <div className="flex flex-col justify-center space-y-2">
                <h3 className="text-sm font-bold text-foreground">Recomendaciones:</h3>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-primary flex-shrink-0 mt-0.5" />
                    Foto nítida y de alta resolución sobre fondo blanco.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-primary flex-shrink-0 mt-0.5" />
                    Muestra todos los conectores y cables claramente.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-primary flex-shrink-0 mt-0.5" />
                    Incluye el empaque si los números de serie son visibles.
                  </li>
                </ul>
              </div>
            </div>
          </motion.section>
          {/* Botones de acción */}
          <motion.div
            variants={sectionVariants}
            custom={5}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border"
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => navigate('/stock')}
            >
              <Trash2 size={16} className="mr-1.5" />
              Descartar
            </Button>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => handleSubmit(e, true)}
              >
                Guardar borrador
              </Button>
              <Button type="submit" size="sm">
                <Save size={16} className="mr-1.5" />
                Publicar
              </Button>
            </div>
          </motion.div>
        </form>
      </div>
    </motion.div>
  )
}
