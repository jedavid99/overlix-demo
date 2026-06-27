import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, subDays, subMonths, startOfYear } from 'date-fns'
import { es } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { MdFileDownload, MdSell, MdTrendingUp, MdTrendingDown, MdBarChart, MdErrorOutline, MdCheckCircle } from 'react-icons/md'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { exportToCSV } from '@/shared/lib/export'
// Tipos
interface Sale {
  id: string
  date: Date
  client: string
  product: string
  quantity: number
  total: number
  status: 'Completada' | 'Pendiente' | 'Cancelada'
  category: string
}
// Datos de ejemplo (comentados – descomentar para probar diseño)
// const sampleSales: Sale[] = [
//   { id: '1', date: new Date(2024, 0, 15), client: 'Cliente A', product: 'iPhone 13', quantity: 2, total: 1200, status: 'Completada', category: 'Celulares' },
//   { id: '2', date: new Date(2024, 0, 16), client: 'Cliente B', product: 'Batería S22', quantity: 1, total: 45, status: 'Completada', category: 'Baterías' },
//   { id: '3', date: new Date(2024, 0, 17), client: 'Cliente C', product: 'Pantalla OLED', quantity: 3, total: 360, status: 'Pendiente', category: 'Pantallas' },
// ]
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)
}
const SalesReport = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [period, setPeriod] = useState<'Hoy' | '7 días' | '30 días' | 'Este año' | 'Personalizado'>('30 días')
  const [customRange, setCustomRange] = useState({ start: '', end: '' })
  const [sales, setSales] = useState<Sale[]>([]) // Inicialmente vacío
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  useEffect(() => {
    // 🔌 Conectar con API real:
    // api.get('/reports/sales').then(res => setSales(res.data)).catch(() => setError(true)).finally(() => setLoading(false))
    
    // 💡 Para probar el diseño, descomentar la línea de abajo y comentar la simulación
    // setSales(sampleSales)
    
    // Simular carga (eliminar esto cuando conectes con la API)
    setTimeout(() => {
      // setSales(sampleSales) // Opcional: descomentar para ver datos de ejemplo
      setLoading(false)
    }, 800)
  }, [])
  // Filtrar ventas por período
  const filteredSales = sales.filter((sale) => {
    if (period === 'Personalizado' && customRange.start && customRange.end) {
      const saleDate = new Date(sale.date)
      const start = new Date(customRange.start)
      const end = new Date(customRange.end)
      return saleDate >= start && saleDate <= end
    }
    
    const now = new Date()
    switch (period) {
      case 'Hoy':
        return sale.date.toDateString() === now.toDateString()
      case '7 días':
        return sale.date >= subDays(now, 7)
      case '30 días':
        return sale.date >= subDays(now, 30)
      case 'Este año':
        return sale.date >= startOfYear(now)
      default:
        return true
    }
  })
  // Calcular KPIs
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0)
  const totalSales = filteredSales.length
  const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0
  const completedSales = filteredSales.filter(s => s.status === 'Completada')
  
  // Producto más vendido
  const productSales = filteredSales.reduce((acc, sale) => {
    if (sale.status === 'Completada') {
      acc[sale.product] = (acc[sale.product] || 0) + sale.quantity
    }
    return acc
  }, {} as Record<string, number>)
  
  const topProduct = Object.entries(productSales).sort((a, b) => b[1] - a[1])[0]
  // Datos para gráfico de evolución
  const evolutionData = filteredSales
    .filter(s => s.status === 'Completada')
    .reduce((acc, sale) => {
      const dateStr = format(sale.date, 'dd/MM', { locale: es })
      const existing = acc.find(d => d.date === dateStr)
      if (existing) {
        existing.amount += sale.total
      } else {
        acc.push({ date: dateStr, amount: sale.total })
      }
      return acc
    }, [] as { date: string; amount: number }[])
    .sort((a, b) => a.date.localeCompare(b.date))
  // Datos para gráfico de categorías
  const categoryData = filteredSales
    .filter(s => s.status === 'Completada')
    .reduce((acc, sale) => {
      const existing = acc.find(c => c.name === sale.category)
      if (existing) {
        existing.value += sale.total
        existing.count += sale.quantity
      } else {
        acc.push({ name: sale.category, value: sale.total, count: sale.quantity })
      }
      return acc
    }, [] as { name: string; value: number; count: number }[])
  // Top 5 productos
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, quantity], index) => ({ name, quantity, position: index + 1 }))
  const maxQuantity = Math.max(...topProducts.map(p => p.quantity), 1)
  // Paginación
  const paginatedSales = filteredSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage)
  // Exportar CSV
  const handleExport = () => {
    const csvData = filteredSales.map(sale => ({
      Fecha: format(sale.date, 'dd/MM/yyyy', { locale: es }),
      Cliente: sale.client,
      Producto: sale.product,
      Cantidad: sale.quantity,
      Total: sale.total,
      Estado: sale.status,
      Categoría: sale.category
    }))
    exportToCSV(csvData, 'reporte-ventas')
  }
  const handleRetry = () => {
    setError(false)
    setLoading(true)
    // Conectar con API real: api.get('/reports/sales')
    setLoading(false)
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
        <Skeleton className="h-80" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
        <Skeleton className="h-64" />
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
          <p className="text-muted-foreground mb-4">Hubo un problema al obtener los datos de ventas.</p>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Reporte de Ventas</h1>
          <p className="text-muted-foreground">Análisis detallado de las ventas del período</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2" disabled={filteredSales.length === 0}>
          <MdFileDownload size={18} />
          Exportar
        </Button>
      </div>
      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          {(['Hoy', '7 días', '30 días', 'Este año', 'Personalizado'] as const).map((p) => (
            <Badge
              key={p}
              variant={period === p ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => setPeriod(p)}
            >
              {p}
            </Badge>
          ))}
          {period === 'Personalizado' && (
            <div className="flex items-center gap-2 ml-4">
              <input
                type="date"
                value={customRange.start}
                onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
              />
              <span className="text-muted-foreground">-</span>
              <input
                type="date"
                value={customRange.end}
                onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
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
                <MdTrendingUp className="h-5 w-5 text-primary" />
              </div>
              {filteredSales.length > 0 && (
                <Badge variant="success" size="sm" className="gap-1">
                  <MdTrendingUp size={12} />
                  +12%
                </Badge>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
            <p className="text-sm text-muted-foreground">Total de ingresos</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <MdSell className="h-5 w-5 text-emerald-600" />
              </div>
              {filteredSales.length > 0 && (
                <Badge variant="success" size="sm" className="gap-1">
                  <MdTrendingUp size={12} />
                  +8%
                </Badge>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">{totalSales}</p>
            <p className="text-sm text-muted-foreground">Cantidad de ventas</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <MdTrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              {filteredSales.length > 0 && (
                <Badge variant="destructive" size="sm" className="gap-1">
                  <MdTrendingDown size={12} />
                  -3%
                </Badge>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(avgTicket)}</p>
            <p className="text-sm text-muted-foreground">Ticket promedio</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <MdSell className="h-5 w-5 text-violet-600" />
              </div>
            </div>
            <p className="text-lg font-bold text-foreground">{topProduct?.[0] || '—'}</p>
            <p className="text-sm text-muted-foreground">Producto más vendido {topProduct ? `(${topProduct[1]} u.)` : ''}</p>
          </CardContent>
        </Card>
      </div>
      {/* Gráfico de evolución */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución de Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          {evolutionData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MdBarChart size={48} className="mx-auto mb-4 text-muted-foreground/40" />
              <p>No hay datos de ventas para mostrar</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={evolutionData}>
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const value = payload[0].value as number
                      return (
                        <Card className="p-3 shadow-lg">
                          <p className="text-sm font-semibold">{payload[0].payload.date}</p>
                          <p className="text-sm text-muted-foreground">{formatCurrency(value)}</p>
                        </Card>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorPrimary)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      {/* Tabla de ventas y gráfico de categorías */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabla de ventas */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSales.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MdBarChart size={48} className="mx-auto mb-4 text-muted-foreground/40" />
                <p>No hay ventas en el período seleccionado</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-card/80 backdrop-blur-md sticky top-0">
                      <tr className="text-left text-sm text-muted-foreground">
                        <th className="pb-3 font-medium">Fecha</th>
                        <th className="pb-3 font-medium">Cliente</th>
                        <th className="pb-3 font-medium">Producto</th>
                        <th className="pb-3 font-medium text-right">Total</th>
                        <th className="pb-3 font-medium text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {paginatedSales.map((sale) => (
                        <tr
                          key={sale.id}
                          className={`border-b border-border hover:bg-muted/50 cursor-pointer transition-colors ${sale.status === 'Completada' ? 'bg-success/5' : ''}`}
                          onClick={() => navigate(`/sales/${sale.id}`)}
                        >
                          <td className="py-3">{format(sale.date, 'dd/MM/yyyy', { locale: es })}</td>
                          <td className="py-3">{sale.client}</td>
                          <td className="py-3">{sale.product}</td>
                          <td className="py-3 text-right font-semibold">{formatCurrency(sale.total)}</td>
                          <td className="py-3 text-center">
                            <Badge
                              variant={sale.status === 'Completada' ? 'success' : sale.status === 'Pendiente' ? 'warning' : 'destructive'}
                              size="sm"
                            >
                              {sale.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Paginación */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredSales.length)} de {filteredSales.length}
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
        {/* Gráfico de categorías */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MdBarChart size={48} className="mx-auto mb-4 text-muted-foreground/40" />
                <p>Sin datos de categorías</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const total = categoryData.reduce((sum, cat) => sum + cat.value, 0)
                          const value = payload[0].value as number
                          const percentage = ((value / total) * 100).toFixed(1)
                          return (
                            <Card className="p-3 shadow-lg">
                              <p className="text-sm font-semibold">{payload[0].name}</p>
                              <p className="text-sm text-muted-foreground">{formatCurrency(value)}</p>
                              <p className="text-xs text-muted-foreground">{percentage}%</p>
                            </Card>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Leyenda */}
                <div className="mt-4 space-y-2">
                  {categoryData.map((cat, index) => (
                    <div key={cat.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span>{cat.name}</span>
                      </div>
                      <span className="font-semibold">{formatCurrency(cat.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Top 5 productos */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Productos Más Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hay productos vendidos en el período</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product) => (
                <div key={product.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {product.position}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-sm text-muted-foreground">{product.quantity} u.</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(product.quantity / maxQuantity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
export default SalesReport
