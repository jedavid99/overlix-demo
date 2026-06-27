import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { MdArrowBack, MdEdit, MdCheckCircle, MdCancel, MdReceipt, MdCalendarToday, MdBusiness, MdAttachMoney, MdLocalShipping, MdBlock } from 'react-icons/md'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
// Tipos
interface OrderItem {
  id: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}
interface Order {
  id: string
  orderNumber: string
  provider: string
  issueDate: Date
  deliveryDate: Date
  actualDeliveryDate?: Date
  total: number
  status: 'Pendiente' | 'Enviada' | 'Recibida' | 'Cancelada'
  notes?: string
}
interface StatusChange {
  status: string
  date: Date
  notes?: string
}
const statusColors = {
  'Pendiente': 'bg-warning/10 text-warning border-warning/20',
  'Enviada': 'bg-primary/10 text-primary border-primary/20',
  'Recibida': 'bg-success/10 text-success border-success/20',
  'Cancelada': 'bg-destructive/10 text-destructive border-destructive/20',
}
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)
}
const OrderDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [statusHistory, setStatusHistory] = useState<StatusChange[]>([])
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  useEffect(() => {
    // Conectar con API real: api.get(`/orders/${id}`)
    setLoading(false)
  }, [id])
  const handleMarkAsReceived = () => {
    if (order) {
      const updatedOrder = { ...order, status: 'Recibida' as const, actualDeliveryDate: new Date() }
      setOrder(updatedOrder)
      setStatusHistory([
        ...statusHistory,
        { status: 'Recibida', date: new Date(), notes: 'Marcada como recibida' },
      ])
    }
  }
  const handleCancelOrder = () => {
    if (order) {
      const updatedOrder = { ...order, status: 'Cancelada' as const }
      setOrder(updatedOrder)
      setStatusHistory([
        ...statusHistory,
        { status: 'Cancelada', date: new Date(), notes: 'Orden cancelada' },
      ])
      setShowCancelDialog(false)
    }
  }
  const canEdit = order && (order.status === 'Pendiente' || order.status === 'Enviada')
  const canMarkAsReceived = order && order.status === 'Enviada'
  const canCancel = order && (order.status === 'Pendiente' || order.status === 'Enviada')
  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="space-y-2 mt-6">
              <div className="h-10 bg-muted rounded" />
              <div className="h-10 bg-muted rounded" />
              <div className="h-10 bg-muted rounded" />
            </div>
          </div>
        </Card>
      </div>
    )
  }
  if (!order) {
    return (
      <Card className="p-12 text-center">
        <MdReceipt className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Orden no encontrada</h3>
        <Button onClick={() => navigate('/providers/orders')}>
          Volver al listado
        </Button>
      </Card>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/providers/orders')}>
            <MdArrowBack />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
            <p className="text-muted-foreground">{order.provider}</p>
          </div>
        </div>
        <Badge className={statusColors[order.status]}>{order.status}</Badge>
      </div>
      {/* Datos generales */}
      <Card>
        <CardHeader>
          <CardTitle>Datos generales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <MdCalendarToday className="text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Fecha de emisión</p>
                <p className="font-medium">{format(order.issueDate, 'dd/MM/yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MdLocalShipping className="text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Fecha estimada de entrega</p>
                <p className="font-medium">{format(order.deliveryDate, 'dd/MM/yyyy')}</p>
              </div>
            </div>
            {order.actualDeliveryDate && (
              <div className="flex items-center gap-3">
                <MdCheckCircle className="text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de entrega real</p>
                  <p className="font-medium">{format(order.actualDeliveryDate, 'dd/MM/yyyy')}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <MdBusiness className="text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Proveedor</p>
                <p className="font-medium">{order.provider}</p>
              </div>
            </div>
          </div>
          {order.notes && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-1">Notas</p>
              <p className="text-sm">{order.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Productos */}
      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-sm">Producto</th>
                  <th className="text-left p-3 font-medium text-sm w-24">Cantidad</th>
                  <th className="text-left p-3 font-medium text-sm w-32">Precio unitario</th>
                  <th className="text-left p-3 font-medium text-sm w-32">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="p-3">{item.productName}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">{formatCurrency(item.unitPrice)}</td>
                    <td className="p-3 font-medium">{formatCurrency(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2">
                  <td colSpan={3} className="p-3 text-right font-medium">Total</td>
                  <td className="p-3 font-bold text-lg">{formatCurrency(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* Timeline de estados */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de estados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusHistory.map((change, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    change.status === 'Pendiente' ? 'bg-warning' :
                    change.status === 'Enviada' ? 'bg-primary' :
                    change.status === 'Recibida' ? 'bg-success' :
                    'bg-destructive'
                  }`} />
                  {index < statusHistory.length - 1 && (
                    <div className="w-0.5 h-8 bg-border" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{change.status}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(change.date, 'dd/MM/yyyy HH:mm')}
                    </span>
                  </div>
                  {change.notes && (
                    <p className="text-sm text-muted-foreground mt-1">{change.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Acciones */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            {canEdit && (
              <Button onClick={() => navigate(`/providers/orders/edit/${order.id}`)}>
                <MdEdit className="mr-2" />
                Editar
              </Button>
            )}
            {canMarkAsReceived && (
              <Button onClick={handleMarkAsReceived} variant="default">
                <MdCheckCircle className="mr-2" />
                Marcar como recibida
              </Button>
            )}
            {canCancel && (
              <Button onClick={() => setShowCancelDialog(true)} variant="destructive">
                <MdCancel className="mr-2" />
                Cancelar orden
              </Button>
            )}
            <Button onClick={() => navigate('/providers/orders')} variant="outline">
              Volver al listado
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Dialog de confirmación de cancelación */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar orden</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cancelar esta orden de compra? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              No, mantener orden
            </Button>
            <Button variant="destructive" onClick={handleCancelOrder}>
              <MdBlock className="mr-2" />
              Sí, cancelar orden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
export default OrderDetail
