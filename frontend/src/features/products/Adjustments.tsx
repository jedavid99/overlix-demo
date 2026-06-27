import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Download,
  Search,
  ChevronDown,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Package,
  AlertCircle,
  DollarSign,
  Filter,
  X,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Hash,
  Save,
  TrendingUp as TrendUp,
  TrendingDown as TrendDown,
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
interface AdjustmentItem {
  id: number
  productName: string
  productSku: string
  type: 'entry' | 'exit' | 'correction' | 'physical' | 'return'
  quantity: number
  reason: string
  notes?: string
  date: string
  user: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
}
// 📦 Datos de muestra ELIMINADOS – array vacío (conectar con API)
const adjustmentsData: AdjustmentItem[] = []
// Tipos de ajuste y estados para filtros
const adjustmentTypes = ['all', 'entry', 'exit', 'correction', 'physical', 'return']
const statusOptions = ['all', 'pending', 'approved', 'rejected', 'completed']
const typeLabels: Record<string, string> = {
  entry: 'Entrada',
  exit: 'Salida',
  correction: 'Corrección',
  physical: 'Inventario Físico',
  return: 'Devolución',
}
const typeColors: Record<string, string> = {
  entry: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  exit: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  correction: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  physical: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  return: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
}
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  approved: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
}
export default function Adjustments() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeType, setActiveType] = useState('all')
  const [activeStatus, setActiveStatus] = useState('all')
  const [loading, setLoading] = useState(false)
  // Estado del modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newAdjustment, setNewAdjustment] = useState({
    productName: '',
    productSku: '',
    type: 'entry' as AdjustmentItem['type'],
    quantity: 0,
    reason: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    user: 'Usuario actual', // Podrías obtener del contexto de autenticación
  })
  // Filtrar ajustes
  const filteredItems = useMemo(() => {
    return adjustmentsData.filter((item) => {
      const matchesSearch =
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = activeType === 'all' || item.type === activeType
      const matchesStatus = activeStatus === 'all' || item.status === activeStatus
      return matchesSearch && matchesType && matchesStatus
    })
  }, [searchTerm, activeType, activeStatus])
  // KPIs
  const totalAdjustments = adjustmentsData.length
  const totalEntries = adjustmentsData.filter((i) => i.type === 'entry').length
  const totalExits = adjustmentsData.filter((i) => i.type === 'exit').length
  const totalProductsAffected = new Set(adjustmentsData.map((i) => i.productName)).size
  const netQuantity = adjustmentsData.reduce((sum, i) => {
    if (i.type === 'entry' || i.type === 'return') return sum + i.quantity
    if (i.type === 'exit') return sum - i.quantity
    return sum // correction y physical no afectan el neto en este cálculo simplificado
  }, 0)
  const kpiData = [
    {
      label: 'Total ajustes',
      value: totalAdjustments,
      icon: Package,
      trend: 'Sin datos',
      trendUp: false,
      color: 'text-blue-600',
    },
    {
      label: 'Entradas',
      value: totalEntries,
      icon: TrendUp,
      trend: 'Sin datos',
      trendUp: true,
      color: 'text-emerald-600',
    },
    {
      label: 'Salidas',
      value: totalExits,
      icon: TrendDown,
      trend: 'Sin datos',
      trendUp: false,
      color: 'text-red-600',
    },
    {
      label: 'Productos afectados',
      value: totalProductsAffected,
      icon: Package,
      trend: 'Sin datos',
      trendUp: false,
      color: 'text-indigo-600',
    },
  ]
  // Manejadores del formulario modal
  const handleNewAdjustmentChange = (field: string, value: string | number) => {
    setNewAdjustment((prev) => ({ ...prev, [field]: value }))
  }
  const handleSaveAdjustment = () => {
    // Validación básica
    if (!newAdjustment.productName || !newAdjustment.type || newAdjustment.quantity === 0) {
      alert('Por favor completa los campos obligatorios: Producto, Tipo y Cantidad.')
      return
    }
    // Aquí iría la llamada a la API para guardar el ajuste
    console.log('Nuevo ajuste:', newAdjustment)
    alert('Ajuste guardado correctamente (simulado).')
    // Cerrar modal y resetear formulario
    setIsModalOpen(false)
    setNewAdjustment({
      productName: '',
      productSku: '',
      type: 'entry',
      quantity: 0,
      reason: '',
      notes: '',
      date: new Date().toISOString().split('T')[0],
      user: 'Usuario actual',
    })
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
  const getStatusBadge = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado',
      completed: 'Completado',
    }
    return (
      <span
        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[status]}`}
      >
        {labels[status] || status}
      </span>
    )
  }
  const getTypeBadge = (type: string) => {
    return (
      <span
        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${typeColors[type]}`}
      >
        {typeLabels[type] || type}
      </span>
    )
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Ajustes de Stock</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Registra y gestiona movimientos de inventario
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Exportar
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={16} className="mr-2" />
              Nuevo ajuste
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
              placeholder="Buscar por producto, SKU o motivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-background"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Tipo de ajuste */}
            <div className="flex items-center gap-1.5 bg-muted/30 rounded-lg p-1">
              <Badge
                variant={activeType === 'all' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => setActiveType('all')}
              >
                Todos
              </Badge>
              {adjustmentTypes.slice(1).map((type) => (
                <Badge
                  key={type}
                  variant={activeType === type ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={() => setActiveType(type)}
                >
                  {typeLabels[type]}
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
                    {status === 'pending' && 'Pendiente'}
                    {status === 'approved' && 'Aprobado'}
                    {status === 'rejected' && 'Rechazado'}
                    {status === 'completed' && 'Completado'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Limpiar filtros */}
            {(activeType !== 'all' || activeStatus !== 'all' || searchTerm) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-muted-foreground"
                onClick={() => {
                  setActiveType('all')
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
            <h3 className="text-lg font-semibold text-foreground mb-1">No hay ajustes</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              No se encontraron ajustes con los filtros actuales. Crea un nuevo ajuste de stock para
              registrar movimientos de inventario.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} className="mr-2" />
              Nuevo ajuste
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
                      Producto
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Motivo
                    </th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Fecha
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
                    {filteredItems.map((item, idx) => (
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
                          <div>
                            <p className="font-medium text-foreground">{item.productName}</p>
                            <p className="text-xs text-muted-foreground font-mono">{item.productSku}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">{getTypeBadge(item.type)}</td>
                        <td className="px-4 py-3.5 font-medium">
                          <span
                            className={
                              item.type === 'entry' || item.type === 'return'
                                ? 'text-emerald-600'
                                : item.type === 'exit'
                                ? 'text-red-600'
                                : 'text-foreground'
                            }
                          >
                            {item.type === 'entry' || item.type === 'return' ? '+' : '-'}
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground max-w-xs truncate">
                          {item.reason}
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-muted-foreground/60" />
                            {item.date}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">{getStatusBadge(item.status)}</td>
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
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-muted/10 border-t border-border text-xs text-muted-foreground">
              <span>
                Mostrando <strong className="text-foreground">{filteredItems.length}</strong> de{' '}
                <strong className="text-foreground">{adjustmentsData.length}</strong> ajustes
              </span>
              <span>Última actualización: Hoy a las {new Date().toLocaleTimeString()}</span>
            </div>
          </motion.div>
        )}
      </motion.div>
      {/* 🪟 MODAL PARA NUEVO AJUSTE */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Plus size={20} className="text-primary" />
              Nuevo ajuste de stock
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Producto */}
            <div className="space-y-2">
              <Label htmlFor="productName" className="text-sm font-semibold">
                Producto <span className="text-destructive">*</span>
              </Label>
              <Input
                id="productName"
                value={newAdjustment.productName}
                onChange={(e) => handleNewAdjustmentChange('productName', e.target.value)}
                placeholder="Ej. Pantalla iPhone 14 Pro"
              />
            </div>
            {/* SKU */}
            <div className="space-y-2">
              <Label htmlFor="productSku" className="text-sm font-semibold">
                SKU
              </Label>
              <Input
                id="productSku"
                value={newAdjustment.productSku}
                onChange={(e) => handleNewAdjustmentChange('productSku', e.target.value)}
                placeholder="Ej. SCR-IP14P-001"
              />
            </div>
            {/* Tipo de ajuste */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-semibold">
                Tipo de ajuste <span className="text-destructive">*</span>
              </Label>
              <select
                id="type"
                value={newAdjustment.type}
                onChange={(e) => handleNewAdjustmentChange('type', e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="entry">Entrada</option>
                <option value="exit">Salida</option>
                <option value="correction">Corrección</option>
                <option value="physical">Inventario Físico</option>
                <option value="return">Devolución</option>
              </select>
            </div>
            {/* Cantidad */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-semibold">
                Cantidad <span className="text-destructive">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                value={newAdjustment.quantity}
                onChange={(e) => handleNewAdjustmentChange('quantity', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            {/* Motivo */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm font-semibold">
                Motivo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="reason"
                value={newAdjustment.reason}
                onChange={(e) => handleNewAdjustmentChange('reason', e.target.value)}
                placeholder="Ej. Ajuste por inventario físico"
              />
            </div>
            {/* Fecha */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-semibold">
                Fecha
              </Label>
              <Input
                id="date"
                type="date"
                value={newAdjustment.date}
                onChange={(e) => handleNewAdjustmentChange('date', e.target.value)}
              />
            </div>
            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-semibold">
                Notas (opcional)
              </Label>
              <textarea
                id="notes"
                value={newAdjustment.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleNewAdjustmentChange('notes', e.target.value)
                }
                placeholder="Detalles adicionales..."
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAdjustment}>
              <Save size={16} className="mr-2" />
              Guardar ajuste
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
