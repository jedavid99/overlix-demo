import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Download,
  Search,
  ChevronDown,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Smartphone,
  Battery,
  Wrench,
  Package,
  AlertCircle,
  DollarSign,
  Filter,
  X,
  Edit,
  Trash2,
  Eye,
  Zap,
  Monitor,
  Cpu,
  Save,
} from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Label } from '@/shared/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
// Types
interface RepuestoItem {
  id: number
  name: string
  description: string
  sku: string
  category: string
  quantity: number
  status: string
  price: number
  compatibleWith: string[]
  icon: React.ElementType
  color: string
}
// 📦 Datos de muestra ELIMINADOS – array vacío (conectar con API)
const repuestosData: RepuestoItem[] = []
// Categorías y estados para filtros
const categories = ['all', 'pantallas', 'baterías', 'componentes', 'cables', 'ventiladores']
const statusOptions = ['all', 'good', 'low', 'out']
export default function Repuestos() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeStatus, setActiveStatus] = useState('all')
  const [loading, setLoading] = useState(false)
  // Estado del modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newRepuesto, setNewRepuesto] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: 0,
    price: 0,
    description: '',
    compatibleWith: [] as string[],
  })
  const [compatibilityInput, setCompatibilityInput] = useState('')
  // Filtrar repuestos
  const filteredItems = useMemo(() => {
    return repuestosData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        activeCategory === 'all' || item.category.toLowerCase() === activeCategory
      const matchesStatus =
        activeStatus === 'all' ||
        (activeStatus === 'good' && item.status === 'Good') ||
        (activeStatus === 'low' && item.status === 'Low') ||
        (activeStatus === 'out' && item.status === 'Out')
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [searchTerm, activeCategory, activeStatus])
  // KPIs (todos en 0 o valores genéricos)
  const totalItems = repuestosData.length
  const totalCategories = new Set(repuestosData.map((i) => i.category)).size
  const lowStockItems = repuestosData.filter((i) => i.quantity < 5 && i.quantity > 0).length
  const totalValue = repuestosData.reduce((sum, i) => sum + i.price * i.quantity, 0)
  // Helper para badge de estado
  const getStatusBadge = (status: string, quantity: number) => {
    if (quantity === 0) return { variant: 'destructive' as const, label: 'Agotado' }
    if (quantity < 5) return { variant: 'warning' as const, label: 'Bajo stock' }
    return { variant: 'success' as const, label: 'En stock' }
  }
  // Mapeo de colores por categoría
  const categoryColorMap: Record<string, string> = {
    Pantallas: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    Baterías: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
    Componentes: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    Cables: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    Ventiladores: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  }
  const kpiData = [
    {
      label: 'Repuestos totales',
      value: totalItems,
      icon: Package,
      trend: 'Sin datos',
      trendUp: false,
      color: 'text-blue-600',
    },
    {
      label: 'Categorías',
      value: totalCategories,
      icon: Filter,
      trend: 'Sin datos',
      trendUp: false,
      color: 'text-indigo-600',
    },
    {
      label: 'Stock bajo',
      value: lowStockItems,
      icon: AlertCircle,
      trend: 'Sin datos',
      trendUp: false,
      color: 'text-amber-600',
    },
    {
      label: 'Valor total',
      value: `$${totalValue.toFixed(2)}`,
      icon: DollarSign,
      trend: 'Sin datos',
      trendUp: false,
      color: 'text-emerald-600',
    },
  ]
  // Manejadores del formulario modal
  const handleNewRepuestoChange = (field: string, value: string | number) => {
    setNewRepuesto((prev) => ({ ...prev, [field]: value }))
  }
  const addCompatibility = (device: string) => {
    const newDevice = device || compatibilityInput
    if (newDevice && !newRepuesto.compatibleWith.includes(newDevice)) {
      setNewRepuesto((prev) => ({
        ...prev,
        compatibleWith: [...prev.compatibleWith, newDevice],
      }))
      setCompatibilityInput('')
    }
  }
  const removeCompatibility = (device: string) => {
    setNewRepuesto((prev) => ({
      ...prev,
      compatibleWith: prev.compatibleWith.filter((d) => d !== device),
    }))
  }
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addCompatibility(compatibilityInput)
    }
  }
  const handleSaveRepuesto = () => {
    // Validación básica
    if (!newRepuesto.name || !newRepuesto.sku || !newRepuesto.category) {
      alert('Por favor completa los campos obligatorios: Nombre, SKU y Categoría.')
      return
    }
    // Aquí iría la llamada a la API para guardar el repuesto
    console.log('Nuevo repuesto:', newRepuesto)
    alert('Repuesto guardado correctamente (simulado).')
    // Cerrar modal y resetear formulario
    setIsModalOpen(false)
    setNewRepuesto({
      name: '',
      sku: '',
      category: '',
      quantity: 0,
      price: 0,
      description: '',
      compatibleWith: [],
    })
    setCompatibilityInput('')
  }
  // Framer Motion variants
  const kpiContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }
  const kpiCardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
    hover: {
      y: -4,
      scale: 1.02,
      boxShadow: '0 12px 30px -8px rgba(0,0,0,0.15)',
      transition: { type: 'spring', stiffness: 400, damping: 15 },
    },
  }
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.04, duration: 0.25, ease: 'easeOut' },
    }),
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
  }
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Stock de Repuestos</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Gestiona tu inventario de piezas y componentes de reparación
            </p>
          </div>
          <div className="flex items-center gap-3">
           
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={16} className="mr-2" />
              Agregar repuesto
            </Button>
          </div>
        </div>
        {/* KPI Cards */}
        <motion.div
          variants={kpiContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {kpiData.map((kpi, idx) => {
            const Icon = kpi.icon
            return (
              <motion.div
                key={idx}
                variants={kpiCardVariants}
                whileHover="hover"
                className="h-full"
              >
                <Card className="border-border/60 shadow-sm h-full transition-colors duration-200 hover:border-primary/20">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {kpi.label}
                        </p>
                        <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                      </div>
                      <div className={`p-2 rounded-lg bg-muted/50 ${kpi.color}`}>
                        <Icon size={20} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3 text-xs">
                      {kpi.trend !== 'Sin datos' ? (
                        kpi.trendUp ? (
                          <>
                            <TrendingUp size={14} className="text-emerald-500" />
                            <span className="text-emerald-600">{kpi.trend}</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown size={14} className="text-muted-foreground" />
                            <span className="text-muted-foreground">{kpi.trend}</span>
                          </>
                        )
                      ) : (
                        <span className="text-muted-foreground/60 italic text-[10px]">
                          Sin datos disponibles
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
        {/* Filtros y búsqueda */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Buscar por nombre o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-background"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Categorías */}
            <div className="flex items-center gap-1.5 bg-muted/30 rounded-lg p-1">
              <Badge
                variant={activeCategory === 'all' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => setActiveCategory('all')}
              >
                Todos
              </Badge>
              {categories.slice(1).map((cat) => (
                <Badge
                  key={cat}
                  variant={activeCategory === cat ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/20 transition-colors flex items-center gap-1"
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === 'pantallas' && <Monitor size={12} />}
                  {cat === 'baterías' && <Battery size={12} />}
                  {cat === 'componentes' && <Cpu size={12} />}
                  {cat === 'cables' && <Zap size={12} />}
                  {cat === 'ventiladores' && <Wrench size={12} />}
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Badge>
              ))}
            </div>
            {/* Estado */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1.5">
                  <Filter size={14} />
                  Estado
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                {statusOptions.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setActiveStatus(status)}
                    className={activeStatus === status ? 'bg-primary/10' : ''}
                  >
                    {status === 'all' && 'Todos'}
                    {status === 'good' && 'En stock'}
                    {status === 'low' && 'Bajo stock'}
                    {status === 'out' && 'Agotado'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Limpiar filtros */}
            {(activeCategory !== 'all' || activeStatus !== 'all' || searchTerm) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-muted-foreground"
                onClick={() => {
                  setActiveCategory('all')
                  setActiveStatus('all')
                  setSearchTerm('')
                }}
              >
                <X size={14} className="mr-1" />
                Limpiar
              </Button>
            )}
          </div>
        </div>
        {/* Estado vacío */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4 border border-border rounded-lg">
                <Skeleton variant="rectangular" className="h-10 w-10 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="w-32 h-4" />
                  <Skeleton variant="text" className="w-48 h-3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16 bg-muted/10 rounded-xl border border-dashed border-border"
          >
            <Package size={56} className="mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No hay repuestos</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              No se encontraron repuestos con los filtros actuales. Prueba a ajustar tu búsqueda o
              agrega un nuevo repuesto.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} className="mr-2" />
              Agregar repuesto
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Repuesto
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <AnimatePresence mode="wait">
                    {filteredItems.map((item, idx) => {
                      const IconComponent = item.icon
                      const status = getStatusBadge(item.status, item.quantity)
                      const categoryColor =
                        categoryColorMap[item.category] || 'bg-muted text-muted-foreground'
                      return (
                        <motion.tr
                          key={item.id}
                          custom={idx}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="hover:bg-muted/30 transition-colors group"
                        >
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                <IconComponent size={18} />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{item.name}</p>
                                <p className="text-xs text-muted-foreground font-mono">{item.sku}</p>
                                {item.compatibleWith.length > 0 && (
                                  <div className="flex gap-1 mt-1 flex-wrap">
                                    {item.compatibleWith.slice(0, 2).map((device) => (
                                      <span
                                        key={device}
                                        className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground"
                                      >
                                        {device}
                                      </span>
                                    ))}
                                    {item.compatibleWith.length > 2 && (
                                      <span className="text-[10px] text-muted-foreground">
                                        +{item.compatibleWith.length - 2}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${categoryColor}`}
                            >
                              {item.category}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-medium">
                            <span
                              className={
                                item.quantity === 0
                                  ? 'text-destructive'
                                  : item.quantity < 5
                                  ? 'text-amber-600'
                                  : 'text-foreground'
                              }
                            >
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <Badge variant={status.variant} size="sm" className="font-medium">
                              {status.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem className="gap-2">
                                  <Eye size={14} /> Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2">
                                  <Edit size={14} /> Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 text-destructive">
                                  <Trash2 size={14} /> Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-muted/10 border-t border-border text-xs text-muted-foreground">
              <span>
                Mostrando <strong className="text-foreground">{filteredItems.length}</strong> de{' '}
                <strong className="text-foreground">{repuestosData.length}</strong> repuestos
              </span>
              <span>Última actualización: Hoy a las {new Date().toLocaleTimeString()}</span>
            </div>
          </motion.div>
        )}
      </motion.div>
      {/* 🪟 MODAL PARA AGREGAR REPUESTO */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Plus size={20} className="text-primary" />
              Agregar nuevo repuesto
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">
                Nombre del repuesto <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={newRepuesto.name}
                onChange={(e) => handleNewRepuestoChange('name', e.target.value)}
                placeholder="Ej. Pantalla OLED iPhone 14 Pro"
              />
            </div>
            {/* SKU */}
            <div className="space-y-2">
              <Label htmlFor="sku" className="text-sm font-semibold">
                SKU <span className="text-destructive">*</span>
              </Label>
              <Input
                id="sku"
                value={newRepuesto.sku}
                onChange={(e) => handleNewRepuestoChange('sku', e.target.value)}
                placeholder="Ej. SCR-IP14P-001"
              />
            </div>
            {/* Categoría */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold">
                Categoría <span className="text-destructive">*</span>
              </Label>
              <select
                id="category"
                value={newRepuesto.category}
                onChange={(e) => handleNewRepuestoChange('category', e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="">Seleccionar categoría</option>
                {categories.slice(1).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            {/* Cantidad y Precio */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-semibold">
                  Cantidad inicial
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newRepuesto.quantity}
                  onChange={(e) => handleNewRepuestoChange('quantity', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-semibold">
                  Precio ($)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newRepuesto.price}
                    onChange={(e) => handleNewRepuestoChange('price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
            {/* Descripción - usando textarea nativo para evitar errores de importación */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Descripción
              </Label>
              <textarea
                id="description"
                value={newRepuesto.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleNewRepuestoChange('description', e.target.value)
                }
                placeholder="Detalles adicionales del repuesto..."
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            {/* Compatibilidad */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Compatibilidad</Label>
              <div className="flex flex-wrap gap-2 p-3 border-2 border-dashed border-border rounded-lg bg-muted/30 min-h-[50px] items-center">
                {newRepuesto.compatibleWith.map((device) => (
                  <Badge
                    key={device}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm font-medium flex items-center gap-1.5"
                  >
                    {device}
                    <button
                      type="button"
                      onClick={() => removeCompatibility(device)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
                <div className="flex items-center ml-1">
                  <input
                    value={compatibilityInput}
                    onChange={(e) => setCompatibilityInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-muted-foreground p-1 outline-none min-w-[120px]"
                    placeholder="Escribe y presiona Enter..."
                    type="text"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {['iPhone 14', 'PS5', 'Nintendo Switch', 'iPad Pro'].map((device) => (
                  <Button
                    key={device}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addCompatibility(device)}
                    className="h-8 text-xs"
                  >
                    <Plus size={14} className="mr-1" />
                    Agregar {device}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveRepuesto}>
              <Save size={16} className="mr-2" />
              Guardar repuesto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
