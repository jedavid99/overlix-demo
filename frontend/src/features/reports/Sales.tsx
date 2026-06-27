import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { subDays, format, parseISO } from 'date-fns'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts'
import { MdFileDownload, MdSearch, MdInventory2, MdWarning, MdShoppingCart, MdBarChart, MdErrorOutline, MdCheckCircle, MdAttachMoney, MdReceipt } from 'react-icons/md'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { exportToCSV } from '@/shared/lib/export'
// Tipos
interface Sale {
  id: string
  productName: string
  category: string
  quantity: number
  total: number
  date: Date
  status: 'completed' | 'pending' | 'cancelled'
}
interface SalesData {
  date: string
  sales: number
}
// Datos mock eliminados – conectar con API real
const sales: Sale[] = []
const categories = ['Todos', 'Celulares', 'Baterías', 'Pantallas', 'Flex', 'Carcasas', 'Insumos']
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)
}
const SalesReport = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [period, setPeriod] = useState('30d') // 7d, 30d, month
  const [salesData, setSalesData] = useState<Sale[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  useEffect(() => {
    // Conectar con API real: api.get('/reports/sales')
    setLoading(false)
  }, [])
  // Filtrar ventas
  const filteredSales = salesData.filter((sale) => {
    const matchesCategory = selectedCategory === 'Todos' || sale.category === selectedCategory
    const matchesSearch = sale.productName.toLowerCase().includes(searchQuery.toLowerCase())
    let matchesPeriod = true
    const now = new Date()
    if (period === '7d') {
      matchesPeriod = sale.date >= subDays(now, 7)
    } else if (period === '30d') {
      matchesPeriod = sale.date >= subDays(now, 30)
    } else if (period === 'month') {
      matchesPeriod = sale.date.getMonth() === now.getMonth() && sale.date.getFullYear() === now.getFullYear()
    }
    return matchesCategory && matchesSearch && matchesPeriod
  })
  // Calcular KPIs
  const totalItems = filteredSales.reduce((sum, s) => sum + s.quantity, 0)
  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0)
  const totalTransactions = filteredSales.length
  const averageTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0
  // Datos para gráfico de barras (ventas por día)
  const getDailySales = (): SalesData[] => {
    const days = 7
    const now = new Date()
    const dailySales: Record<string, number> = {}
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(now, i)
      const key = format(date, 'yyyy-MM-dd')
      dailySales[key] = 0
    }
    filteredSales.forEach(sale => {
      const key = format(sale.date, 'yyyy-MM-dd')
      if (dailySales[key] !== undefined) {
        dailySales[key] += sale.total
      }
    })
    return Object.entries(dailySales).map(([date, sales]) => ({
      date: format(parseISO(date), 'dd/MM'),
      sales
    }))
  }
  const dailyData = getDailySales()
  // Paginación
  const paginatedSales = filteredSales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage)
  // Exportar CSV
  const handleExport = () => {
    const csvData = filteredSales.map(sale => ({
      Producto: sale.productName,
      Categoría: sale.category,
      Cantidad: sale.quantity,
      Total: sale.total,
      Fecha: format(sale.date, 'dd/MM/yyyy'),
      Estado: sale.status === 'completed' ? 'Completado' : sale.status === 'pending' ? 'Pendiente' : 'Cancelado'
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
        <Skeleton className="h-96" />
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
          <p className="text-muted-foreground">Análisis detallado de las transacciones</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <MdFileDownload size={18} />
          Exportar
        </Button>
      </div>
      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {['7d', '30d', 'month'].map((p) => (
              <Badge
                key={p}
                variant={period === p ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => setPeriod(p)}
              >
                {p === '7d' && 'Última semana'}
                {p === '30d' && 'Último mes'}
                {p === 'month' && 'Mes actual'}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <MdSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      </Card>
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MdShoppingCart className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalItems}</p>
            <p className="text-sm text-muted-foreground">Unidades vendidas</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <MdAttachMoney className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
            <p className="text-sm text-muted-foreground">Ingresos totales</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <MdReceipt className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalTransactions}</p>
            <p className="text-sm text-muted-foreground">Transacciones</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <MdBarChart className="h-5 w-5 text-purple-600" />
              </div>
              <Badge
                variant={averageTicket > 100 ? 'success' : 'warning'}
                size="sm"
              >
                {formatCurrency(averageTicket)}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">Ticket promedio</p>
            <p className="text-sm text-muted-foreground">Por transacción</p>
          </CardContent>
        </Card>
      </div>
      {/* Gráfico de ventas diarias */}
      <Card>
        <CardHeader>
          <CardTitle>Ventas diarias (últimos 7 días)</CardTitle>
        </CardHeader>
        <CardContent>
          {dailyData.every(d => d.sales === 0) ? (
            <div className="text-center py-12 text-muted-foreground">
              <MdBarChart size={48} className="mx-auto mb-4 text-muted-foreground/40" />
              <p>No hay datos de ventas para mostrar</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <Card className="p-3 shadow-lg">
                          <p className="text-sm font-semibold">{payload[0].payload.date}</p>
                          <p className="text-sm text-muted-foreground">{formatCurrency(payload[0].value as number)}</p>
                        </Card>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                  {dailyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.sales > 0 ? '#3b82f6' : '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      {/* Tabla de ventas */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSales.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MdCheckCircle size={48} className="mx-auto mb-4 text-muted-foreground/40" />
              <p>No hay ventas registradas en el período seleccionado</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-card/80 backdrop-blur-md sticky top-0">
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Producto</th>
                      <th className="pb-3 font-medium">Categoría</th>
                      <th className="pb-3 font-medium text-center">Cantidad</th>
                      <th className="pb-3 font-medium text-right">Total</th>
                      <th className="pb-3 font-medium">Fecha</th>
                      <th className="pb-3 font-medium text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {paginatedSales.map((sale) => (
                      <tr key={sale.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 font-medium">{sale.productName}</td>
                        <td className="py-3">{sale.category}</td>
                        <td className="py-3 text-center">{sale.quantity}</td>
                        <td className="py-3 text-right font-semibold">{formatCurrency(sale.total)}</td>
                        <td className="py-3">{format(sale.date, 'dd/MM/yyyy')}</td>
                        <td className="py-3 text-center">
                          <Badge
                            variant={
                              sale.status === 'completed' ? 'success' :
                              sale.status === 'pending' ? 'warning' : 'destructive'
                            }
                            size="sm"
                          >
                            {sale.status === 'completed' ? 'Completado' :
                             sale.status === 'pending' ? 'Pendiente' : 'Cancelado'}
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
    </motion.div>
  )
}
export default SalesReport
