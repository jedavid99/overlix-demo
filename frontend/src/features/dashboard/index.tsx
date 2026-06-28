import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, TrendingUp, DollarSign, Zap, ChevronRight, Calendar, Plus, ArrowUp, ArrowDown, ArrowUpRight } from 'lucide-react'
import { MdSearch, MdBuild, MdHourglassEmpty, MdPhoneAndroid, MdCheckCircle, MdAttachMoney, MdPerson, MdTimer, MdNoteAdd, MdPersonSearch, MdWarning, MdShoppingCart, MdPersonAdd, MdInventory2, MdMoneyOff } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog'
import { repairService } from '@/services/repairService'
// Datos mock eliminados - conectar con API real
// const salesData = [
  // { name: 'Lun', ingresos: 45000 },
  // { name: 'Mar', ingresos: 52000 },
  // { name: 'Mié', ingresos: 48000 },
  // { name: 'Jue', ingresos: 61000 },
  // { name: 'Vie', ingresos: 58000 },
  // { name: 'Sáb', ingresos: 72000 },
  // { name: 'Dom', ingresos: 25000 },
// ]
// const pendingDeliveries = [
  // { id: '1', client: 'María González', device: 'iPhone 13', date: 'Hoy', status: 'Hoy' },
  // { id: '2', client: 'Juan Pérez', device: 'MacBook Pro', date: 'Mañana', status: 'Mañana' },
  // { id: '3', client: 'Carlos López', device: 'Samsung S22', date: '12/10/2024', status: 'Atrasado' },
  // { id: '4', client: 'Ana Martínez', device: 'iPad Air', date: 'Mañana', status: 'Mañana' },
// ]
// const stockAlerts = [
  // { id: '1', name: 'Pantalla iPhone 14', quantity: 2, unit: 'uds' },
  // { id: '2', name: 'Batería MacBook Air M2', quantity: 1, unit: 'uds' },
  // { id: '3', name: 'Cámara Samsung S23', quantity: 4, unit: 'uds' },
// ]
// const repairStatesData = [
  // { name: 'Diagnóstico', value: 12, color: '#F59E0B' },
  // { name: 'En reparación', value: 8, color: '#3B82F6' },
  // { name: 'Esperando repuesto', value: 5, color: '#8B5CF6' },
  // { name: 'Completado', value: 15, color: '#10B981' },
  // { name: 'Entregado', value: 20, color: '#6B7280' },
// ]
// const recentClients = [
  // { id: '1', name: 'Roberto García', phone: '555-1234', lastVisit: 'Hace 2 días' },
  // { id: '2', name: 'Laura Fernández', phone: '555-5678', lastVisit: 'Hace 5 días' },
  // { id: '3', name: 'Diego Rodríguez', phone: '555-9012', lastVisit: 'Hace 1 semana' },
// ]
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'diagnostic': return { variant: 'warning' as const, label: <span className="inline-flex items-center gap-1"><MdSearch size={14} /> Diagnóstico</span> }
    case 'in_progress': return { variant: 'default' as const, label: <span className="inline-flex items-center gap-1"><MdBuild size={14} /> Reparación</span> }
    case 'waiting_parts': return { variant: 'secondary' as const, label: <span className="inline-flex items-center gap-1"><MdHourglassEmpty size={14} /> Espera Repuesto</span> }
    case 'completed': return { variant: 'success' as const, label: 'Completada' }
    default: return { variant: 'secondary' as const, label: status }
  }
}
const getDeliveryBadge = (status: string) => {
  switch (status) {
    case 'Hoy': return { variant: 'success' as const, label: 'Hoy' }
    case 'Mañana': return { variant: 'default' as const, label: 'Mañana' }
    case 'Atrasado': return { variant: 'destructive' as const, label: 'Atrasado' }
    default: return { variant: 'secondary' as const, label: status }
  }
}
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount)
}
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border shadow-lg rounded-lg p-3">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-lg font-bold text-primary">
          {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(payload[0].value)}
        </p>
      </div>
    )
  }
  return null
}
const CustomPieTooltip = ({ active, payload, repairStatesData }: any) => {
  if (active && payload && payload.length && repairStatesData && Array.isArray(repairStatesData)) {
    const data = payload[0]
    const total = repairStatesData.reduce((sum: number, item: any) => sum + (item.value || 0), 0)
    const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0'
    return (
      <div className="bg-card border border-border shadow-lg rounded-lg p-3">
        <p className="text-sm font-medium text-foreground">{data.name}</p>
        <p className="text-lg font-bold text-primary">{data.value} ({percentage}%)</p>
      </div>
    )
  }
  return null
}
export default function Dashboard() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  // State for API data
  const [repairs, setRepairs] = useState<any[]>([])
  const [dailyActivities, setDailyActivities] = useState<any[]>([])
  const [salesData, setSalesData] = useState<any[]>([])
  const [pendingDeliveries, setPendingDeliveries] = useState<any[]>([])
  const [stockAlerts, setStockAlerts] = useState<any[]>([])
  const [repairStatesData, setRepairStatesData] = useState<any[]>([])
  const [recentClients, setRecentClients] = useState<any[]>([])
  // KPIs - calculated from real data
  const totalActiveOrders = repairs.filter((r: any) => r.estado !== 'delivered' && r.estado !== 'cancelled').length
  const totalToDeliver = repairs.filter((r: any) => r.estado === 'ready').length
  const totalRevenueToday = repairs
    .filter((r: any) => {
      const repairDate = new Date(r.fecha_ingreso)
      const today = new Date()
      return repairDate.toDateString() === today.toDateString() && r.total_reparacion
    })
    .reduce((sum: number, r: any) => {
      const total = typeof r.total_reparacion === 'number' ? r.total_reparacion : parseFloat(r.total_reparacion) || 0
      return sum + total
    }, 0)
  const totalEfficiency = repairs.length > 0 
    ? ((repairs.filter((r: any) => r.estado === 'delivered').length / repairs.length) * 100).toFixed(1)
    : 0
  const avgRepairTime = 3 // Placeholder - would need date calculation
  
  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const response = await repairService.list({ limit: 100 }) as any
      
      // Backend usa TransformInterceptor: { data: {...}, statusCode, timestamp, path }
      // Los datos reales están en response.data.data
      const repairsArray = response?.data?.data?.reparaciones || response?.data?.data || [];
      
      setRepairs(Array.isArray(repairsArray) ? repairsArray : [])
      
      // Calculate repair states data for pie chart
      const states = repairsArray.reduce((acc: any, r: any) => {
        const state = r.estado || 'unknown'
        acc[state] = (acc[state] || 0) + 1
        return acc
      }, {})
      
      const repairStatesData = Object.entries(states).map(([name, value]) => ({
        name: name === 'pending' ? 'Pendiente' :
              name === 'diagnostic' ? 'Diagnóstico' :
              name === 'in_progress' ? 'En Progreso' :
              name === 'waiting_parts' ? 'Esperando Repuestos' :
              name === 'ready' ? 'Listo' :
              name === 'delivered' ? 'Entregado' :
              name === 'cancelled' ? 'Cancelado' : name,
        value: value as number,
        color: name === 'pending' ? '#F59E0B' :
               name === 'diagnostic' ? '#3B82F6' :
               name === 'in_progress' ? '#8B5CF6' :
               name === 'waiting_parts' ? '#F97316' :
               name === 'ready' ? '#10B981' :
               name === 'delivered' ? '#6B7280' :
               name === 'cancelled' ? '#EF4444' : '#9CA3AF'
      }))
      
      setRepairStatesData(repairStatesData)
      
      // Set recent repairs for table
      const recentRepairs = Array.isArray(repairsArray) 
        ? repairsArray.slice(0, 5).map((r: any) => ({
            id: r.numero_reparacion || r.id?.substring(0, 8),
            dispositivo: r.dispositivo || '—',
            estado: r.estado || '—'
          }))
        : []
      
      setRepairs(recentRepairs)
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchDashboardData()
  }, [])
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido al panel de administración</p>
      </div>
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="success" size="sm" className="gap-1">
                <ArrowUp size={12} />
                +5%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Órdenes Activas</p>
            {loading ? (
              <Skeleton className="h-8 w-24 mt-2" />
            ) : (
              <p className="text-3xl font-bold text-foreground">{totalActiveOrders}</p>
            )}
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
              <Badge variant="secondary" size="sm" className="gap-1">
                <ArrowDown size={12} />
                0%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Listos para Entrega</p>
            {loading ? (
              <Skeleton className="h-8 w-24 mt-2" />
            ) : (
              <p className="text-3xl font-bold text-foreground">{totalToDeliver}</p>
            )}
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <Badge variant="success" size="sm" className="gap-1">
                <ArrowUp size={12} />
                +12%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Ingresos Hoy</p>
            {loading ? (
              <Skeleton className="h-8 w-24 mt-2" />
            ) : (
              <p className="text-3xl font-bold text-foreground">{formatCurrency(totalRevenueToday)}</p>
            )}
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-info" />
              </div>
              <Badge variant="success" size="sm" className="gap-1">
                <ArrowUp size={12} />
                +2%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Eficiencia</p>
            {loading ? (
              <Skeleton className="h-8 w-24 mt-2" />
            ) : (
              <p className="text-3xl font-bold text-foreground">{totalEfficiency}%</p>
            )}
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MdTimer className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" size="sm" className="gap-1">
                <ArrowDown size={12} />
                -0.2
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
            {loading ? (
              <Skeleton className="h-8 w-24 mt-2" />
            ) : (
              <p className="text-3xl font-bold text-foreground">{avgRepairTime} días</p>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Acciones Rápidas */}
      
      {/* Contenido principal: gráficos + tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Columna izquierda (3/5) */}
        <div className="lg:col-span-3 space-y-5">
          <Card>
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Ingresos (Últimos 7 días)</CardTitle>
                <Button variant="ghost" size="sm">Ver Reporte</Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData} barSize={36}>
                    <defs>
                      <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0066FF" stopOpacity={1} />
                        <stop offset="100%" stopColor="#0066FF" stopOpacity={0.7} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 12, fontWeight: 500 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,102,255,0.1)' }} />
                    <Bar dataKey="ingresos" fill="url(#primaryGradient)" radius={[8, 8, 0, 0]} animationDuration={800} animationEasing="ease-out" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
<Card className="overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Estados de Reparación</CardTitle>
                <Button variant="ghost" size="sm">Ver Detalle</Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-48 w-full overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={repairStatesData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                      {repairStatesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Últimas Reparaciones</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1">Ver todas <ChevronRight className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="overflow-auto max-h-52">
                <table className="w-full">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2 px-3">ORDEN</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2 px-3">DISPOSITIVO</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-2 px-3">ESTADO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repairs.length > 0 ? (
                      repairs.map((repair: any) => (
                        <tr key={repair.id} className="border-b border-border">
                          <td className="text-sm font-mono text-foreground py-2 px-3">{repair.id}</td>
                          <td className="text-sm text-foreground py-2 px-3">
                            <div className="flex items-center gap-2">
                              <MdPhoneAndroid size={16} />
                              <span className="truncate">{repair.dispositivo}</span>
                            </div>
                          </td>
                          <td className="text-sm py-2 px-3">
                            <Badge variant={getStatusBadge(repair.estado)?.variant} size="sm">
                              {getStatusBadge(repair.estado)?.label}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b border-border">
                        <td colSpan={3} className="text-sm text-muted-foreground py-4 px-3 text-center">
                          No hay reparaciones recientes
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Columna derecha (2/5) */}
        <div className="lg:col-span-2 space-y-5">
          <Card className="flex flex-col h-full">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Movimientos del Día</CardTitle>
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-1 flex flex-col">
              <div className="mb-4 pb-4 border-b border-border">
                <p className="text-2xl font-bold text-primary mb-1">12</p>
                <p className="text-muted-foreground text-sm">Octubre</p>
                <p className="text-muted-foreground text-xs">Jueves, 2023</p>
                  <Button onClick={() => setIsModalOpen(true)} className="w-full mt-4" variant="outline">
                <Plus size={18} className="mr-2" /> Registrar Movimiento
              </Button>
              </div>
              
              <div className="space-y-2 flex-1 overflow-y-auto max-h-44">
                {/* Conectar con API real: api.get('/activities') */}
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Sin actividades recientes</p>
                </div>
              </div>
             
            </CardContent>
          </Card>
          {/* Gráfico de torta: ahora con overflow-hidden */}
          
          {/* Últimos clientes */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle>Últimos Clientes</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {recentClients.map((client) => (
                  <div key={client.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-2">
                      <MdPerson size={16} className="text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{client.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{client.phone}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{client.lastVisit}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Fila inferior: Entregas pendientes y Stock crítico */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Entregas Pendientes</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1">Ver todas <ChevronRight className="w-4 h-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2 max-h-44 overflow-y-auto">
              {pendingDeliveries.map((delivery) => {
                const badge = getDeliveryBadge(delivery.status)
                return (
                  <div key={delivery.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-foreground truncate">{delivery.client}</p>
                      <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{delivery.device}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Entrega: {delivery.date}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MdWarning className="text-destructive" />
                Stock Crítico
              </CardTitle>
              <Button variant="ghost" size="sm">Ver Todo</Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {stockAlerts.length > 0 ? (
              <div className="space-y-2 max-h-44 overflow-y-auto">
                {stockAlerts.map((alert) => (
                  <div key={alert.id} className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-foreground truncate">{alert.name}</p>
                      <Badge variant="destructive" size="sm">{alert.quantity} {alert.unit}</Badge>
                    </div>
                    <Button onClick={() => navigate('/providers')} variant="outline" size="sm" className="w-full mt-2 gap-1">
                      <MdShoppingCart size={14} /> Comprar
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <MdCheckCircle size={32} className="mx-auto text-success mb-2" />
                <p className="text-sm font-medium text-success">Todo el stock dentro de niveles óptimos</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Modal de movimiento */}
     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Movimiento</DialogTitle>
            <DialogDescription>Selecciona el tipo de operación que deseas realizar.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {/* Registrar Venta */}
            <button
              onClick={() => { setIsModalOpen(false); navigate('/sales/add') }}
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-emerald-50 border border-emerald-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <MdAttachMoney size={28} className="text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-foreground">Registrar Venta</span>
            </button>
            {/* Agregar Cliente */}
            <button
              onClick={() => { setIsModalOpen(false); navigate('/clients/add') }}
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-blue-50 border border-blue-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <MdPersonAdd size={28} className="text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-foreground">Agregar Cliente</span>
            </button>
            {/* Agregar Producto */}
            <button
              onClick={() => { setIsModalOpen(false); navigate('/stock/add') }}
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-amber-50 border border-amber-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <MdInventory2 size={28} className="text-amber-600" />
              </div>
              <span className="text-sm font-semibold text-foreground">Agregar Producto</span>
            </button>
            {/* Nuevo Gasto */}
            <button
              onClick={() => { setIsModalOpen(false); navigate('/expenses/add') }}
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-red-50 border border-red-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <MdMoneyOff size={28} className="text-red-600" />
              </div>
              <span className="text-sm font-semibold text-foreground">Nuevo Gasto</span>
            </button>
            {/* Nueva Reparación (ocupa toda la fila) */}
            <button
              onClick={() => { setIsModalOpen(false); navigate('/reparaciones/add') }}
              className="col-span-2 flex flex-col items-center justify-center gap-3 p-5 rounded-xl bg-violet-50 border border-violet-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="h-12 w-12 rounded-full bg-violet-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <MdBuild size={28} className="text-violet-600" />
              </div>
              <span className="text-sm font-semibold text-foreground">Nueva Reparación</span>
            </button>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={() => setIsModalOpen(false)} variant="ghost">Cancelar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
