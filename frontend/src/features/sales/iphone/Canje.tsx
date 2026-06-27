import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Plus, Smartphone, TrendingUp, TrendingDown, Wallet, Filter } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import DataTable from '@/shared/components/data-table'
export default function IphoneCanje() {
  const navigate = useNavigate()
  
  // Datos mock eliminados - conectar con API real
  return (
   <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Canje iPhone</h1>
          <p className="text-muted-foreground">Gestión del plan canje para iPhone</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Exportar
          </Button>
          <Button onClick={() => navigate('/iphone-canje/new')}>
            <Plus size={16} className="mr-2" />
            Nueva operación
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Canjes este mes</p>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground"></p>
            <div className="flex items-center gap-1 text-green-600 text-sm mt-2">
              <TrendingUp size={16} />
              <span>% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Valor promedio</p>
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">$</p>
            <div className="flex items-center gap-1 text-red-500 text-sm mt-2">
              <TrendingDown size={16} />
              <span>% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ingresos totales</p>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">$</p>
            <div className="flex items-center gap-1 text-green-600 text-sm mt-2">
              <TrendingUp size={16} />
              <span>% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Filter size={20} className="text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rango de fechas</label>
              <select className="w-full rounded border border-input bg-background text-foreground py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring/20">
                <option>Últimos 30 días</option>
                <option>Último trimestre</option>
                <option>Este año</option>
                <option>Personalizado</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Modelo usado</label>
              <select className="w-full rounded border border-input bg-background text-foreground py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring/20">
                <option>Todos los modelos</option>
                <option>iPhone 13 Pro</option>
                <option>iPhone 12</option>
                <option>iPhone 11</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Técnico</label>
              <select className="w-full rounded border border-input bg-background text-foreground py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring/20">
                <option>Todos los técnicos</option>
                <option>Alex Rivera</option>
                <option>Jordan Smith</option>
                <option>Casey Jones</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</label>
              <select className="w-full rounded border border-input bg-background text-foreground py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring/20">
                <option>Todos los estados</option>
                <option>Completado</option>
                <option>En reacondicionamiento</option>
                <option>Revendido</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      <DataTable
        // Conectar con API real: api.get('/iphone/canje')
        data={[]}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        loading={false}
        emptyMessage="No hay operaciones de canje"
      />
    </div>
  )
}
