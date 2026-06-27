import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { format, subDays, startOfYear } from 'date-fns'
import { es } from 'date-fns/locale'
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, AreaChart, Area } from 'recharts'
import { MdFileDownload, MdBuild, MdCheckCircle, MdPending, MdSchedule, MdErrorOutline, MdTrendingUp, MdTrendingDown, MdDevices, MdAttachMoney } from 'react-icons/md'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { exportToCSV } from '@/shared/lib/export'
// Tipos
interface Repair {
  id: string
  ticketId: string
  client: string
  device: string
  deviceType: string
  issue: string
  status: 'Pendiente' | 'En Progreso' | 'Completado' | 'Cancelado'
  date: Date
  completedDate?: Date
  cost: number
  technician: string
}
interface RepairByStatus {
  name: string
  value: number
  color: string
}
interface RepairByDevice {
  name: string
  value: number
}
interface RepairTimeline {
  date: string
  repairs: number
  revenue: number
}
// Datos de ejemplo (comentados – descomentar para probar diseño)
// const sampleRepairs: Repair[] = [
//   { id: '1', ticketId: 'REP-001', client: 'Juan Pérez', device: 'iPhone 13', deviceType: 'Celular', issue: 'Pantalla rota', status: 'Completado', date: new Date(2024, 0, 15), completedDate: new Date(2024, 0, 17), cost: 150, technician: 'Carlos López' },
//   { id: '2', ticketId: 'REP-002', client: 'María García', device: 'Samsung S22', deviceType: 'Celular', issue: 'Batería', status: 'En Progreso', date: new Date(2024, 0, 16), cost: 80, technician: 'Ana Martínez' },
//   { id: '3', ticketId: 'REP-003', client: 'Pedro Sánchez', device: 'MacBook Pro', deviceType: 'Portátil', issue: 'No enciende', status: 'Pendiente', date: new Date(2024, 0, 17), cost: 200, technician: 'Carlos López' },
//   { id: '4', ticketId: 'REP-004', client: 'Laura Díaz', device: 'iPad Air', deviceType: 'Tablet', issue: 'Carga', status: 'Completado', date: new Date(2024, 0, 18), completedDate: new Date(2024, 0, 19), cost: 90, technician: 'Ana Martínez' },
//   { id: '5', ticketId: 'REP-005', client: 'Roberto Ruiz', device: 'PS5', deviceType: 'Consola', issue: 'HDMI', status: 'Cancelado', date: new Date(2024, 0, 19), cost: 120, technician: 'Carlos López' },
// ]
const STATUS_COLORS = {
  'Pendiente': '#f59e0b',
  'En Progreso': '#3b82f6',
  'Completado': '#10b981',
  'Cancelado': '#ef4444',
}
const DEVICE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)
}
const RepairsReport = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [period, setPeriod] = useState<'Hoy' | '7 días' | '30 días' | 'Este año' | 'Personalizado'>('30 días')
  const [customRange, setCustomRange] = useState({ start: '', end: '' })
  const [repairs, setRepairs] = useState<Repair[]>([]) // Inicialmente vacío
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  useEffect(() => {
    // 🔌 Conectar con API real:
    // api.get('/reports/repairs').then(res => setRepairs(res.data)).catch(() => setError(true)).finally(() => setLoading(false))
    
    // 💡 Para probar el diseño, descomentar la línea de abajo y comentar la simulación
    // setRepairs(sampleRepairs)
    
    // Simular carga (eliminar esto cuando conectes con la API)
    setTimeout(() => {
      // setRepairs(sampleRepairs) // Opcional: descomentar para ver datos de ejemplo
      setLoading(false)
    }, 800)
  }, [])
  // Filtrar reparaciones por período
  const filteredRepairs = repairs.filter((repair) => {
    const now = new Date()
    let matchesPeriod = true
    if (period === 'Hoy') {
      matchesPeriod = repair.date.toDateString() === now.toDateString()
    } else if (period === '7 días') {
      matchesPeriod = repair.date >= subDays(now, 7)
    } else if (period === '30 días') {
      matchesPeriod = repair.date >= subDays(now, 30)
    } else if (period === 'Este año') {
      matchesPeriod = repair.date >= startOfYear(now)
    } else if (period === 'Personalizado' && customRange.start && customRange.end) {
      matchesPeriod = repair.date >= new Date(customRange.start) && repair.date <= new Date(customRange.end)
    }
    return matchesPeriod
  })
  // Calcular KPIs
  const totalRepairs = filteredRepairs.length
  const completedRepairs = filteredRepairs.filter(r => r.status === 'Completado').length
  const pendingRepairs = filteredRepairs.filter(r => r.status === 'Pendiente' || r.status === 'En Progreso').length
  const totalRevenue = filteredRepairs.filter(r => r.status === 'Completado').reduce((sum, r) => sum + r.cost, 0)
  const averageRepairCost = completedRepairs > 0 ? totalRevenue / completedRepairs : 0
  // Calcular tiempo promedio de reparación (en días)
  const completedWithDate = filteredRepairs.filter(r => r.status === 'Completado' && r.completedDate)
  const averageRepairTime = completedWithDate.length > 0 
    ? completedWithDate.reduce((sum, r) => sum + (r.completedDate!.getTime() - r.date.getTime()), 0) / completedWithDate.length / (1000 * 60 * 60 * 24)
    : 0
  // Datos para gráfico por estado
  const repairsByStatus: RepairByStatus[] = [
    { name: 'Pendiente', value: filteredRepairs.filter(r => r.status === 'Pendiente').length, color: STATUS_COLORS['Pendiente'] },
    { name: 'En Progreso', value: filteredRepairs.filter(r => r.status === 'En Progreso').length, color: STATUS_COLORS['En Progreso'] },
    { name: 'Completado', value: filteredRepairs.filter(r => r.status === 'Completado').length, color: STATUS_COLORS['Completado'] },
    { name: 'Cancelado', value: filteredRepairs.filter(r => r.status === 'Cancelado').length, color: STATUS_COLORS['Cancelado'] },
  ]
  // Datos para gráfico por tipo de dispositivo
  const deviceCounts = filteredRepairs.reduce((acc, r) => {
    acc[r.deviceType] = (acc[r.deviceType] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const repairsByDevice: RepairByDevice[] = Object.entries(deviceCounts).map(([name, value]) => ({ name, value }))
  // Datos para línea de tiempo
  const getTimelineData = (): RepairTimeline[] => {
    const days = 7
    const now = new Date()
    const timeline: Record<string, { repairs: number; revenue: number }> = {}
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(now, i)
      const key = format(date, 'yyyy-MM-dd')
      timeline[key] = { repairs: 0, revenue: 0 }
    }
    filteredRepairs.forEach(repair => {
      const key = format(repair.date, 'yyyy-MM-dd')
      if (timeline[key]) {
        timeline[key].repairs += 1
        if (repair.status === 'Completado') {
          timeline[key].revenue += repair.cost
        }
      }
    })
    return Object.entries(timeline).map(([date, data]) => ({
      date: format(new Date(date), 'dd/MM'),
      repairs: data.repairs,
      revenue: data.revenue,
    }))
  }
  const timelineData = getTimelineData()
  // Paginación
  const paginatedRepairs = filteredRepairs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredRepairs.length / itemsPerPage)
  // Exportar CSV
  const handleExport = () => {
    const csvData = filteredRepairs.map(repair => ({
      Ticket: repair.ticketId,
      Cliente: repair.client,
      Dispositivo: repair.device,
      Tipo: repair.deviceType,
      Problema: repair.issue,
      Estado: repair.status,
      Fecha: format(repair.date, 'dd/MM/yyyy'),
      Costo: repair.cost,
      Técnico: repair.technician,
    }))
    exportToCSV(csvData, 'reporte-reparaciones')
  }
  const handleRetry = () => {
    setError(false)
    setLoading(true)
    // Conectar con API real
    setTimeout(() => {
      setLoading(false)
    }, 800)
  }
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 space-y-6"
      >
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
        <Skeleton className="h-80" />
      </motion.div>
    )
  }
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6"
      >
        <Card className="p-12 text-center">
          <MdErrorOutline size={64} className="mx-auto text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error al cargar el reporte</h2>
          <p className="text-muted-foreground mb-4">Hubo un problema al obtener los datos de reparaciones.</p>
          <Button onClick={handleRetry}>Reintentar</Button>
        </Card>
      </motion.div>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reporte de Reparaciones</h1>
          <p className="text-muted-foreground">Análisis detallado de las reparaciones realizadas</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2" disabled={filteredRepairs.length === 0}>
          <MdFileDownload size={18} />
          Exportar
        </Button>
      </div>
      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {['Hoy', '7 días', '30 días', 'Este año'].map((p) => (
              <Badge
                key={p}
                variant={period === p ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => setPeriod(p as any)}
              >
                {p}
              </Badge>
            ))}
            <Badge
              variant={period === 'Personalizado' ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => setPeriod('Personalizado')}
            >
              Personalizado
            </Badge>
          </div>
          {period === 'Personalizado' && (
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={customRange.start}
                onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                className="px-3 py-1.5 rounded-lg border border-input bg-background text-sm"
              />
              <span className="text-muted-foreground">-</span>
              <input
                type="date"
                value={customRange.end}
                onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                className="px-3 py-1.5 rounded-lg border border-input bg-background text-sm"
              />
            </div>
          )}
        </div>
      </Card>
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MdBuild className="h-5 w-5 text-primary" />
              </div>
              {filteredRepairs.length > 0 && (
                <Badge variant="success" size="sm" className="gap-1">
                  <MdTrendingUp size={12} />
                  +5%
                </Badge>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">{totalRepairs}</p>
            <p className="text-sm text-muted-foreground">Total de reparaciones</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <MdCheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              {filteredRepairs.length > 0 && (
                <Badge variant="success" size="sm" className="gap-1">
                  <MdTrendingUp size={12} />
                  +12%
                </Badge>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">{completedRepairs}</p>
            <p className="text-sm text-muted-foreground">Reparaciones completadas</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <MdPending className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{pendingRepairs}</p>
            <p className="text-sm text-muted-foreground">Reparaciones pendientes</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <MdAttachMoney className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
            <p className="text-sm text-muted-foreground">Ingresos por reparaciones</p>
          </CardContent>
        </Card>
      </div>
      {/* KPIs secundarios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <MdSchedule className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{averageRepairTime.toFixed(1)} días</p>
            <p className="text-sm text-muted-foreground">Tiempo promedio de reparación</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <MdAttachMoney className="h-5 w-5 text-violet-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(averageRepairCost)}</p>
            <p className="text-sm text-muted-foreground">Costo promedio por reparación</p>
          </CardContent>
        </Card>
      </div>
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico por estado */}
        <Card>
          <CardHeader>
            <CardTitle>Reparaciones por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            {repairsByStatus.every(d => d.value === 0) ? (
              <div className="text-center py-12 text-muted-foreground">
                <MdBuild size={48} className="mx-auto mb-4 text-muted-foreground/40" />
                <p>No hay datos de reparaciones</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={repairsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {repairsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <Card className="p-3 shadow-lg">
                            <p className="text-sm font-semibold">{payload[0].name}</p>
                            <p className="text-sm text-muted-foreground">{payload[0].value} reparaciones</p>
                          </Card>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        {/* Gráfico por tipo de dispositivo */}
        <Card>
          <CardHeader>
            <CardTitle>Reparaciones por Tipo de Dispositivo</CardTitle>
          </CardHeader>
          <CardContent>
            {repairsByDevice.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MdDevices size={48} className="mx-auto mb-4 text-muted-foreground/40" />
                <p>Sin datos de dispositivos</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={repairsByDevice}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <Card className="p-3 shadow-lg">
                            <p className="text-sm font-semibold">{payload[0].payload.name}</p>
                            <p className="text-sm text-muted-foreground">{payload[0].value} reparaciones</p>
                          </Card>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {repairsByDevice.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Línea de tiempo */}
      <Card>
        <CardHeader>
          <CardTitle>Reparaciones e Ingresos (Últimos 7 días)</CardTitle>
        </CardHeader>
        <CardContent>
          {timelineData.every(d => d.repairs === 0 && d.revenue === 0) ? (
            <div className="text-center py-12 text-muted-foreground">
              <MdSchedule size={48} className="mx-auto mb-4 text-muted-foreground/40" />
              <p>No hay datos de reparaciones para mostrar</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorRepairs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" yAxisId="left" />
                <YAxis className="text-xs" yAxisId="right" orientation="right" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <Card className="p-3 shadow-lg">
                          <p className="text-sm font-semibold">{payload[0].payload.date}</p>
                          <p className="text-sm text-primary">Reparaciones: {payload.find(p => p.name === 'repairs')?.value || 0}</p>
                          <p className="text-sm text-success">Ingresos: {formatCurrency(payload.find(p => p.name === 'revenue')?.value as number || 0)}</p>
                        </Card>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="repairs" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRepairs)" name="Reparaciones" />
                <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" name="Ingresos" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      {/* Tabla de reparaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Reparaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRepairs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MdBuild size={48} className="mx-auto mb-4 text-muted-foreground/40" />
              <p>No hay reparaciones en el período seleccionado</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-card/80 backdrop-blur-md sticky top-0">
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Ticket</th>
                      <th className="pb-3 font-medium">Cliente</th>
                      <th className="pb-3 font-medium">Dispositivo</th>
                      <th className="pb-3 font-medium">Problema</th>
                      <th className="pb-3 font-medium text-center">Estado</th>
                      <th className="pb-3 font-medium">Fecha</th>
                      <th className="pb-3 font-medium text-right">Costo</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {paginatedRepairs.map((repair) => (
                      <tr
                        key={repair.id}
                        className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/repairs/${repair.id}`)}
                      >
                        <td className="py-3 font-mono">{repair.ticketId}</td>
                        <td className="py-3">{repair.client}</td>
                        <td className="py-3">{repair.device}</td>
                        <td className="py-3">{repair.issue}</td>
                        <td className="py-3 text-center">
                          <Badge
                            variant={
                              repair.status === 'Completado' ? 'success' :
                              repair.status === 'En Progreso' ? 'default' :
                              repair.status === 'Pendiente' ? 'warning' : 'destructive'
                            }
                            size="sm"
                          >
                            {repair.status}
                          </Badge>
                        </td>
                        <td className="py-3">{format(repair.date, 'dd/MM/yyyy', { locale: es })}</td>
                        <td className="py-3 text-right font-semibold">{formatCurrency(repair.cost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Paginación */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredRepairs.length)} de {filteredRepairs.length}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
export default RepairsReport
