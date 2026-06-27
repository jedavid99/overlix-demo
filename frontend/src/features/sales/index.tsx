import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Calendar, CreditCard, User, ShoppingCart, TrendingUp, TrendingDown, Printer, Eye, RotateCcw, DollarSign, Package } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Input } from '@/shared/components/ui/input'
import DataTable from '@/shared/components/data-table'
type Sale = {
  id: string
  date: string
  customer: { name: string; email?: string }
  items: string
  total: number
  status: 'Paid' | 'Pending' | 'Refunded' | 'Partial'
}
// Datos mock eliminados - conectar con API real
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Paid': return { variant: 'success' as const, label: 'Pagado' }
    case 'Refunded': return { variant: 'warning' as const, label: 'Reembolsado' }
    case 'Partial': return { variant: 'secondary' as const, label: 'Parcial' }
    case 'Pending': return { variant: 'outline' as const, label: 'Pendiente' }
    default: return { variant: 'outline' as const, label: status }
  }
}
export default function Sales() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Ventas</h1>
          <p className="text-muted-foreground">Gestiona tus ventas y transacciones</p>
        </div>
        <Link to="/sales/add">
          <Button>
            <Plus size={16} className="mr-2" />
            Nueva venta
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="success" size="sm">+12.5%</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Ingresos diarios</p>
            <p className="text-3xl font-bold text-foreground">$</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="success" size="sm">%</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Ventas hoy</p>
            <p className="text-3xl font-bold text-foreground"></p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-orange-500" />
              </div>
              <Badge variant="destructive" size="sm">%</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Promedio</p>
            <p className="text-3xl font-bold text-foreground">$</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" size="sm"></Badge>
            </div>
            <p className="text-sm text-muted-foreground">Servicios pendientes</p>
            <p className="text-3xl font-bold text-foreground"></p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar size={16} />
              Rango de fechas
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <CreditCard size={16} />
              Método de pago
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <User size={16} />
              Vendedor
            </Button>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" className="gap-2">
              <Search size={16} />
              Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>
      <DataTable
        // Conectar con API real: api.get('/sales')
        data={[]}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        loading={false}
        emptyMessage="No hay ventas registradas"
      />
    </div>
  )
}
