import React, { useState, useRef } from 'react'
import {
  Download,
  Eye,
  Save,
  RefreshCw,
  Building,
  Award,
  Settings,
} from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Badge } from '@/shared/components/ui/badge'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import ServiceOrderPreview from '@/features/settings/ServiceOrderPreview'
// ============================================================================
// Tipos e interfaces (completos para el preview, pero solo algunas editables)
// ============================================================================
interface ServiceOrderData {
  companyName: string
  companyAddress: string
  companyPhone: string
  companyEmail: string
  orderNumber: string
  orderDate: string
  clientName: string
  clientPhone: string
  clientEmail: string
  clientAddress: string
  clientId: string
  deviceModel: string
  deviceImei: string
  deviceSerial: string
  deviceColor: string
  deviceStorage: string
  deviceDescription: string
  repairDescription: string
  repairDiagnostic: string
  laborCost: string
  partsCost: string
  totalPrice: string
  warrantyMonths: string
  warrantyTerms: string
  securityType: 'none' | 'pin' | 'pattern' | 'fingerprint'
  securityPin: string
  securityPattern: string
  securityNotes: string
  technicianName: string
  technicianNotes: string
  estimatedTime: string
  showHeader: boolean
  showFooter: boolean
  headerText: string
  footerText: string
  fontSize: number
  margin: number
  showClientSection: boolean
  showTechnicianSection: boolean
  showSecurityInfo: boolean
  showWarrantyTerms: boolean
  showSignatures: boolean
  showWatermark: boolean
  watermarkUrl: string
}
// ============================================================================
// Valores por defecto (con datos de ejemplo para la vista previa)
// ============================================================================
const defaultData: ServiceOrderData = {
  companyName: 'TechFix Reparaciones',
  companyAddress: 'Av. Corrientes 1234, CABA, Argentina',
  companyPhone: '+54 11 4321-1234',
  companyEmail: 'info@techfix.com',
  orderNumber: `OS-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  orderDate: new Date().toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }),
  // Datos de ejemplo para el preview (no editables en este panel)
  clientName: 'Juan Pérez',
  clientPhone: '+54 9 11 1234-5678',
  clientEmail: 'juan.perez@email.com',
  clientAddress: 'Av. Rivadavia 5678, CABA',
  clientId: 'DNI 30.123.456',
  deviceModel: 'iPhone 15 Pro Max',
  deviceImei: '356912087654321',
  deviceSerial: 'G6T5X7Y8Z9',
  deviceColor: 'Titanium Black',
  deviceStorage: '256 GB',
  deviceDescription: 'Pantalla OLED, cámara trasera triple',
  repairDescription: 'Reemplazo de pantalla OLED y reparación de botón de volumen',
  repairDiagnostic: 'Pantalla con líneas verticales y falta de respuesta táctil. Botón de volumen inferior dañado.',
  laborCost: '170.00',
  partsCost: '280.00',
  totalPrice: '450.00',
  warrantyMonths: '12',
  warrantyTerms:
    'Garantía por defectos de fabricación y mano de obra por 12 meses. No cubre daños por agua, golpes o uso indebido posterior a la reparación.',
  securityType: 'pin',
  securityPin: '1234',
  securityPattern: 'Patrón en L (3x3)',
  securityNotes: 'El cliente ha proporcionado la clave de acceso.',
  technicianName: 'Carlos López',
  technicianNotes: 'Verificar la batería durante el proceso.',
  estimatedTime: '3 horas',
  showHeader: true,
  showFooter: true,
  headerText: 'ORDEN DE SERVICIO',
  footerText: 'Este documento es un comprobante de recepción de equipo.',
  fontSize: 10,
  margin: 18,
  showClientSection: true,
  showTechnicianSection: true,
  showSecurityInfo: true,
  showWarrantyTerms: true,
  showSignatures: true,
  showWatermark: false,
  watermarkUrl: '',
}
// ============================================================================
// Componente principal
// ============================================================================
export default function PDFConfig() {
  const [data, setData] = useState<ServiceOrderData>(defaultData)
  const [isGenerating, setIsGenerating] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const handleChange = <K extends keyof ServiceOrderData>(key: K, value: ServiceOrderData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }
  // ============================================================================
  // Generación de PDF con html2canvas + jsPDF
  // ============================================================================
  const generatePDF = async () => {
    if (!previewRef.current) return
    setIsGenerating(true)
    try {
      const canvas = await html2canvas(previewRef.current, {
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
      pdf.save('orden-servicio.pdf')
    } catch (error) {
      console.error('Error al generar el PDF:', error)
      alert('Ocurrió un error al generar el PDF. Por favor, inténtalo de nuevo.')
    } finally {
      setIsGenerating(false)
    }
  }
  // ============================================================================
  // Panel de configuración (solo Empresa, Garantía y Marca de agua)
  // ============================================================================
  const renderConfigPanel = () => (
    <div className="space-y-4">
      {/* ========== EMPRESA ========== */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Building size={16} className="text-primary" /> Empresa
          </h3>
          <Input
            value={data.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            placeholder="Nombre de la empresa"
          />
          <Input
            value={data.companyAddress}
            onChange={(e) => handleChange('companyAddress', e.target.value)}
            placeholder="Dirección"
          />
          <Input
            value={data.companyPhone}
            onChange={(e) => handleChange('companyPhone', e.target.value)}
            placeholder="Teléfono"
          />
          <Input
            value={data.companyEmail}
            onChange={(e) => handleChange('companyEmail', e.target.value)}
            placeholder="Email"
          />
          <div className="flex gap-2">
            <Input
              value={data.orderNumber}
              onChange={(e) => handleChange('orderNumber', e.target.value)}
              placeholder="N° Orden"
              className="flex-1"
            />
            <Input
              type="date"
              value={data.orderDate}
              onChange={(e) => handleChange('orderDate', e.target.value)}
              className="w-32"
            />
          </div>
        </CardContent>
      </Card>
      {/* ========== GARANTÍA ========== */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Award size={16} className="text-primary" /> Garantía
          </h3>
          <Input
            value={data.warrantyMonths}
            onChange={(e) => handleChange('warrantyMonths', e.target.value)}
            placeholder="Meses de garantía"
          />
          <textarea
            value={data.warrantyTerms}
            onChange={(e) => handleChange('warrantyTerms', e.target.value)}
            placeholder="Términos y condiciones"
            rows={3}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none"
          />
        </CardContent>
      </Card>
      {/* ========== MARCA DE AGUA ========== */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Settings size={16} className="text-primary" /> Marca de agua
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Mostrar marca de agua</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.showWatermark}
                  onChange={(e) => handleChange('showWatermark', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            {data.showWatermark && (
              <Input
                value={data.watermarkUrl}
                onChange={(e) => handleChange('watermarkUrl', e.target.value)}
                placeholder="URL del logo (marca de agua)"
              />
            )}
          </div>
        </CardContent>
      </Card>
      {/* Botones de acción */}
      <div className="flex flex-col gap-3">
        <Button
          onClick={() => {
            setData(defaultData)
            alert('Configuración restablecida a los valores predeterminados.')
          }}
          variant="outline"
          className="w-full"
        >
          <RefreshCw size={16} className="mr-2" />
          Restablecer
        </Button>
        <Button
          onClick={() => {
            alert('Configuración guardada localmente.')
          }}
          className="w-full"
        >
          <Save size={16} className="mr-2" />
          Guardar configuración
        </Button>
      </div>
    </div>
  )
  // ============================================================================
  // Renderizado principal
  // ============================================================================
  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Generador de Orden de Servicio</h2>
          <p className="text-muted-foreground">Personaliza la empresa, garantía y marca de agua</p>
        </div>
        <Button onClick={generatePDF} disabled={isGenerating} className="gap-2">
          {isGenerating ? (
            <span className="animate-spin">⟳</span>
          ) : (
            <Download size={18} />
          )}
          {isGenerating ? 'Generando...' : 'Descargar PDF'}
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de configuración (solo 3 secciones) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
            {renderConfigPanel()}
          </div>
        </div>
        {/* Vista previa */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Eye size={18} className="text-primary" />
                <h3 className="font-bold text-foreground">Vista previa</h3>
                <Badge variant="outline" className="ml-auto text-[10px] font-mono">
                  A4
                </Badge>
              </div>
              <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
                <div ref={previewRef} className="transform scale-[0.7] origin-top-left w-[143%]">
                  <ServiceOrderPreview data={data} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                La vista previa se actualiza automáticamente con cada cambio.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
