import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { MdArrowBack, MdAdd, MdDelete, MdSave, MdCheckCircle, MdRefresh } from 'react-icons/md'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
// Tipos
interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}
interface Provider {
  id: string
  name: string
  phone: string
}
interface Product {
  id: string
  name: string
  suggestedPrice: number
}
// Datos mock eliminados - conectar con API real
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)
}
const OrderForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = !!id
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [orderNumber, setOrderNumber] = useState(`#OC-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`)
  const [providerId, setProviderId] = useState('')
  const [issueDate, setIssueDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [deliveryDate, setDeliveryDate] = useState('')
  const [status, setStatus] = useState('Pendiente')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<OrderItem[]>([])
  useEffect(() => {
    if (isEditing) {
      setLoading(true)
      // Simular carga de datos
      setTimeout(() => {
        setOrderNumber('#OC-001')
        setProviderId('1')
        setIssueDate('2024-06-01')
        setDeliveryDate('2024-06-10')
        setStatus('Enviada')
        setNotes('Pedido urgente')
        setItems([
          { id: '1', productId: '1', productName: 'Pantalla iPhone 14', quantity: 5, unitPrice: 85000, subtotal: 425000 },
          { id: '2', productId: '3', productName: 'Batería Samsung J7', quantity: 10, unitPrice: 15000, subtotal: 150000 },
        ])
        setLoading(false)
      }, 500)
    } else {
      // Agregar una fila vacía por defecto
      addItem()
    }
  }, [isEditing])
  const addItem = () => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      subtotal: 0,
    }
    setItems([...items, newItem])
  }
  const removeItem = (itemId: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== itemId))
    }
  }
  const updateItem = (itemId: string, field: keyof OrderItem, value: string | number) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: value }
        if (field === 'productId') {
          // Conectar con API real para obtener datos del producto
          updated.productName = ''
          updated.unitPrice = 0
        }
        if (field === 'quantity' || field === 'unitPrice') {
          updated.subtotal = (updated.quantity || 0) * (updated.unitPrice || 0)
        }
        return updated
      }
      return item
    })
    setItems(updatedItems)
  }
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const iva = subtotal * 0.21
  const total = subtotal + iva
  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!providerId) newErrors.providerId = 'El proveedor es requerido'
    if (!deliveryDate) newErrors.deliveryDate = 'La fecha de entrega es requerida'
    
    if (items.length === 0) {
      newErrors.items = 'Debe agregar al menos un producto'
    } else {
      items.forEach((item, index) => {
        if (!item.productId) newErrors[`item-${index}-product`] = 'El producto es requerido'
        if (item.quantity <= 0) newErrors[`item-${index}-quantity`] = 'La cantidad debe ser mayor a 0'
        if (item.unitPrice <= 0) newErrors[`item-${index}-price`] = 'El precio debe ser mayor a 0'
      })
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    // Simular guardado
    setTimeout(() => {
      setSaving(false)
      navigate('/providers/orders')
    }, 1000)
  }
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-5xl mx-auto"
    >
      {/* Cabecera */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/providers/orders')}>
          <MdArrowBack />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{isEditing ? 'Editar Orden' : 'Nueva Orden de Compra'}</h1>
          <p className="text-muted-foreground">{isEditing ? 'Modificá los datos de la orden' : 'Completá los datos para crear una nueva orden'}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Datos de la orden</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderNumber">Número de orden</Label>
                <Input
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="#OC-XXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider">Proveedor *</Label>
                <Select value={providerId} onValueChange={setProviderId}>
                  <SelectTrigger id="provider" className={errors.providerId ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Conectar con API real: api.get('/providers') */}
                    <SelectItem value="placeholder">Proveedor</SelectItem>
                  </SelectContent>
                </Select>
                {errors.providerId && <p className="text-sm text-destructive">{errors.providerId}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="issueDate">Fecha de emisión</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Fecha estimada de entrega *</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className={errors.deliveryDate ? 'border-destructive' : ''}
                />
                {errors.deliveryDate && <p className="text-sm text-destructive">{errors.deliveryDate}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Enviada">Enviada</SelectItem>
                    <SelectItem value="Recibida">Recibida</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observaciones adicionales..."
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Productos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium text-sm">Producto</th>
                    <th className="text-left p-2 font-medium text-sm w-24">Cantidad</th>
                    <th className="text-left p-2 font-medium text-sm w-32">Precio unitario</th>
                    <th className="text-left p-2 font-medium text-sm w-32">Subtotal</th>
                    <th className="text-left p-2 font-medium text-sm w-16">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">
                        <Select
                          value={item.productId}
                          onValueChange={(value: string) => updateItem(item.id, 'productId', value)}
                        >
                          <SelectTrigger className={errors[`item-${index}-product`] ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Conectar con API real: api.get('/products') */}
                            <SelectItem value="placeholder">Producto</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors[`item-${index}-product`] && (
                          <p className="text-sm text-destructive mt-1">{errors[`item-${index}-product`]}</p>
                        )}
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className={errors[`item-${index}-quantity`] ? 'border-destructive' : ''}
                        />
                        {errors[`item-${index}-quantity`] && (
                          <p className="text-sm text-destructive mt-1">{errors[`item-${index}-quantity`]}</p>
                        )}
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                          className={errors[`item-${index}-price`] ? 'border-destructive' : ''}
                        />
                        {errors[`item-${index}-price`] && (
                          <p className="text-sm text-destructive mt-1">{errors[`item-${index}-price`]}</p>
                        )}
                      </td>
                      <td className="p-2 font-medium">
                        {formatCurrency(item.subtotal)}
                      </td>
                      <td className="p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                        >
                          <MdDelete />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button type="button" variant="outline" onClick={addItem}>
              <MdAdd className="mr-2" />
              Agregar producto
            </Button>
            {errors.items && <p className="text-sm text-destructive">{errors.items}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">IVA (21%)</span>
              <span>{formatCurrency(iva)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/providers/orders')}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <MdRefresh className="mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <MdSave className="mr-2" />
                Guardar orden
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
export default OrderForm
