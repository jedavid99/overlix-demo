import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, subDays, startOfYear } from 'date-fns'
import { es } from 'date-fns/locale'
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts'
import { MdFileDownload, MdAttachMoney, MdMoneyOff, MdTrendingUp, MdTrendingDown, MdBarChart, MdErrorOutline, MdAccountBalance } from 'react-icons/md'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { exportToCSV } from '@/shared/lib/export'
// Tipos
interface Transaction {
  id: string
  date: Date
  description: string
  type: 'Ingreso' | 'Egreso'
  category: string
  amount: number
}
interface CashFlow {
  month: string
  income: number
  expense: number
  balance: number
}
// Datos de ejemplo (comentados – descomentar para probar diseño)
// const sampleTransactions: Transaction[] = [
//   { id: '1', date: new Date(2024, 0, 15), description: 'Venta iPhone 13', type: 'Ingreso', category: 'Ventas', amount: 1200 },
//   { id: '2', date: new Date(2024, 0, 16), description: 'Alquiler Local', type: 'Egreso', category: 'Alquiler', amount: 350 },
//   { id: '3', date: new Date(2024, 0, 17), description: 'Compra de repuestos', type: 'Egreso', category: 'Repuestos', amount: 450 },
//   { id: '4', date: new Date(2024, 0, 18), description: 'Venta Samsung S23', type: 'Ingreso', category: 'Ventas', amount: 800 },
//   { id: '5', date: new Date(2024, 0, 20), description: 'Salarios empleados', type: 'Egreso', category: 'Salarios', amount: 1200 },
// ]
// const sampleCashFlow: CashFlow[] = [
//   { month: 'Ene', income: 2500, expense: 1800, balance: 700 },
//   { month: 'Feb', income: 3000, expense: 2100, balance: 900 },
//   { month: 'Mar', income: 2800, expense: 1900, balance: 900 },
// ]
const EXPENSE_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6']
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)
}
const FinancialReport = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [period, setPeriod] = useState<'Hoy' | '7 días' | '30 días' | 'Este año' | 'Personalizado'>('30 días')
  const [customRange, setCustomRange] = useState({ start: '', end: '' })
  const [transactions, setTransactions] = useState<Transaction[]>([]) // Inicialmente vacío
  const [cashFlow, setCashFlow] = useState<CashFlow[]>([]) // Inicialmente vacío
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  useEffect(() => {
    // 🔌 Conectar con API real:
    // api.get('/reports/financial').then(res => {
    //   setTransactions(res.data.transactions)
    //   setCashFlow(res.data.cashFlow)
    // }).catch(() => setError(true)).finally(() => setLoading(false))
    
    // 💡 Para probar el diseño, descomentar las líneas de abajo y comentar la simulación
    // setTransactions(sampleTransactions)
    // setCashFlow(sampleCashFlow)
    
    // Simular carga (eliminar esto cuando conectes con la API)
    setTimeout(() => {
      // setTransactions(sampleTransactions) // Opcional: descomentar para ver datos de ejemplo
      // setCashFlow(sampleCashFlow)
      setLoading(false)
    }, 800)
  }, [])
  // Filtrar transacciones por período
  const filteredTransactions = transactions.filter((transaction) => {
    if (period === 'Personalizado' && customRange.start && customRange.end) {
      const transDate = new Date(transaction.date)
      const start = new Date(customRange.start)
      const end = new Date(customRange.end)
      return transDate >= start && transDate <= end
    }
    
    const now = new Date()
    switch (period) {
      case 'Hoy':
        return transaction.date.toDateString() === now.toDateString()
      case '7 días':
        return transaction.date >= subDays(now, 7)
      case '30 días':
        return transaction.date >= subDays(now, 30)
      case 'Este año':
        return transaction.date >= startOfYear(now)
      default:
        return true
    }
  })
  // Calcular KPIs
  const totalIncome = filteredTransactions.filter(t => t.type === 'Ingreso').reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = filteredTransactions.filter(t => t.type === 'Egreso').reduce((sum, t) => sum + t.amount, 0)
  const netProfit = totalIncome - totalExpense
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0
  // Datos para gráfico de ingresos vs egresos
  const evolutionData = filteredTransactions
    .reduce((acc, transaction) => {
      const dateStr = format(transaction.date, 'dd/MM', { locale: es })
      const existing = acc.find(d => d.date === dateStr)
      if (existing) {
        if (transaction.type === 'Ingreso') {
          existing.income += transaction.amount
        } else {
          existing.expense += transaction.amount
        }
        existing.balance = existing.income - existing.expense
      } else {
        acc.push({
          date: dateStr,
          income: transaction.type === 'Ingreso' ? transaction.amount : 0,
          expense: transaction.type === 'Egreso' ? transaction.amount : 0,
          balance: transaction.type === 'Ingreso' ? transaction.amount : -transaction.amount
        })
      }
      return acc
    }, [] as { date: string; income: number; expense: number; balance: number }[])
    .sort((a, b) => a.date.localeCompare(b.date))
  // Datos para gráfico de distribución de gastos
  const expenseData = filteredTransactions
    .filter(t => t.type === 'Egreso')
    .reduce((acc, transaction) => {
      const existing = acc.find(c => c.name === transaction.category)
      if (existing) {
        existing.value += transaction.amount
      } else {
        acc.push({ name: transaction.category, value: transaction.amount })
      }
      return acc
    }, [] as { name: string; value: number }[])
  // Paginación
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  // Totales de la página actual
  const pageIncome = paginatedTransactions.filter(t => t.type === 'Ingreso').reduce((sum, t) => sum + t.amount, 0)
  const pageExpense = paginatedTransactions.filter(t => t.type === 'Egreso').reduce((sum, t) => sum + t.amount, 0)
  // Exportar CSV
  const handleExport = () => {
    const csvData = filteredTransactions.map(transaction => ({
      Fecha: format(transaction.date, 'dd/MM/yyyy', { locale: es }),
      Descripción: transaction.description,
      Tipo: transaction.type,
      Categoría: transaction.category,
      Monto: transaction.amount
    }))
    exportToCSV(csvData, 'reporte-financiero')
  }
  const handleRetry = () => {
    setError(false)
    setLoading(true)
    // Conectar con API real: api.get('/reports/financial')
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
          <p className="text-muted-foreground mb-4">Hubo un problema al obtener los datos financieros.</p>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Reporte Financiero</h1>
          <p className="text-muted-foreground">Análisis detallado de ingresos y egresos</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2" disabled={filteredTransactions.length === 0}>
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
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <MdAttachMoney className="h-5 w-5 text-emerald-600" />
              </div>
              {filteredTransactions.length > 0 && (
                <Badge variant="success" size="sm" className="gap-1">
                  <MdTrendingUp size={12} />
                  +15%
                </Badge>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalIncome)}</p>
            <p className="text-sm text-muted-foreground">Ingresos Totales</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <MdMoneyOff className="h-5 w-5 text-destructive" />
              </div>
              {filteredTransactions.length > 0 && (
                <Badge variant="destructive" size="sm" className="gap-1">
                  <MdTrendingDown size={12} />
                  -8%
                </Badge>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalExpense)}</p>
            <p className="text-sm text-muted-foreground">Egresos Totales</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MdAccountBalance className="h-5 w-5 text-primary" />
              </div>
              {filteredTransactions.length > 0 && (
                <Badge variant={netProfit >= 0 ? 'success' : 'destructive'} size="sm" className="gap-1">
                  {netProfit >= 0 ? <MdTrendingUp size={12} /> : <MdTrendingDown size={12} />}
                  {Math.abs(profitMargin).toFixed(1)}%
                </Badge>
              )}
            </div>
            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(netProfit)}
            </p>
            <p className="text-sm text-muted-foreground">Ganancia Neta</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <MdTrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-foreground">{profitMargin.toFixed(1)}%</p>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${profitMargin >= 0 ? 'bg-success' : 'bg-destructive'} transition-all duration-300`}
                  style={{ width: `${Math.min(Math.abs(profitMargin), 100)}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Margen de Ganancia</p>
          </CardContent>
        </Card>
      </div>
      {/* Gráfico de ingresos vs egresos */}
      <Card>
        <CardHeader>
          <CardTitle>Ingresos vs Egresos</CardTitle>
        </CardHeader>
        <CardContent>
          {evolutionData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MdBarChart size={48} className="mx-auto mb-4 text-muted-foreground/40" />
              <p>No hay datos financieros para mostrar</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={evolutionData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const income = (payload.find(p => p.name === 'income')?.value as number) || 0
                      const expense = (payload.find(p => p.name === 'expense')?.value as number) || 0
                      const balance = income - expense
                      return (
                        <Card className="p-3 shadow-lg">
                          <p className="text-sm font-semibold">{payload[0].payload.date}</p>
                          <p className="text-sm text-success">Ingresos: {formatCurrency(income)}</p>
                          <p className="text-sm text-destructive">Egresos: {formatCurrency(expense)}</p>
                          <p className="text-sm font-semibold">Balance: {formatCurrency(balance)}</p>
                        </Card>
                      )
                    }
                    return null
                  }}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      {/* Tabla de transacciones y gráfico de gastos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabla de transacciones */}
        <Card>
          <CardHeader>
            <CardTitle>Transacciones</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MdBarChart size={48} className="mx-auto mb-4 text-muted-foreground/40" />
                <p>No hay transacciones en el período seleccionado</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-card/80 backdrop-blur-md sticky top-0">
                      <tr className="text-left text-sm text-muted-foreground">
                        <th className="pb-3 font-medium">Fecha</th>
                        <th className="pb-3 font-medium">Descripción</th>
                        <th className="pb-3 font-medium text-center">Tipo</th>
                        <th className="pb-3 font-medium text-right">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {paginatedTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-3">{format(transaction.date, 'dd/MM/yyyy', { locale: es })}</td>
                          <td className="py-3">{transaction.description}</td>
                          <td className="py-3 text-center">
                            <Badge
                              variant={transaction.type === 'Ingreso' ? 'success' : 'destructive'}
                              size="sm"
                            >
                              {transaction.type}
                            </Badge>
                          </td>
                          <td className={`py-3 text-right font-semibold ${transaction.type === 'Ingreso' ? 'text-success' : 'text-destructive'}`}>
                            {transaction.type === 'Ingreso' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Totales de la página */}
                <div className="flex items-center justify-between mt-4 p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Ingresos (página)</p>
                    <p className="text-sm font-semibold text-success">{formatCurrency(pageIncome)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Egresos (página)</p>
                    <p className="text-sm font-semibold text-destructive">{formatCurrency(pageExpense)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Balance (página)</p>
                    <p className={`text-sm font-semibold ${pageIncome - pageExpense >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {formatCurrency(pageIncome - pageExpense)}
                    </p>
                  </div>
                </div>
                
                {/* Paginación */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} de {filteredTransactions.length}
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
        {/* Gráfico de distribución de gastos */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            {expenseData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MdBarChart size={48} className="mx-auto mb-4 text-muted-foreground/40" />
                <p>Sin datos de gastos</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const total = expenseData.reduce((sum, cat) => sum + cat.value, 0)
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
                  {expenseData.map((cat, index) => (
                    <div key={cat.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: EXPENSE_COLORS[index % EXPENSE_COLORS.length] }} />
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
      {/* Flujo de caja */}
      <Card>
        <CardHeader>
          <CardTitle>Flujo de Caja (Últimos 3 meses)</CardTitle>
        </CardHeader>
        <CardContent>
          {cashFlow.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MdBarChart size={48} className="mx-auto mb-4 text-muted-foreground/40" />
              <p>No hay datos de flujo de caja disponibles</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cashFlow}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <Card className="p-3 shadow-lg">
                          <p className="text-sm font-semibold">{payload[0].payload.month}</p>
                          <p className="text-sm text-success">Ingresos: {formatCurrency(payload[0].payload.income)}</p>
                          <p className="text-sm text-destructive">Egresos: {formatCurrency(payload[0].payload.expense)}</p>
                          <p className="text-sm font-semibold">Balance: {formatCurrency(payload[0].payload.balance)}</p>
                        </Card>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
                <Bar dataKey="income" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Egresos" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
export default FinancialReport
