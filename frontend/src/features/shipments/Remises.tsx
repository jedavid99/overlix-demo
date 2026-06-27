import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Truck,
  User,
  MapPin,
  Navigation,
  CheckCircle,
  AlertCircle,
  X,
  Phone,
  Calendar,
  Wrench,
  Fuel,
  Gauge,
  Save,
} from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
interface Remise {
  id: string
  plate: string
  driver: string
  driverPhone: string
  vehicle: string
  brand: string
  model: string
  year: number
  status: 'disponible' | 'en_ruta' | 'mantenimiento' | 'inactivo'
  location: string
  lastUpdate: string
  fuelLevel: number
  mileage: number
  assignedTo?: string
  notes?: string
}
// 📦 Datos vacíos – conectar con API real
const initialRemises: Remise[] = []
export default function Remises() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [selectedRemise, setSelectedRemise] = useState<Remise | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [remises, setRemises] = useState<Remise[]>(initialRemises)
  // Estado del formulario para nuevo remise
  const [newRemise, setNewRemise] = useState<Omit<Remise, 'id' | 'lastUpdate'>>({
    plate: '',
    driver: '',
    driverPhone: '',
    vehicle: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    status: 'disponible',
    location: '',
    fuelLevel: 80,
    mileage: 0,
    assignedTo: '',
    notes: '',
  })
  const filteredRemises = remises.filter((r) => {
    const matchesSearch =
      r.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })
  const paginatedRemises = filteredRemises.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredRemises.length / itemsPerPage)
  const totalRemises = remises.length
  const disponibles = remises.filter((r) => r.status === 'disponible').length
  const enRuta = remises.filter((r) => r.status === 'en_ruta').length
  const mantenimiento = remises.filter((r) => r.status === 'mantenimiento').length
  const kpiData = [
    {
      label: 'Total Remises',
      value: totalRemises,
      icon: Truck,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Disponibles',
      value: disponibles,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'En Ruta',
      value: enRuta,
      icon: Navigation,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Mantenimiento',
      value: mantenimiento,
      icon: Wrench,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
    },
  ]
  const getStatusBadge = (status: Remise['status']) => {
    const variants = {
      disponible: { variant: 'success' as const, label: 'Disponible' },
      en_ruta: { variant: 'default' as const, label: 'En Ruta' },
      mantenimiento: { variant: 'warning' as const, label: 'Mantenimiento' },
      inactivo: { variant: 'destructive' as const, label: 'Inactivo' },
    }
    return variants[status]
  }
  const getStatusIcon = (status: Remise['status']) => {
    switch (status) {
      case 'disponible':
        return <CheckCircle size={14} className="text-success" />
      case 'en_ruta':
        return <Navigation size={14} className="text-blue-600" />
      case 'mantenimiento':
        return <Wrench size={14} className="text-amber-600" />
      case 'inactivo':
        return <AlertCircle size={14} className="text-destructive" />
    }
  }
  const openDetails = (remise: Remise) => {
    setSelectedRemise(remise)
    setShowDetailsModal(true)
  }
  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedRemise(null)
  }
  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setNewRemise((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }
  // Guardar nuevo remise (simulación)
  const handleSaveRemise = () => {
    // Validación básica
    if (!newRemise.plate.trim() || !newRemise.driver.trim() || !newRemise.vehicle.trim()) {
      alert('Por favor completa los campos obligatorios: Placa, Conductor y Vehículo.')
      return
    }
    const newId = `REM-${String(remises.length + 1).padStart(4, '0')}`
    const now = new Date().toLocaleString()
    const remiseToAdd: Remise = {
      ...newRemise,
      id: newId,
      lastUpdate: now,
    }
    setRemises((prev) => [...prev, remiseToAdd])
    setShowAddModal(false)
    setNewRemise({
      plate: '',
      driver: '',
      driverPhone: '',
      vehicle: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      status: 'disponible',
      location: '',
      fuelLevel: 80,
      mileage: 0,
      assignedTo: '',
      notes: '',
    })
    alert(`Remise ${newId} agregado correctamente.`)
  }
  // Modal de detalles
  const DetailsModal = () => {
    if (!selectedRemise) return null
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDetailsModal} />
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-card rounded-2xl shadow-2xl transform transition-all">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Truck size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{selectedRemise.plate}</h2>
                  <p className="text-sm text-muted-foreground">{selectedRemise.vehicle}</p>
                </div>
              </div>
              <button onClick={closeDetailsModal} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground font-medium">Estado</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(selectedRemise.status)}
                    <span className="font-semibold">{getStatusBadge(selectedRemise.status).label}</span>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground font-medium">Ubicación</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin size={16} className="text-muted-foreground" />
                    <span className="font-medium">{selectedRemise.location}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <User size={14} /> Conductor
                  </p>
                  <p className="font-semibold mt-1">{selectedRemise.driver}</p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Phone size={14} />
                    <span>{selectedRemise.driverPhone}</span>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <Truck size={14} /> Vehículo
                  </p>
                  <p className="font-semibold mt-1">{selectedRemise.vehicle}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRemise.brand} {selectedRemise.model} • {selectedRemise.year}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/30 rounded-xl p-4 text-center">
                  <Fuel size={20} className="mx-auto text-muted-foreground mb-1" />
                  <p className="text-sm font-semibold">{selectedRemise.fuelLevel}%</p>
                  <p className="text-xs text-muted-foreground">Combustible</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4 text-center">
                  <Gauge size={20} className="mx-auto text-muted-foreground mb-1" />
                  <p className="text-sm font-semibold">{selectedRemise.mileage.toLocaleString()} km</p>
                  <p className="text-xs text-muted-foreground">Kilometraje</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4 text-center">
                  <Calendar size={20} className="mx-auto text-muted-foreground mb-1" />
                  <p className="text-sm font-semibold">{selectedRemise.lastUpdate}</p>
                  <p className="text-xs text-muted-foreground">Última actualización</p>
                </div>
              </div>
              {selectedRemise.assignedTo && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground font-medium">Asignado a</p>
                  <p className="font-medium">{selectedRemise.assignedTo}</p>
                </div>
              )}
              {selectedRemise.notes && (
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs text-muted-foreground font-medium">Notas</p>
                  <p className="text-sm mt-1">{selectedRemise.notes}</p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Phone size={16} />
                  Contactar conductor
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-muted transition-colors">
                  <Edit size={16} className="text-foreground" />
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  // Modal para agregar remise
  const AddModal = () => {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl transform transition-all">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Plus size={20} className="text-white" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Nuevo Remise</h2>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plate" className="text-sm font-medium">Placa *</Label>
                  <Input
                    id="plate"
                    name="plate"
                    value={newRemise.plate}
                    onChange={handleInputChange}
                    placeholder="ABC-1234"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driver" className="text-sm font-medium">Conductor *</Label>
                  <Input
                    id="driver"
                    name="driver"
                    value={newRemise.driver}
                    onChange={handleInputChange}
                    placeholder="Nombre completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverPhone" className="text-sm font-medium">Teléfono del conductor</Label>
                  <Input
                    id="driverPhone"
                    name="driverPhone"
                    value={newRemise.driverPhone}
                    onChange={handleInputChange}
                    placeholder="+34 600 000 000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle" className="text-sm font-medium">Vehículo *</Label>
                  <Input
                    id="vehicle"
                    name="vehicle"
                    value={newRemise.vehicle}
                    onChange={handleInputChange}
                    placeholder="Furgoneta, Camión, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-sm font-medium">Marca</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={newRemise.brand}
                    onChange={handleInputChange}
                    placeholder="Mercedes, Ford, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model" className="text-sm font-medium">Modelo</Label>
                  <Input
                    id="model"
                    name="model"
                    value={newRemise.model}
                    onChange={handleInputChange}
                    placeholder="Sprinter, Transit, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-sm font-medium">Año</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    value={newRemise.year}
                    onChange={handleInputChange}
                    placeholder="2024"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">Estado</Label>
                  <select
                    id="status"
                    name="status"
                    value={newRemise.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="en_ruta">En Ruta</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">Ubicación</Label>
                  <Input
                    id="location"
                    name="location"
                    value={newRemise.location}
                    onChange={handleInputChange}
                    placeholder="Ciudad, dirección"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelLevel" className="text-sm font-medium">Nivel de combustible (%)</Label>
                  <Input
                    id="fuelLevel"
                    name="fuelLevel"
                    type="number"
                    min="0"
                    max="100"
                    value={newRemise.fuelLevel}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage" className="text-sm font-medium">Kilometraje</Label>
                  <Input
                    id="mileage"
                    name="mileage"
                    type="number"
                    value={newRemise.mileage}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTo" className="text-sm font-medium">Asignado a</Label>
                  <Input
                    id="assignedTo"
                    name="assignedTo"
                    value={newRemise.assignedTo}
                    onChange={handleInputChange}
                    placeholder="Cliente o proyecto"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes" className="text-sm font-medium">Notas</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={newRemise.notes}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground"
                    placeholder="Observaciones adicionales"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-border">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveRemise} className="gap-2">
                <Save size={16} />
                Guardar remise
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
          <h1 className="text-3xl font-bold text-foreground">Remises</h1>
          <p className="text-muted-foreground">Gestión de vehículos de transporte</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus size={18} />
          Nuevo remise
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
              placeholder="Buscar por placa, conductor o vehículo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['all', 'disponible', 'en_ruta', 'mantenimiento', 'inactivo'].map((status) => (
              <Badge
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => setStatusFilter(status)}
              >
                {status === 'all'
                  ? 'Todos'
                  : status === 'disponible'
                    ? 'Disponibles'
                    : status === 'en_ruta'
                      ? 'En Ruta'
                      : status === 'mantenimiento'
                        ? 'Mantenimiento'
                        : 'Inactivos'}
              </Badge>
            ))}
          </div>
          {(searchTerm || statusFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-muted-foreground"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
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
          {filteredRemises.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Truck size={48} className="mx-auto mb-4 text-muted-foreground/40" />
              <p className="text-lg font-semibold text-foreground mb-1">No hay remises registrados</p>
              <p className="text-sm">Agrega un nuevo remise para comenzar.</p>
              <Button className="mt-4" onClick={() => setShowAddModal(true)}>
                <Plus size={16} className="mr-2" />
                Nuevo remise
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-sm text-muted-foreground">
                      <th className="px-6 py-4 font-medium">Placa</th>
                      <th className="px-6 py-4 font-medium">Conductor</th>
                      <th className="px-6 py-4 font-medium">Vehículo</th>
                      <th className="px-6 py-4 font-medium">Ubicación</th>
                      <th className="px-6 py-4 font-medium">Estado</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedRemises.map((remise) => (
                      <tr
                        key={remise.id}
                        className="hover:bg-muted/50 cursor-pointer transition-colors group"
                        onClick={() => openDetails(remise)}
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-blue-600">{remise.plate}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-muted-foreground" />
                            <span className="font-medium">{remise.driver}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{remise.vehicle}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} className="text-muted-foreground" />
                            <span>{remise.location}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={getStatusBadge(remise.status).variant}>
                            {getStatusBadge(remise.status).label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                openDetails(remise)
                              }}
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                              <Eye size={16} className="text-muted-foreground" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/remises/edit/${remise.id}`)
                              }}
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                              <Edit size={16} className="text-muted-foreground" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (confirm('¿Eliminar este remise?')) {
                                  // Lógica de eliminación
                                }
                              }}
                              className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} className="text-destructive" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {(currentPage - 1) * itemsPerPage + 1} -{' '}
                    {Math.min(currentPage * itemsPerPage, filteredRemises.length)} de {filteredRemises.length}
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
      {showDetailsModal && <DetailsModal />}
      {showAddModal && <AddModal />}
    </motion.div>
  )
}
