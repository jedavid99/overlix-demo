import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'
import { MdAdd, MdSearch, MdFileDownload, MdReceipt, MdErrorOutline, MdVisibility, MdEdit, MdAttachMoney, MdCalendarToday, MdBusiness, MdRefresh } from 'react-icons/md'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { Input } from '../../components/ui/input'
import { exportToCSV } from '../../lib/export'
// Tipos
interface Order {
  id: string
  orderNumber: string
  provider: string
  issueDate: Date
  deliveryDate: Date
  total: number
  status: 'Pendiente' | 'Enviada' | 'Recibida' | 'Cancelada'
  notes?: string
}
// Datos mock eliminados - conectar con API real
const statusColors = {
  'Pendiente': 'bg-warning/10 text-warning border-warning/20',
  'Enviada': 'bg-primary/10 text-primary border-primary/20',
  'Recibida': 'bg-success/10 text-success border-success/20',
  'Cancelada': 'bg-destructive/10 text-destructive border-destructive/20',
}
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)
}
const OrdersList = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('Todas')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  useEffect(() => {
    // Conectar con API real: api.get('/orders')
    setLoading(false)
  }, [])
  // Filtrar órdenes
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.provider.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'Todas' || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })
  // Paginación
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  // KPIs
  const pendingOrders = orders.filter(o => o.status === 'Pendiente').length
  const thisMonthTotal = orders
    .filter(o => {
      const now = new Date()
      const orderDate = o.issueDate
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, o) => sum + o.total, 0)
  const nextDelivery = orders
    .filter(o => o.status === 'Enviada' || o.status === 'Pendiente')
    .sort((a, b) => a.deliveryDate.getTime() - b.deliveryDate.getTime())[0]
  const activeProviders = new Set(orders.map(o => o.provider)).size
  // Exportar CSV
  const handleExport = () => {
    const exportData = filteredOrders.map(order => ({
      'Nº Orden': order.orderNumber,
      'Proveedor': order.provider,
      'Fecha Emisión': format(order.issueDate, 'dd/MM/yyyy'),
      'Fecha Entrega': format(order.deliveryDate, 'dd/MM/yyyy'),
      'Total': order.total,
      'Estado': order.status,
    }))
    exportToCSV(exportData, 'ordenes-compra')
  }
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <Card className="p-12 text-center">
          <MdErrorOutline className="w-16 h-16 mx-auto text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error al cargar las órdenes</h3>
          <p className="text-muted-foreground mb-4">Hubo un problema al obtener los datos</p>
          <Button onClick={() => { setError(false); setLoading(true) }}>
            Reintentar
          </Button>
        </Card>
      </motion.div>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Órdenes de Compra</h1>
          <p className="text-muted-foreground">Gestioná los pedidos a proveedores y su estado</p>
        </div>
        <Button onClick={() => navigate('/providers/orders/add')}>
          <MdAdd className="mr-2" />
          Nueva orden
        </Button>
      </div>
      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por número o proveedor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['Todas', 'Pendiente', 'Enviada', 'Recibida', 'Cancelada'].map(status => (
                <Badge
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </Badge>
              ))}
            </div>
            <Button variant="outline" onClick={handleExport}>
              <MdFileDownload className="mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Órdenes pendientes</span>
              <Badge variant="warning">{pendingOrders}</Badge>
            </div>
            <div className="text-2xl font-bold">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total este mes</span>
              <MdAttachMoney className="text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{formatCurrency(thisMonthTotal)}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Próxima entrega</span>
              <MdCalendarToday className="text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">
              {nextDelivery ? format(nextDelivery.deliveryDate, 'dd/MM') : '-'}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Proveedores activos</span>
              <MdBusiness className="text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{activeProviders}</div>
          </CardContent>
        </Card>
      </div>
      {/* Tabla de órdenes */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-card/80 backdrop-blur-md sticky top-0">
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-sm">Nº Orden</th>
                  <th className="text-left p-4 font-medium text-sm">Proveedor</th>
                  <th className="text-left p-4 font-medium text-sm">Fecha emisión</th>
                  <th className="text-left p-4 font-medium text-sm">Fecha entrega</th>
                  <th className="text-left p-4 font-medium text-sm">Total</th>
                  <th className="text-left p-4 font-medium text-sm">Estado</th>
                  <th className="text-left p-4 font-medium text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                    </tr>
                  ))
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center">
                      <MdReceipt className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">No hay órdenes de compra</p>
                      <Button onClick={() => navigate('/providers/orders/add')}>
                        Crear primera orden
                      </Button>
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map(order => (
                    <tr key={order.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4 font-medium">{order.orderNumber}</td>
                      <td className="p-4">{order.provider}</td>
                      <td className="p-4">{format(order.issueDate, 'dd/MM/yyyy')}</td>
                      <td className="p-4">{format(order.deliveryDate, 'dd/MM/yyyy')}</td>
                      <td className="p-4 font-medium">{formatCurrency(order.total)}</td>
                      <td className="p-4">
                        <Badge className={statusColors[order.status]}>{order.status}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/providers/orders/${order.id}`)}
                          >
                            <MdVisibility />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/providers/orders/edit/${order.id}`)}
                          >
                            <MdEdit />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Paginación */}
          {!loading && filteredOrders.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-muted-foreground">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredOrders.length)} de {filteredOrders.length} órdenes
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
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
export default OrdersList
