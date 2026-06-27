import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { subDays } from 'date-fns'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts'
import { MdFileDownload, MdSearch, MdInventory2, MdWarning, MdShoppingCart, MdBarChart, MdErrorOutline, MdCheckCircle } from 'react-icons/md'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { exportToCSV } from '@/shared/lib/export'
// Tipos
interface Product {
  id: string
  name: string
  category: string
  stock: number
  minStock: number
  price: number
  cost: number
  lastSale?: Date
}
// Datos mock eliminados - conectar con API real
const categories = ['Todos', 'Celulares', 'Baterías', 'Pantallas', 'Flex', 'Carcasas', 'Insumos']
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)
}
const StockReport = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  useEffect(() => {
    // Conectar con API real: api.get('/reports/stock')
    setLoading(false)
  }, [])
  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })
  // Calcular KPIs
  const totalItems = filteredProducts.reduce((sum, p) => sum + p.stock, 0)
  const lowStockItems = filteredProducts.filter(p => p.stock < p.minStock).length
  const totalInventoryValue = filteredProducts.reduce((sum, p) => sum + (p.cost * p.stock), 0)
  const avgStock = filteredProducts.length > 0 ? totalItems / filteredProducts.length : 0
  const totalSales = filteredProducts.reduce((sum, p) => sum + (p.lastSale ? 1 : 0), 0)
  const inventoryTurnover = avgStock > 0 ? (totalSales / avgStock) : 0
  // Datos para gráfico de barras por categoría
  const categoryData = categories
    .filter(cat => cat !== 'Todos')
    .map(cat => {
      const catProducts = filteredProducts.filter(p => p.category === cat)
      const totalStock = catProducts.reduce((sum, p) => sum + p.stock, 0)
      const lowStockCount = catProducts.filter(p => p.stock < p.minStock).length
      const criticalCount = catProducts.filter(p => p.stock <= p.minStock / 2).length
      
      let color = '#10b981' // verde
      if (criticalCount > catProducts.length / 2) color = '#ef4444' // rojo
      else if (lowStockCount > catProducts.length / 3) color = '#f59e0b' // naranja
      
      return { name: cat, stock: totalStock, color }
    })
  // Productos bajo stock mínimo
  const criticalStockProducts = filteredProducts.filter(p => p.stock < p.minStock)
  // Productos sin movimiento (últimos 30 días)
  const noMovementProducts = filteredProducts.filter(p => !p.lastSale || (new Date().getTime() - p.lastSale.getTime()) > 30 * 24 * 60 * 60 * 1000)
  // Paginación
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  // Exportar CSV
  const handleExport = () => {
    const csvData = filteredProducts.map(product => ({
      Producto: product.name,
      Categoría: product.category,
      'Stock Actual': product.stock,
      'Stock Mínimo': product.minStock,
      'Precio Venta': product.price,
      'Costo': product.cost,
      'Valor Total': product.cost * product.stock,
      Estado: product.stock < product.minStock ? 'Crítico' : 'Normal'
    }))
    exportToCSV(csvData, 'reporte-stock')
  }
  const handleRetry = () => {
    setError(false)
    setLoading(true)
    // Conectar con API real: api.get('/reports/stock')
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
          <p className="text-muted-foreground mb-4">Hubo un problema al obtener los datos de stock.</p>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Reporte de Stock</h1>
          <p className="text-muted-foreground">Análisis detallado del inventario</p>
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
                <MdInventory2 className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalItems}</p>
            <p className="text-sm text-muted-foreground">Total de ítems en stock</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <MdWarning className="h-5 w-5 text-destructive" />
              </div>
            </div>
            <p className="text-2xl font-bold text-destructive">{lowStockItems}</p>
            <p className="text-sm text-muted-foreground">Ítems bajo stock mínimo</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <MdShoppingCart className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalInventoryValue)}</p>
            <p className="text-sm text-muted-foreground">Valor total del inventario</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <MdBarChart className="h-5 w-5 text-blue-600" />
              </div>
              <Badge
                variant={inventoryTurnover > 2 ? 'success' : inventoryTurnover > 1 ? 'warning' : 'destructive'}
                size="sm"
              >
                {inventoryTurnover.toFixed(2)}x
              </Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">Rotación</p>
            <p className="text-sm text-muted-foreground">Ratio inventario/ventas</p>
          </CardContent>
        </Card>
      </div>
      {/* Alertas de stock crítico */}
      <Card className={criticalStockProducts.length > 0 ? 'border-destructive/50' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MdWarning className={criticalStockProducts.length > 0 ? 'text-destructive' : 'text-success'} />
            Alertas de Stock Crítico
          </CardTitle>
        </CardHeader>
        <CardContent>
          {criticalStockProducts.length > 0 ? (
            <div className="space-y-3">
              {criticalStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">Stock actual: {product.stock} / Mínimo: {product.minStock}</p>
                  </div>
                  <Button onClick={() => navigate('/providers')} variant="outline" size="sm" className="gap-1">
                    <MdShoppingCart size={14} />
                    Comprar
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <MdCheckCircle size={48} className="mx-auto text-success mb-3" />
              <p className="text-sm font-medium text-success">Todos los productos tienen stock suficiente</p>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Gráfico de barras por categoría */}
      <Card>
        <CardHeader>
          <CardTitle>Stock por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <Card className="p-3 shadow-lg">
                        <p className="text-sm font-semibold">{payload[0].payload.name}</p>
                        <p className="text-sm text-muted-foreground">{payload[0].value} unidades</p>
                      </Card>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Tabla de productos */}
      <Card>
        <CardHeader>
          <CardTitle>Inventario de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-card/80 backdrop-blur-md sticky top-0">
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Producto</th>
                  <th className="pb-3 font-medium">Categoría</th>
                  <th className="pb-3 font-medium">Stock Actual</th>
                  <th className="pb-3 font-medium">Stock Mínimo</th>
                  <th className="pb-3 font-medium text-right">Precio Venta</th>
                  <th className="pb-3 font-medium text-center">Estado</th>
                  <th className="pb-3 font-medium text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {paginatedProducts.map((product) => {
                  const isLowStock = product.stock < product.minStock
                  const stockRatio = product.stock / product.minStock
                  const stockColor = stockRatio <= 1 ? 'bg-destructive' : stockRatio <= 2 ? 'bg-amber-500' : 'bg-success'
                  
                  return (
                    <tr
                      key={product.id}
                      className={`border-b border-border hover:bg-muted/50 transition-colors ${isLowStock ? 'bg-destructive/5' : ''}`}
                    >
                      <td className="py-3 font-medium">{product.name}</td>
                      <td className="py-3">{product.category}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span>{product.stock}</span>
                          <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${stockColor} transition-all duration-300`}
                              style={{ width: `${Math.min((product.stock / (product.minStock * 2)) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3">{product.minStock}</td>
                      <td className="py-3 text-right font-semibold">{formatCurrency(product.price)}</td>
                      <td className="py-3 text-center">
                        <Badge
                          variant={isLowStock ? 'destructive' : 'success'}
                          size="sm"
                        >
                          {isLowStock ? 'Crítico' : 'Normal'}
                        </Badge>
                      </td>
                      <td className="py-3 text-center">
                        {isLowStock && (
                          <Button onClick={() => navigate('/providers')} variant="outline" size="sm" className="gap-1">
                            <MdShoppingCart size={14} />
                            Comprar
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {/* Paginación */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} de {filteredProducts.length}
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
        </CardContent>
      </Card>
      {/* Productos sin movimiento */}
      {noMovementProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Productos Sin Movimiento (30 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {noMovementProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">Stock: {product.stock} | Última venta: {product.lastSale ? 'Hace más de 30 días' : 'Nunca'}</p>
                  </div>
                  <Badge variant="warning" size="sm">Revisar</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}
export default StockReport
