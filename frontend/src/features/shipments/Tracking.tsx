import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Search, Plus, ChevronDown, MoreVertical, Package,
  Truck, CheckCircle, Clock, MapPin, Navigation,
  Calendar, Phone, Mail, User, Box, ArrowRight,
  Filter, Download, Eye, Edit, Trash2, X,
  Circle, TrendingUp, TrendingDown, AlertCircle,
  FileText, Printer, Share2, Star, Bell, Settings,
  Map, Globe, Compass, Activity, BarChart3,
  Shield, Zap, Award, Target, Gift, CreditCard,
  Home, ShoppingBag, Wrench, HelpCircle, Maximize2,
  Minimize2, ChevronLeft, ChevronRight, RotateCw,
  Info, ExternalLink, MessageSquare, ThumbsUp
} from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
interface Shipment {
  id: string
  customer: string
  type: 'Repair' | 'Sale'
  provider: string
  location: string
  progress: number
  status: 'preparation' | 'transit' | 'delivery' | 'delivered'
  estimatedDelivery: string
  origin: string
  destination: string
  weight: string
  items: number
  lat?: number
  lng?: number
  lastUpdate: string
  driver?: string
  vehicle?: string
  signature?: boolean
  description?: string
  value?: string
}
interface LogEvent {
  title: string
  detail: string
  completed: boolean
  time: string
  icon?: React.ReactNode
}
export default function Tracking() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalView, setModalView] = useState<'details' | 'map' | 'timeline'>('details')
  const [mapZoom, setMapZoom] = useState(12)
  const location = useLocation()
  useEffect(() => {
    if (location.state) {
      const st = location.state as any
      if (st.shipment) setSelectedShipment(st.shipment)
      if (st.searchTerm) setSearchTerm(st.searchTerm)
      if (st.filterStatus) setFilterStatus(st.filterStatus)
    }
  }, [location.state])
  // ?? Datos vacíos – conectar con API real
  const shipments: Shipment[] = []
  const kpiCards = [
    { title: 'En Preparación', value: shipments.filter(s => s.status === 'preparation').length, change: 0, icon: <Package size={20} />, color: 'text-amber-600', bgColor: 'bg-amber-100' },
    { title: 'En Tránsito', value: shipments.filter(s => s.status === 'transit').length, change: 0, icon: <Truck size={20} />, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'En Reparto', value: shipments.filter(s => s.status === 'delivery').length, change: 0, icon: <Navigation size={20} />, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { title: 'Entregados', value: shipments.filter(s => s.status === 'delivered').length, change: 0, icon: <CheckCircle size={20} />, color: 'text-green-600', bgColor: 'bg-green-100' },
  ]
  const filteredShipments = shipments.filter(s => {
    if (filterStatus !== 'all' && s.status !== filterStatus) return false
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      return (
        s.id.toLowerCase().includes(term) ||
        s.customer.toLowerCase().includes(term) ||
        s.location.toLowerCase().includes(term) ||
        s.provider.toLowerCase().includes(term)
      )
    }
    return true
  })
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'preparation': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'transit': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'delivery': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-muted text-foreground border-gray-200'
    }
  }
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'preparation': return <Package size={14} />
      case 'transit': return <Truck size={14} />
      case 'delivery': return <Navigation size={14} />
      case 'delivered': return <CheckCircle size={14} />
      default: return <Circle size={14} />
    }
  }
  const getStatusText = (status: string) => {
    switch(status) {
      case 'preparation': return 'Preparación'
      case 'transit': return 'En Tránsito'
      case 'delivery': return 'En Reparto'
      case 'delivered': return 'Entregado'
      default: return status
    }
  }
  const getTrackingLog = (shipmentId: string): LogEvent[] => {
    // Conectar con API real: api.get(`/shipments/${shipmentId}/log`)
    return []
  }
  const getMapUrl = (lat: number, lng: number, zoom: number) => {
    return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=800x500&markers=${lat},${lng},red-pin`
  }
  const openTrackingModal = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setShowModal(true)
    setModalView('details')
  }
  // Modal (solo se renderiza si hay shipment seleccionado)
  const TrackingModal = () => {
    if (!selectedShipment) return null
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)} />
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-card rounded-2xl shadow-2xl transform transition-all animate-slideUp">
            {/* Cabecera */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Truck size={20} className="text-white" />
                  </div>
                  <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    selectedShipment.status === 'delivered' ? 'bg-green-500' :
                    selectedShipment.status === 'transit' ? 'bg-blue-500' :
                    selectedShipment.status === 'delivery' ? 'bg-purple-500' :
                    'bg-amber-500'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground">{selectedShipment.id}</h2>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedShipment.status)}`}>
                      {getStatusIcon(selectedShipment.status)}
                      {getStatusText(selectedShipment.status)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{selectedShipment.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex bg-muted rounded-lg p-0.5">
                  {['details', 'map', 'timeline'].map((view) => (
                    <button
                      key={view}
                      onClick={() => setModalView(view as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        modalView === view
                          ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                          : 'text-foreground dark:text-muted-foreground hover:text-gray-900'
                      }`}
                    >
                      {view === 'details' ? 'Detalles' : view === 'map' ? 'Mapa' : 'Timeline'}
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>
            </div>
            {/* Contenido */}
            <div className="p-4 max-h-[calc(100vh-160px)] overflow-y-auto">
              {modalView === 'details' && (
                <div className="space-y-4">
                  {/* Progreso */}
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">Progreso</span>
                      <span className="text-sm font-bold">{selectedShipment.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${selectedShipment.progress}%` }} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                      <div><span className="opacity-70">Origen</span><br /><span className="font-medium">{selectedShipment.origin}</span></div>
                      <div><span className="opacity-70">Destino</span><br /><span className="font-medium">{selectedShipment.destination}</span></div>
                      <div><span className="opacity-70">Entrega</span><br /><span className="font-medium">{selectedShipment.estimatedDelivery}</span></div>
                      <div><span className="opacity-70">Última act.</span><br /><span className="font-medium">{selectedShipment.lastUpdate}</span></div>
                    </div>
                  </div>
                  {/* Grid de información */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 dark:bg-muted/50 rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                        <Package size={14} className="text-blue-600" /> Paquete
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between"><span className="text-muted-foreground">Peso</span><span className="font-medium">{selectedShipment.weight}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Artículos</span><span className="font-medium">{selectedShipment.items} u.</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Transportista</span><span className="font-medium">{selectedShipment.provider}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Valor</span><span className="font-bold text-green-600">{selectedShipment.value}</span></div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-muted/50 rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                        <User size={14} className="text-blue-600" /> Cliente
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg flex items-center justify-center">
                            <User size={14} className="text-purple-600" />
                          </div>
                          <div><p className="font-medium">{selectedShipment.customer}</p><p className="text-[10px] text-muted-foreground">ID: CLT-{Math.floor(Math.random() * 10000)}</p></div>
                        </div>
                        <div className="flex items-center gap-1.5"><Phone size={12} className="text-muted-foreground" /><span>+1 (555) 123-4567</span></div>
                        <div className="flex items-center gap-1.5"><Mail size={12} className="text-muted-foreground" /><span>{selectedShipment.customer.toLowerCase().replace(' ', '.')}@email.com</span></div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-muted/50 rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                        <Truck size={14} className="text-blue-600" /> Transportista
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg flex items-center justify-center">
                            <User size={14} className="text-blue-600" />
                          </div>
                          <div><p className="font-medium">{selectedShipment.driver}</p><p className="text-[10px] text-muted-foreground">Conductor</p></div>
                        </div>
                        <div className="flex items-center gap-1.5"><Truck size={12} className="text-muted-foreground" /><span>{selectedShipment.vehicle}</span></div>
                        <div className="flex items-center gap-1.5"><Phone size={12} className="text-muted-foreground" /><span>+1 (555) 987-6543</span></div>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-muted/50 rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                        <Info size={14} className="text-blue-600" /> Adicional
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between"><span className="text-muted-foreground">Tipo</span><span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${selectedShipment.type === 'Repair' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{selectedShipment.type}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Firma</span><span className={selectedShipment.signature ? 'text-green-600' : 'text-muted-foreground'}>{selectedShipment.signature ? 'Sí' : 'No'}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Seguimiento</span><span className="font-mono font-bold text-blue-600 text-[10px]">{selectedShipment.id}</span></div>
                      </div>
                    </div>
                  </div>
                  {/* Acciones */}
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                      <Phone size={14} /> Contactar
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-gray-700 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-colors">
                      <Share2 size={14} className="text-foreground" /> Compartir
                    </button>
                    <button className="flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-gray-700 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-colors">
                      <Download size={14} className="text-foreground" /> PDF
                    </button>
                  </div>
                </div>
              )}
              {modalView === 'map' && selectedShipment.lat && selectedShipment.lng && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5"><Map size={16} className="text-blue-600" /><h3 className="text-sm font-semibold">Ubicación en tiempo real</h3></div>
                    <div className="flex gap-1">
                      <button onClick={() => setMapZoom(Math.min(mapZoom + 1, 18))} className="p-1.5 bg-muted rounded-lg hover:bg-muted/70"><Plus size={14} /></button>
                      <button onClick={() => setMapZoom(Math.max(mapZoom - 1, 5))} className="p-1.5 bg-muted rounded-lg hover:bg-muted/70"><Minus size={14} /></button>
                      <button onClick={() => setMapZoom(12)} className="p-1.5 bg-muted rounded-lg hover:bg-muted/70"><RotateCw size={14} /></button>
                    </div>
                  </div>
                  <div className="relative h-72 w-full bg-muted rounded-xl overflow-hidden">
                    <img src={getMapUrl(selectedShipment.lat, selectedShipment.lng, mapZoom)} alt="Map" className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-muted/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                      <p className="text-[10px] font-medium text-muted-foreground">Ubicación actual</p>
                      <p className="text-xs font-semibold">{selectedShipment.location}</p>
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="relative">
                        <div className="w-6 h-6 bg-red-600 rounded-full animate-ping opacity-50 absolute"></div>
                        <div className="w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center"><Truck size={12} className="text-white" /></div>
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 bg-white/90 dark:bg-muted/90 backdrop-blur-sm rounded-lg p-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1"><MapPin size={12} className="text-green-600" /><span>{selectedShipment.origin}</span></div>
                      <ArrowRight size={12} className="text-muted-foreground" />
                      <div className="flex items-center gap-1"><MapPin size={12} className="text-red-600" /><span>{selectedShipment.destination}</span></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div><span>Vehículo en movimiento</span></div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5"><ExternalLink size={12} /> Ver en Google Maps</button>
                  </div>
                </div>
              )}
              {modalView === 'timeline' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5"><Activity size={16} className="text-blue-600" /><h3 className="text-sm font-semibold">Historial de seguimiento</h3></div>
                    <span className="text-xs text-muted-foreground">0 eventos</span>
                  </div>
                  <div className="text-center py-8 text-muted-foreground">
                    <Package size={32} className="mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-sm">No hay eventos de seguimiento disponibles</p>
                  </div>
                </div>
              )}
            </div>
            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-3 border-t border-border">
              <button onClick={() => setShowModal(false)} className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">Cerrar</button>
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Descargar comprobante</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  // Componentes auxiliares para zoom
  const Plus = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
  )
  const Minus = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
  )
  return (
    <div className="min-h-screen bg-background">
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Seguimiento de Envíos</h1>
              <p className="text-muted-foreground">Monitorea el estado de tus envíos en tiempo real</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Filter size={16} />
                Filtros
              </Button>
              <Button className="gap-2">
                <Plus size={16} />
                Nuevo envío
              </Button>
            </div>
          </div>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((kpi, index) => (
              <Card key={index} variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`h-10 w-10 rounded-lg ${kpi.bgColor} flex items-center justify-center`}>
                      <div className={kpi.color}>{kpi.icon}</div>
                    </div>
                    <Badge variant={kpi.change >= 0 ? 'success' : 'destructive'} size="sm">
                      {kpi.change >= 0 ? '+' : ''}{kpi.change}%
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Búsqueda y filtros */}
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por ID, cliente, ubicación o transportista..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'preparation', 'transit', 'delivery', 'delivered'].map((status) => (
                  <Badge
                    key={status}
                    variant={filterStatus === status ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => setFilterStatus(status)}
                  >
                    {status === 'all' ? 'Todos' : getStatusText(status)}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
          {/* Tabla de envíos */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {filteredShipments.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <Package size={48} className="mx-auto mb-4 text-muted-foreground/40" />
                    <p className="text-lg font-semibold text-foreground mb-1">No hay envíos registrados</p>
                    <p className="text-sm">Los envíos aparecerán aquí una vez que se creen.</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left text-sm text-muted-foreground">
                        <th className="px-6 py-4 font-medium">ID</th>
                        <th className="px-6 py-4 font-medium">Cliente</th>
                        <th className="px-6 py-4 font-medium">Tipo</th>
                        <th className="px-6 py-4 font-medium">Transportista</th>
                        <th className="px-6 py-4 font-medium">Ubicación</th>
                        <th className="px-6 py-4 font-medium">Estado</th>
                        <th className="px-6 py-4 font-medium">Progreso</th>
                        <th className="px-6 py-4 font-medium text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredShipments.map((shipment) => (
                        <tr
                          key={shipment.id}
                          className="group hover:bg-muted/50 cursor-pointer transition-all"
                          onClick={() => openTrackingModal(shipment)}
                        >
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm font-bold text-blue-600">{shipment.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
                                <User size={14} className="text-foreground dark:text-muted-foreground" />
                              </div>
                              <span className="text-sm font-medium text-foreground">{shipment.customer}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                              shipment.type === 'Repair'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {shipment.type === 'Repair' ? <Wrench size={12} /> : <ShoppingBag size={12} />}
                              {shipment.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-muted dark:bg-muted rounded flex items-center justify-center">
                                <Package size={12} className="text-muted-foreground" />
                              </div>
                              <span className="text-sm text-foreground dark:text-gray-300">{shipment.provider}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <MapPin size={14} className="text-muted-foreground" />
                              <span className="text-sm text-foreground dark:text-muted-foreground">{shipment.location}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(shipment.status)}`}>
                              {getStatusIcon(shipment.status)}
                              {getStatusText(shipment.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-24 h-2 bg-muted dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                                  style={{ width: `${shipment.progress}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-foreground dark:text-gray-300">
                                {shipment.progress}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                openTrackingModal(shipment)
                              }}
                              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      {showModal && <TrackingModal />}
    </div>
  )
}
