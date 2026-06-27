import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Tag,
  DollarSign,
  FolderOpen,
  Package,
  CreditCard,
  Home,
  Wrench,
  Zap,
} from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
interface Category {
  id: string
  name: string
  description: string
  type: 'income' | 'expense'
  status: 'active' | 'inactive'
  icon: string
  expenseCount: number
  totalAmount: number
}
export default function Categories() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  // 📦 Datos vacíos – conectar con API real
  const categories: Category[] = []
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'expense' as 'income' | 'expense',
    status: 'active' as 'active' | 'inactive',
    icon: 'Tag',
  })
  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || cat.status === statusFilter
    const matchesType = typeFilter === 'all' || cat.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
  // KPIs
  const totalCategories = categories.length
  const activeCategories = categories.filter((c) => c.status === 'active').length
  const inactiveCategories = categories.filter((c) => c.status === 'inactive').length
  const totalExpenses = categories.reduce((sum, c) => sum + c.totalAmount, 0)
  const kpiData = [
    {
      label: 'Total Categorías',
      value: totalCategories,
      icon: FolderOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Categorías Activas',
      value: activeCategories,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Categorías Inactivas',
      value: inactiveCategories,
      icon: AlertCircle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Gastos Asociados',
      value: `$${totalExpenses.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
  ]
  const iconOptions = [
    { value: 'Tag', icon: Tag },
    { value: 'DollarSign', icon: DollarSign },
    { value: 'Package', icon: Package },
    { value: 'CreditCard', icon: CreditCard },
    { value: 'Home', icon: Home },
    { value: 'Wrench', icon: Wrench },
    { value: 'Zap', icon: Zap },
  ]
  const getTypeBadge = (type: 'income' | 'expense') => {
    return type === 'income'
      ? { variant: 'success' as const, label: 'Ingreso' }
      : { variant: 'destructive' as const, label: 'Gasto' }
  }
  const getStatusBadge = (status: 'active' | 'inactive') => {
    return status === 'active'
      ? { variant: 'success' as const, label: 'Activa' }
      : { variant: 'secondary' as const, label: 'Inactiva' }
  }
  const getIconComponent = (iconName: string) => {
    const found = iconOptions.find((i) => i.value === iconName)
    return found ? found.icon : Tag
  }
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handleSaveCategory = () => {
    // Validación básica
    if (!formData.name.trim()) {
      alert('El nombre de la categoría es obligatorio.')
      return
    }
    // Simular guardado
    alert('Categoría guardada correctamente.')
    setShowAddModal(false)
    setFormData({
      name: '',
      description: '',
      type: 'expense',
      status: 'active',
      icon: 'Tag',
    })
  }
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      type: category.type,
      status: category.status,
      icon: category.icon || 'Tag',
    })
    setShowEditModal(true)
  }
  const handleUpdateCategory = () => {
    if (!formData.name.trim()) {
      alert('El nombre de la categoría es obligatorio.')
      return
    }
    alert('Categoría actualizada correctamente.')
    setShowEditModal(false)
    setSelectedCategory(null)
    setFormData({
      name: '',
      description: '',
      type: 'expense',
      status: 'active',
      icon: 'Tag',
    })
  }
  const handleDeleteCategory = (category: Category) => {
    if (confirm(`¿Eliminar la categoría "${category.name}"?`)) {
      alert('Categoría eliminada correctamente.')
    }
  }
  // Modal de agregar/editar
  const CategoryModal = ({ isEdit = false }: { isEdit?: boolean }) => {
    const title = isEdit ? 'Editar Categoría' : 'Nueva Categoría'
    const onSave = isEdit ? handleUpdateCategory : handleSaveCategory
    const onClose = () => {
      if (isEdit) {
        setShowEditModal(false)
        setSelectedCategory(null)
      } else {
        setShowAddModal(false)
      }
      setFormData({
        name: '',
        description: '',
        type: 'expense',
        status: 'active',
        icon: 'Tag',
      })
    }
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl transform transition-all">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Tag size={20} className="text-white" />
                </div>
                <h2 className="text-lg font-bold text-foreground">{title}</h2>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            {/* Formulario */}
            <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Nombre *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej. Alquiler, Repuestos, Servicios"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Descripción</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Breve descripción de la categoría"
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium">Tipo</Label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="expense">Gasto</option>
                    <option value="income">Ingreso</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">Estado</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="active">Activa</option>
                    <option value="inactive">Inactiva</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Icono</Label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((icon) => {
                    const Icon = icon.icon
                    const isSelected = formData.icon === icon.value
                    return (
                      <button
                        key={icon.value}
                        onClick={() => setFormData((prev) => ({ ...prev, icon: icon.value }))}
                        className={`p-2 rounded-lg border transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <Icon size={20} className={isSelected ? 'text-primary' : 'text-muted-foreground'} />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-border">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={onSave} className="gap-2">
                <Save size={16} />
                {isEdit ? 'Actualizar' : 'Guardar'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categorías de Gastos</h1>
          <p className="text-muted-foreground">Gestiona las categorías para organizar tus gastos e ingresos</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus size={18} />
          Nueva categoría
        </Button>
      </div>
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <Card key={idx} variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`h-10 w-10 rounded-lg ${kpi.bgColor} flex items-center justify-center`}>
                    <Icon size={20} className={kpi.color} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['all', 'active', 'inactive'].map((status) => (
              <Badge
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => setStatusFilter(status)}
              >
                {status === 'all' ? 'Todos' : status === 'active' ? 'Activas' : 'Inactivas'}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['all', 'expense', 'income'].map((type) => (
              <Badge
                key={type}
                variant={typeFilter === type ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => setTypeFilter(type)}
              >
                {type === 'all' ? 'Todo' : type === 'expense' ? 'Gastos' : 'Ingresos'}
              </Badge>
            ))}
          </div>
          {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-muted-foreground"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setTypeFilter('all')
              }}
            >
              <X size={14} className="mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </Card>
      {/* Tabla */}
      <Card>
        <CardContent className="p-0">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Tag size={48} className="mx-auto mb-4 text-muted-foreground/40" />
              <p className="text-lg font-semibold text-foreground mb-1">No hay categorías registradas</p>
              <p className="text-sm">Agrega una nueva categoría para comenzar a organizar tus gastos.</p>
              <Button className="mt-4" onClick={() => setShowAddModal(true)}>
                <Plus size={16} className="mr-2" />
                Nueva categoría
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-sm text-muted-foreground">
                      <th className="px-6 py-4 font-medium">Nombre</th>
                      <th className="px-6 py-4 font-medium">Descripción</th>
                      <th className="px-6 py-4 font-medium">Tipo</th>
                      <th className="px-6 py-4 font-medium">Estado</th>
                      <th className="px-6 py-4 font-medium text-right">Gastos Asociados</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedCategories.map((category) => {
                      const Icon = getIconComponent(category.icon)
                      const typeBadge = getTypeBadge(category.type)
                      const statusBadge = getStatusBadge(category.status)
                      return (
                        <tr key={category.id} className="hover:bg-muted/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                                <Icon size={16} className="text-muted-foreground" />
                              </div>
                              <span className="font-medium text-foreground">{category.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                            {category.description || '—'}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={typeBadge.variant}>{typeBadge.label}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                          </td>
                          <td className="px-6 py-4 text-right font-medium">
                            {category.totalAmount > 0 ? `$${category.totalAmount.toFixed(2)}` : '—'}
                            {category.expenseCount > 0 && (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({category.expenseCount})
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleEditCategory(category)}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                              >
                                <Edit size={16} className="text-muted-foreground" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category)}
                                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} className="text-destructive" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {(currentPage - 1) * itemsPerPage + 1} -{' '}
                    {Math.min(currentPage * itemsPerPage, filteredCategories.length)} de {filteredCategories.length}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      {/* Modales */}
      {showAddModal && <CategoryModal isEdit={false} />}
      {showEditModal && <CategoryModal isEdit={true} />}
    </motion.div>
  )
}
