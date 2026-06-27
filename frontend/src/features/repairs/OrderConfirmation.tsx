import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Check, ArrowLeft, MessageCircle, Download, Loader2,  Printer, EyeIcon } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import ServiceOrderPreview from '@/features/settings/ServiceOrderPreview'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { repairService } from '@/services/repairService'

interface OrderData {
  id: string
  numero_reparacion?: string
  cliente_id: string
  cliente_nombre?: string
  cliente_telefono?: string
  cliente_email?: string
  dispositivo: string
  marca?: string
  modelo?: string
  problema_reportado: string
  diagnosis?: string
  prioridad: string
  fecha_ingreso: string
  tecnico_asignado_id?: string
  notas?: string
}

export default function OrderConfirmation() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingPDF, setGeneratingPDF] = useState(false)
  const pdfRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (orderId && orderId !== 'undefined') {
      console.log('Cargando orden con ID:', orderId)
      fetchOrderData(orderId)
    } else {
      console.error('No se proporcionó ID de orden o ID es undefined')
      toast({
        title: 'Error',
        description: 'No se proporcionó un ID de orden válido',
        variant: 'destructive'
      })
      navigate('/reparaciones/add')
    }
  }, [orderId])

  const fetchOrderData = async (id: string) => {
    try {
      console.log('Intentando obtener orden:', id)
      const response = await repairService.getById(id)
      console.log('Respuesta de orden:', response)
      console.log('Campos de respuesta:', Object.keys(response || {}))
      
      // Extraer datos de response.data.data (estructura: {success: true, data: {orden}})
      const orderData = response?.data?.data || response?.data
      console.log('Datos de orden:', orderData)
      console.log('Campos de orden:', Object.keys(orderData || {}))
      console.log('Datos del cliente:', {
        cliente_nombre: orderData?.cliente_nombre,
        cliente_telefono: orderData?.cliente_telefono,
        cliente_email: orderData?.cliente_email,
      })
      setOrderData(orderData)
    } catch (error: any) {
      console.error('Error al cargar orden:', error)
      console.error('Error response:', error.response?.data)
      
      if (error.response?.status === 404) {
        toast({
          title: 'Orden no encontrada',
          description: 'La orden de servicio no existe en la base de datos',
          variant: 'destructive'
        })
        navigate('/reparaciones/list')
      } else {
        toast({
          title: 'Error',
          description: `No se pudo cargar la orden de servicio: ${error.response?.data?.message || error.message}`,
          variant: 'destructive'
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // Función para generar PDF con la plantilla configurada
  const generateServiceOrderPDF = async (): Promise<Blob | null> => {
    if (!pdfRef.current || !orderData) return null

    setGeneratingPDF(true)
    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

      const pdfBlob = pdf.output('blob')
      return pdfBlob
    } catch (error) {
      console.error('Error al generar el PDF:', error)
      toast({
        title: 'Error',
        description: 'No se pudo generar el PDF',
        variant: 'destructive'
      })
      return null
    } finally {
      setGeneratingPDF(false)
    }
  }

  // Función para descargar PDF
  const handleDownloadPDF = async () => {
    const pdfBlob = await generateServiceOrderPDF()
    if (!pdfBlob) return

    const pdfUrl = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `orden-servicio-${orderData?.id}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Función para enviar PDF por WhatsApp
  const handleSendWhatsAppWithPDF = async () => {
    if (!orderData) return

    const pdfBlob = await generateServiceOrderPDF()
    if (!pdfBlob) return

    const pdfUrl = URL.createObjectURL(pdfBlob)
    const message = `Hola ${orderData.cliente_nombre}, su orden de servicio ${orderData.id} ha sido creada exitosamente. Dispositivo: ${orderData.marca} ${orderData.modelo}. Adjuntamos el PDF con los detalles.`
    const phone = orderData.cliente_telefono?.replace(/\D/g, '')

    toast({
      title: 'PDF Generado',
      description: 'El PDF se ha descargado. Para enviarlo por WhatsApp, adjúntalo manualmente al chat.',
    })

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')

    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `orden-servicio-${orderData.id}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Función para imprimir PDF
  const handlePrintPDF = async () => {
    const pdfBlob = await generateServiceOrderPDF()
    if (!pdfBlob) return

    const pdfUrl = URL.createObjectURL(pdfBlob)
    const printWindow = window.open(pdfUrl, '_blank')
    
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print()
      }
    }
  }

  // Obtener configuración de PDF desde localStorage
  const getPDFConfig = () => {
    try {
      const savedConfig = localStorage.getItem('pdfConfig')
      if (savedConfig) {
        return JSON.parse(savedConfig)
      }
    } catch (error) {
      console.error('Error al cargar configuración PDF:', error)
    }
    // Configuración por defecto con datos de la orden
    return {
      companyName: 'TechFix Reparaciones',
      companyAddress: 'Av. Corrientes 1234, CABA, Argentina',
      companyPhone: '+54 11 4321-1234',
      companyEmail: 'info@techfix.com',
      orderNumber: orderData?.id || 'N/A',
      orderDate: orderData?.fecha_ingreso || new Date().toLocaleDateString('es-AR'),
      clientName: orderData?.cliente_nombre || '',
      clientPhone: orderData?.cliente_telefono || '',
      clientEmail: orderData?.cliente_email || '',
      clientAddress: '',
      clientId: '',
      deviceModel: `${orderData?.marca} ${orderData?.modelo}`.trim() || orderData?.dispositivo || '',
      deviceImei: '',
      deviceSerial: '',
      deviceColor: '',
      deviceStorage: '',
      deviceDescription: orderData?.dispositivo || '',
      repairDescription: orderData?.problema_reportado || '',
      repairDiagnostic: orderData?.diagnosis || '',
      laborCost: typeof orderData?.total_reparacion === 'number' ? orderData.total_reparacion.toFixed(2) : '0.00',
      partsCost: '0.00',
      totalPrice: typeof orderData?.total_reparacion === 'number' ? orderData.total_reparacion.toFixed(2) : (orderData?.total_reparacion || '0.00'),
      warrantyMonths: '12',
      warrantyTerms: 'Garantía por defectos de fabricación y mano de obra por 12 meses.',
      securityType: 'none' as const,
      securityPin: '',
      securityPattern: '',
      securityNotes: '',
      technicianName: '',
      technicianNotes: orderData?.notas || '',
      estimatedTime: '3 días',
      showHeader: true,
      showFooter: true,
      headerText: 'ORDEN DE SERVICIO',
      footerText: 'Este documento es un comprobante de recepción de equipo.',
      showWatermark: false,
      watermarkUrl: '',
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No se encontró la orden de servicio</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/reparaciones/list')}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Vista Previa de Orden de Servicio</h1>
            <p className="text-sm text-muted-foreground">{orderData.numero_reparacion || orderData.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda: Resumen de la orden */}
          <div className="space-y-6">
            {/* Código de orden destacado */}
            <Card className="bg-primary/10 border-primary">
              <CardContent className="p-6 text-center">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Código de Orden de Servicio</p>
                <p className="text-4xl font-bold text-primary">{orderData.numero_reparacion || orderData.id}</p>
              </CardContent>
            </Card>

            {/* Detalles de la orden */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles de la Orden</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Cliente:</span>
                    <span className="font-medium">{orderData.cliente_nombre || '—'}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Teléfono:</span>
                    <span className="font-medium">{orderData.cliente_telefono || '—'}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{orderData.cliente_email || '—'}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Dispositivo:</span>
                    <span className="font-medium">{orderData.marca} {orderData.modelo}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Problema:</span>
                    <span className="font-medium">{orderData.problema_reportado}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Estado:</span>
                    <span className="font-medium capitalize">{orderData.estado || '—'}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Prioridad:</span>
                    <span className="font-medium capitalize">{orderData.prioridad || '—'}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Fecha de ingreso:</span>
                    <span className="font-medium">{orderData.fecha_ingreso || '—'}</span>
                  </div>
                  {orderData.fecha_estimada_entrega && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Fecha estimada de entrega:</span>
                      <span className="font-medium">{orderData.fecha_estimada_entrega}</span>
                    </div>
                  )}
                  {orderData.diagnosis && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Diagnosis:</span>
                      <span className="font-medium">{orderData.diagnosis}</span>
                    </div>
                  )}
                  {orderData.reparacion_realizada && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Reparación realizada:</span>
                      <span className="font-medium">{orderData.reparacion_realizada}</span>
                    </div>
                  )}
                  {orderData.total_reparacion && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-medium">${typeof orderData.total_reparacion === 'number' ? orderData.total_reparacion.toFixed(2) : orderData.total_reparacion}</span>
                    </div>
                  )}
                  {orderData.notas && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Notas:</span>
                      <span className="font-medium">{orderData.notas}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Repuestos */}
            {orderData.repuestos && orderData.repuestos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Repuestos Usados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {orderData.repuestos.map((repuesto: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm border-b pb-2">
                        <span>{repuesto.nombre}</span>
                        <span>{repuesto.cantidad} x ${typeof repuesto.costo_unitario === 'number' ? repuesto.costo_unitario.toFixed(2) : repuesto.costo_unitario || '0.00'}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Foto de Evidencia */}
            {orderData.foto_evidencia && (
              <Card>
                <CardHeader>
                  <CardTitle>Foto de Evidencia</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={orderData.foto_evidencia}
                    alt="Evidencia"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Botones de acción */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <Button
                  onClick={handleSendWhatsAppWithPDF}
                  disabled={generatingPDF}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {generatingPDF ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generando PDF...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4" />
                      Enviar por WhatsApp
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadPDF}
                  disabled={generatingPDF}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {generatingPDF ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Descargar PDF
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handlePrintPDF}
                  disabled={generatingPDF}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {generatingPDF ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Printer className="h-4 w-4" />
                      Imprimir PDF
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Navegación */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/reparaciones/list')}
              >
                Volver a la Lista
              </Button>
              <Button
                onClick={() => navigate('/reparaciones/list')}
              >
                Ver Lista de Reparaciones
              </Button>
            </div>
          </div>

          {/* Columna derecha: Vista previa del PDF */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <EyeIcon size={18} className="text-primary" />
                  <CardTitle>Vista previa de Orden de Servicio</CardTitle>
                  <Badge variant="outline" className="ml-auto text-[10px] font-mono">
                    A4
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden bg-muted/30">
                  <div className="transform scale-[0.5] origin-top-left w-[200%] overflow-hidden">
                    <div ref={pdfRef}>
                      <ServiceOrderPreview data={getPDFConfig()} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
