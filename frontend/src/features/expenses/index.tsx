import React, { useState } from 'react'
import { Calendar, Filter, CreditCard, Download, TrendingUp, Clock, AlertCircle, PieChart, Info, Plus } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
export default function Expenses() {
  const [dateFilter, setDateFilter] = useState('last-30')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  // 📦 Datos de muestra ELIMINADOS – array vacío (cargar desde API)
  const expenses: {
    id: number
    date: string
    description: string
    category: string
    categoryColor: string
    supplier: string
    amount: number
    status: string
  }[] = []
  // KPIs calculados (todos en 0)
  const totalMonth = expenses.reduce((sum, e) => sum + e.amount, 0)
  const pendingCount = expenses.filter(e => e.status === 'Pending').length
  const pendingApproval = expenses.filter(e => e.status === 'Pending').length // simplificado
  // Agrupar por categoría para el gráfico (vacío)
  const categoryTotals: Record<string, number> = {}
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount
  })
  const categories = Object.keys(categoryTotals)
  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0)
  // Colores para el gráfico (solo si hay datos)
  const categoryColors: Record<string, string> = {
    Parts: 'text-primary',
    Rent: 'text-purple-500',
    Salaries: 'text-rose-500',
    Tools: 'text-amber-500',
  }
  const getCategoryBadge = (color: string) => {
    switch (color) {
      case 'blue': return { variant: 'default' as const }
      case 'purple': return { variant: 'secondary' as const }
      case 'rose': return { variant: 'destructive' as const }
      case 'amber': return { variant: 'warning' as const }
      default: return { variant: 'outline' as const }
    }
  }
  const getStatusBadge = (status: string) => {
    return status === 'Paid'
      ? { variant: 'success' as const }
      : { variant: 'warning' as const }
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Gastos</h1>
          <p className="text-muted-foreground">Monitorea y analiza los costos operativos del negocio</p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" />
          Nuevo gasto
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total (Mes)</p>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">${totalMonth.toFixed(2)}</p>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-2">
              <span>Sin datos disponibles</span>
            </div>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pagos Pendientes</p>
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">{pendingCount}</p>
            <p className="text-muted-foreground text-sm mt-2">Esperando aprobación: {pendingApproval}</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categoría Principal</p>
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <PieChart className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-2">—</p>
            <p className="text-muted-foreground text-sm mt-2">Sin datos</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-full">
                  <Calendar size={18} className="text-muted-foreground" />
                  <select
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                    className="bg-transparent border-none text-sm font-medium p-0 focus:ring-0 cursor-pointer text-foreground"
                  >
                    <option value="last-30">Últimos 30 días</option>
                    <option value="this-month">Este mes</option>
                    <option value="last-quarter">Último trimestre</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-full">
                  <Filter size={18} className="text-muted-foreground" />
                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="bg-transparent border-none text-sm font-medium p-0 focus:ring-0 cursor-pointer text-foreground"
                  >
                    <option value="all">Todas las categorías</option>
                    <option value="rent">Renta</option>
                    <option value="parts">Partes</option>
                    <option value="salaries">Salarios</option>
                    <option value="tools">Herramientas</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-full">
                  <CreditCard size={18} className="text-muted-foreground" />
                  <select
                    value={paymentFilter}
                    onChange={e => setPaymentFilter(e.target.value)}
                    className="bg-transparent border-none text-sm font-medium p-0 focus:ring-0 cursor-pointer text-foreground"
                  >
                    <option value="all">Todos los métodos</option>
                    <option value="bank">Transferencia</option>
                    <option value="card">Tarjeta</option>
                    <option value="cash">Efectivo</option>
                  </select>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">
                  <Download size={16} className="mr-2" />
                  Exportar
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-0">
              {expenses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <AlertCircle size={48} className="text-muted-foreground/40 mb-4" />
                  <p className="text-lg font-semibold text-foreground mb-1">No hay gastos</p>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Aún no hay gastos registrados. Agrega tu primer gasto para comenzar a monitorear los costos.
                  </p>
                  <Button variant="outline" className="mt-4">
                    <Plus size={16} className="mr-2" />
                    Nuevo gasto
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border">
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fecha</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descripción</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categoría</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Proveedor</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monto</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {expenses.map(expense => (
                        <tr key={expense.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 text-sm text-muted-foreground">{expense.date}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-foreground">{expense.description}</td>
                          <td className="px-6 py-4 text-sm">
                            <Badge variant={getCategoryBadge(expense.categoryColor).variant}>
                              {expense.category}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{expense.supplier}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-foreground">${expense.amount.toFixed(2)}</td>
                          <td className="px-6 py-4 text-center">
                            <Badge variant={getStatusBadge(expense.status).variant}>
                              {expense.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {expenses.length > 0 && (
                <div className="p-4 border-t border-border flex items-center justify-between">
                  <p className="text-xs text-muted-foreground font-medium">Mostrando {expenses.length} de {expenses.length} gastos</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>Anterior</Button>
                    <Button variant="default" size="sm">Siguiente</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-foreground font-semibold mb-6 flex items-center gap-2">
                <PieChart size={18} className="text-primary" />
                Distribución por Categoría
              </h3>
              {expenses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="font-medium">Sin datos</p>
                  <p className="text-sm">Agrega gastos para ver la distribución</p>
                </div>
              ) : (
                <>
                  <div className="relative w-48 h-48 mx-auto mb-8">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Aquí iría el gráfico dinámico con los datos reales */}
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="18" className="text-muted/30" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-xs font-semibold text-muted-foreground">Total</span>
                      <span className="text-xl font-bold text-foreground">${totalSpent.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {categories.map(cat => (
                      <div key={cat} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`size-3 rounded-full ${categoryColors[cat] || 'bg-muted'}`} />
                          <span className="text-sm font-medium text-foreground">{cat}</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">${categoryTotals[cat]?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <Button variant="outline" className="w-full mt-6">
                Ver reporte detallado
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-primary/10 dark:bg-primary/5 border-primary/10">
            <CardContent className="p-6">
              <h4 className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <Info size={16} />
                Insights Rápidos
              </h4>
              {expenses.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin insights disponibles. Registra gastos para obtener análisis.</p>
              ) : (
                <ul className="space-y-4">
                  {/* Aquí irían insights reales basados en datos */}
                  <li className="flex gap-3">
                    <Info size={20} className="text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">
                      <span className="font-semibold text-primary">Sin análisis</span> aún. Conecta datos reales para obtener insights.
                    </p>
                  </li>
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
