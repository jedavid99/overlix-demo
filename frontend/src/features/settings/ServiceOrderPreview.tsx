import React from 'react'
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
  showWatermark: boolean
  watermarkUrl: string
}
interface ServiceOrderPreviewProps {
  data: ServiceOrderData
  className?: string
}
export default function ServiceOrderPreviewOptimized({ data, className = '' }: ServiceOrderPreviewProps) {
  const texts = {
    authorizedCenter: 'Centro de Servicio Técnico Autorizado',
    serviceOrder: 'ORDEN DE SERVICIO',
    date: 'Fecha',
    customerInfo: 'Información del Cliente',
    deviceInfo: 'Información del Dispositivo',
    problemDescription: 'Descripción del Problema',
    customerAuthorization: 'Autorización del Cliente',
    digitalSignature: 'Firma Digital/Manual',
    estimatedTotal: 'Total Estimado',
    exclTaxes: 'Excl. impuestos aplicables',
    cutHere: 'Cortar aquí para copia técnica',
    technicalRoutingCopy: 'Copia de Ruta Técnica',
    priority: 'Prioridad',
    standard: 'ESTÁNDAR',
    diagnosticChecklist: 'Lista de Verificación de Diagnóstico',
    powerSupply: 'Fuente de Alimentación',
    batteryHealth: 'Salud de la Batería',
    motherboard: 'Placa Madre',
    coolingSystem: 'Sistema de Refrigeración',
    timeTracking: 'Registro de Tiempo',
    start: 'Inicio',
    end: 'Fin',
    partNumberDescription: 'Número de Parte / Descripción',
    qty: 'Cant.',
    location: 'Ubicación',
    technicianProgressNotes: 'Notas de Progreso del Técnico',
    technicianSignature: 'Firma del Técnico',
    techId: 'ID Técnico',
    finalQCStatus: 'ESTADO FINAL DE CONTROL DE CALIDAD',
    formId: 'Formulario SO-TECH-2024-V2',
    confidential: 'Documento Interno Confidencial',
    page: 'Página 1 de 1',
    warranty: 'GARANTÍA',
    warrantyTerms: 'Términos y Condiciones de Garantía',
  }
  return (
    <div className={`bg-white text-[#191c1d] font-sans ${className}`} style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px' }}>
      <div className="max-w-[800px] mx-auto border border-[#c3c5d7] shadow-sm print-container overflow-hidden relative">
        {/* MARCA DE AGUA (WATERMARK) */}
        {data.showWatermark && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 z-0">
            {data.watermarkUrl ? (
              <img src={data.watermarkUrl} alt="Watermark Logo" className="w-48 h-auto object-contain" />
            ) : (
              <div className="text-6xl font-bold text-[#003fb1] transform -rotate-45">
                {data.companyName || 'LOGO'}
              </div>
            )}
          </div>
        )}
        {/* SECTION 1: CUSTOMER ORDER */}
        <section className="p-4 relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h1 className="text-2xl font-bold text-[#003fb1] uppercase tracking-tight">
                {data.companyName || 'TechServe Pro'}
              </h1>
              <p className="text-[10px] font-semibold uppercase text-[#434654] mt-0.5 tracking-wider">
                {texts.authorizedCenter}
              </p>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-semibold uppercase text-[#555f6d]">{texts.serviceOrder}</div>
              <div className="text-2xl font-bold text-[#191c1d]">{data.orderNumber || '#SO-2024-0892'}</div>
              <div className="text-xs font-mono text-[#434654] mt-0.5">{texts.date}: {data.orderDate || '24 oct 2024'}</div>
            </div>
          </div>
          {/* Customer & Device Info */}
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="border border-[#c3c5d7] p-3">
              <div className="text-[10px] font-semibold uppercase text-[#555f6d] mb-1.5 tracking-wider">{texts.customerInfo}</div>
              <div className="text-base font-semibold text-[#191c1d]">{data.clientName || 'Juan Pérez'}</div>
              <div className="text-sm text-[#434654] mt-0.5">
                {data.clientEmail || 'jperez@ejemplo.com'}<br />
                {data.clientPhone || '+54 9 11 1234-5678'}
              </div>
            </div>
            <div className="border border-[#c3c5d7] p-3">
              <div className="text-[10px] font-semibold uppercase text-[#555f6d] mb-1.5 tracking-wider">{texts.deviceInfo}</div>
              <div className="text-base font-semibold text-[#191c1d]">{data.deviceModel || 'Laptop Dell XPS 15'}</div>
              <div className="text-sm text-[#434654] mt-0.5">
                N/S: {data.deviceSerial || '5XJ2K93-8821'}<br />
                IMEI: {data.deviceImei || '—'}
              </div>
            </div>
          </div>
          {/* Problem Description */}
          <div className="mb-3 border border-[#c3c5d7]">
            <div className="bg-[#f3f4f5] px-3 py-1.5 border-b border-[#c3c5d7] text-[10px] font-semibold uppercase text-[#191c1d] tracking-wider">
              {texts.problemDescription}
            </div>
            <div className="p-3 text-sm text-[#434654] min-h-[50px]">
              {data.repairDescription || 'El cliente reporta estrangulamiento térmico frecuente y apagados repentinos durante tareas de alto rendimiento. El ventilador emite un ruido metálico. Solicita limpieza interna, reemplazo de pasta térmica y diagnóstico de hardware.'}
            </div>
          </div>
          {/* Warranty Terms */}
          {data.warrantyTerms && (
            <div className="mt-3 border border-[#c3c5d7]">
              <div className="bg-[#f3f4f5] px-3 py-1.5 border-b border-[#c3c5d7] text-[10px] font-semibold uppercase text-[#191c1d] tracking-wider flex items-center gap-2">
                <span>{texts.warranty}</span>
                {data.warrantyMonths && <span className="text-[#003fb1]">- {data.warrantyMonths} MESES</span>}
              </div>
              <div className="p-3 text-xs text-[#434654] whitespace-pre-line">
                {data.warrantyTerms}
              </div>
            </div>
          )}
          {/* Authorization & Total */}
          <div className="flex justify-between items-end mt-3">
            <div className="w-1/2">
              <div className="text-[10px] font-semibold uppercase text-[#555f6d] mb-2 tracking-wider">{texts.customerAuthorization}</div>
              <div className="border-b border-[#737686] h-8 w-full mb-0.5"></div>
              <div className="text-xs font-mono text-[#434654]">{data.clientName || 'Juan Pérez'} - {texts.digitalSignature}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-semibold uppercase text-[#555f6d] tracking-wider">{texts.estimatedTotal}</div>
              <div className="text-2xl font-bold text-[#003fb1]">${data.totalPrice || '150.00'}</div>
              <div className="text-xs text-[#434654]">{texts.exclTaxes}</div>
            </div>
          </div>
        </section>
        {/* PERFORATION LINE */}
        <div className="relative py-3 flex items-center justify-center z-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-[1px] bg-gradient-to-r from-[#737686] via-[#737686] to-transparent bg-repeat-x" style={{ backgroundSize: '15px 1px' }}></div>
          </div>
          <div className="relative bg-white px-3 flex items-center gap-2 text-[#737686]">
            <span className="transform rotate-90 text-xs">✂</span>
            <span className="text-[10px] font-semibold italic tracking-wider">{texts.cutHere}</span>
          </div>
        </div>
        {/* SECTION 2: TECHNICAL ORDER */}
        <section className="p-4 bg-[#ffffff] relative z-10">
          <div className="flex justify-between items-center mb-3 border-b border-[#c3c5d7] pb-2">
            <div>
              <div className="text-[10px] font-semibold uppercase text-[#555f6d] tracking-wider">{texts.technicalRoutingCopy}</div>
              <div className="text-base font-semibold text-[#191c1d]">{data.orderNumber || '#SO-2024-0892'}</div>
            </div>
            <div className="flex gap-3">
              <div className="text-right">
                <div className="text-[10px] font-semibold uppercase text-[#555f6d] tracking-wider">{texts.priority}</div>
                <span className="bg-[#d6e0f1] text-[#191c1d] px-1.5 py-0.5 rounded text-[10px] font-semibold">{texts.standard}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-3">
            {/* Left column: Diagnostic & Time */}
            <div className="col-span-1 space-y-3">
              <div className="border border-[#c3c5d7] p-3">
                <div className="text-[10px] font-semibold uppercase text-[#555f6d] mb-2 tracking-wider">{texts.diagnosticChecklist}</div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-[#737686] rounded-sm flex items-center justify-center text-[9px]"></div>
                    <span className="text-xs">{texts.powerSupply}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-[#737686] rounded-sm flex items-center justify-center text-[9px]"></div>
                    <span className="text-xs">{texts.batteryHealth}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-[#737686] rounded-sm flex items-center justify-center text-[9px]"></div>
                    <span className="text-xs">{texts.motherboard}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-[#737686] rounded-sm flex items-center justify-center text-[9px]"></div>
                    <span className="text-xs">{texts.coolingSystem}</span>
                  </div>
                </div>
              </div>
              <div className="border border-[#c3c5d7] p-3">
                <div className="text-[10px] font-semibold uppercase text-[#555f6d] mb-2 tracking-wider">{texts.timeTracking}</div>
                <div className="space-y-1.5">
                  <div className="flex justify-between border-b border-[#c3c5d7] pb-0.5">
                    <span className="text-xs">{texts.start}:</span>
                    <span className="font-mono text-xs">__:__</span>
                  </div>
                  <div className="flex justify-between border-b border-[#c3c5d7] pb-0.5">
                    <span className="text-xs">{texts.end}:</span>
                    <span className="font-mono text-xs">__:__</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Right column: Parts table & Notes */}
            <div className="col-span-2">
              <div className="border border-[#c3c5d7] overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#f3f4f5] border-b border-[#c3c5d7]">
                    <tr>
                      <th className="px-3 py-1.5 text-[10px] font-semibold uppercase text-[#191c1d]">{texts.partNumberDescription}</th>
                      <th className="px-3 py-1.5 text-[10px] font-semibold uppercase text-[#191c1d] w-20">{texts.qty}</th>
                      <th className="px-3 py-1.5 text-[10px] font-semibold uppercase text-[#191c1d] w-28">{texts.location}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c3c5d7]">
                    <tr>
                      <td className="px-3 py-2 font-mono text-xs text-[#191c1d]">MX-6 Compuesto Térmico (4g)</td>
                      <td className="px-3 py-2 text-xs">1</td>
                      <td className="px-3 py-2 text-xs">Estante A-4</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono text-xs text-[#191c1d]">Ventilador de Refrigeración (L)</td>
                      <td className="px-3 py-2 text-xs">1</td>
                      <td className="px-3 py-2 text-xs">Contenedor 12</td>
                    </tr>
                    <tr className="h-8"><td></td><td></td><td></td></tr>
                    <tr className="h-8"><td></td><td></td><td></td></tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-3 border border-[#c3c5d7]">
                <div className="bg-[#f3f4f5] px-3 py-1.5 border-b border-[#c3c5d7] text-[10px] font-semibold uppercase text-[#191c1d] tracking-wider">
                  {texts.technicianProgressNotes}
                </div>
                <div className="p-3 min-h-[60px] font-mono text-xs text-[#434654] italic">
                  {data.technicianNotes || '[Registrar aquí los resultados del diagnóstico y los factores estresantes de los componentes...]'}
                </div>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="flex justify-between items-end border-t border-[#c3c5d7] pt-3">
            <div className="w-1/3">
              <div className="text-[10px] font-semibold uppercase text-[#555f6d] mb-2 tracking-wider">{texts.technicianSignature}</div>
              <div className="border-b border-[#737686] h-8 w-full mb-0.5"></div>
              <div className="font-mono text-xs text-[#434654]">{texts.techId}: {data.technicianName || '_________'}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-semibold uppercase text-[#555f6d] mb-0.5 tracking-wider">{texts.finalQCStatus}</div>
              <div className="flex gap-2 justify-end">
                <div className="w-5 h-5 border border-[#737686] rounded-sm flex items-center justify-center font-bold text-xs">P</div>
                <div className="w-5 h-5 border border-[#737686] rounded-sm flex items-center justify-center font-bold text-xs">F</div>
              </div>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="p-3 border-t border-[#c3c5d7] flex justify-between bg-white font-mono text-[9px] text-[#737686] uppercase relative z-10">
          <span>{texts.formId}</span>
          <span>{texts.confidential}</span>
          <span>{texts.page}</span>
        </footer>
      </div>
    </div>
  )
}
