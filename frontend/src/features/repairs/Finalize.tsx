import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Smartphone,
  AlertTriangle,
  Info,
  Check,
  Save,
  Printer,
  PenTool,
  CreditCard,
  DollarSign,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import type { RepairData } from './RepairFlow';
interface RepairFinalizeProps {
  data?: RepairData;
  updateData?: (updates: Partial<RepairData>) => void;
  onBack?: () => void;
  onComplete?: () => void;
  currentStep?: number;
}
export default function RepairFinalize({ data, updateData, onBack = () => {}, onComplete = () => {}, currentStep = 3 }: RepairFinalizeProps) {
  const defaultData: RepairData = {
    selectedClient: null,
    deviceType: 'phone',
    brand: '',
    model: '',
    serial: '',
    aestheticCondition: '',
    accessories: [],
    issueDescription: '',
    priority: 'Normal',
    estimatedDays: 3,
    hardwareChecks: {
      power: true,
      display: true,
      wifi: false,
      bluetooth: true,
      cameras: true,
      audio: true,
    },
    securityType: 'pin',
    accessPin: '920431',
    patternDots: [true, false, false, true, true, false, false, false, true],
    patternSequence: [],
    technicianNotes: '',
    termsAccepted: false,
    signaturePad: '',
    printOption: 'both',
  };
  const [localData, setLocalData] = React.useState<RepairData>(defaultData);
  const [paymentMethod, setPaymentMethod] = React.useState('card');
  const [withWarranty, setWithWarranty] = React.useState(true);
  const state = data ?? localData;
  const applyUpdate = (updates: Partial<RepairData>) => {
    if (updateData) updateData(updates);
    else setLocalData(prev => ({ ...prev, ...updates }));
  };
  const laborCost = 85.00;
  const partsCost = 210.00;
  const depositPaid = 150.00;
  const subtotal = laborCost + partsCost;
  const finalBalance = subtotal - depositPaid;
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-[1200px] mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <a className="hover:text-blue-600" href="#">Reparaciones</a>
                <span>/</span>
                <span className="text-slate-900">Ticket #REP-001</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Entrega de Equipo & Pago Final
              </h1>
              <p className="text-slate-500 text-base">Finaliza la liquidación del ticket y entrega el dispositivo al cliente</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-bold text-sm shadow-sm hover:bg-slate-50">
              <Printer size={18} />
              <span>Previsualización</span>
            </button>
          </div>
          {/* Status Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="size-2 rounded-full bg-green-500"></span>
                  Listo para Entrega
                </div>
                <h3 className="text-xl font-bold text-slate-900">Reparado & Completamente Probado</h3>
                <p className="text-slate-600 text-sm">El dispositivo ha pasado todas las pruebas de calidad e inspección final.</p>
              </div>
            </div>
          </div>
        </div>
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Repair Summary (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Repair Summary Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                  <Smartphone size={20} className="text-blue-600" />
                  Resumen de Reparación
                </h2>
                <span className="text-slate-500 font-mono bg-slate-50 px-3 py-1 rounded border border-slate-200 text-sm">#REP-001</span>
              </div>
              {/* Device & Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Device */}
                <div className="flex gap-4">
                  <div className="size-14 rounded-xl bg-slate-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Smartphone size={28} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Detalles del Dispositivo</p>
                    <p className="text-base font-bold text-slate-900">{state.brand} {state.model || 'Device'}</p>
                    <p className="text-xs text-slate-600">SN: {state.serial || 'N/A'}</p>
                  </div>
                </div>
                {/* Customer */}
                <div className="flex gap-4">
                  <div className="size-14 rounded-xl bg-slate-100 flex items-center justify-center text-blue-600 shrink-0">
                    <span className="text-lg font-bold">{state.selectedClient?.name.charAt(0) || 'C'}</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Cliente</p>
                    <p className="text-base font-bold text-slate-900">{state.selectedClient?.name || 'Cliente'}</p>
                    <p className="text-xs text-slate-600">{state.selectedClient?.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
              {/* Services & Notes */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3">Servicios Realizados</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700">
                      <Check size={16} className="text-green-500" />
                      {state.issueDescription || 'Reparación General'}
                    </span>
                  </div>
                </div>
                {state.technicianNotes && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Notas del Técnico</h4>
                    <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-sm text-slate-700 italic">
                      {state.technicianNotes}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Terms & Signature */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Terms */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-slate-400" />
                  Términos & Condiciones
                </h3>
                <div className="flex-1 bg-slate-50 p-3 rounded-lg text-xs text-slate-600 leading-relaxed mb-4 max-h-40 overflow-y-auto border border-slate-100">
                  <p className="mb-2"><span className="font-bold text-slate-700">1. Garantía</span></p>
                  <p className="mb-3">
                    Piezas y mano de obra cubierta por garantía limitada de 90 días, excluyendo daño físico o por líquido después de la reparación.
                  </p>
                  <p className="mb-2"><span className="font-bold text-slate-700">2. Responsabilidad</span></p>
                  <p>
                    El proveedor no es responsable por pérdida de datos. Se recomienda respaldo previo.
                  </p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.termsAccepted}
                    onChange={(e) => applyUpdate({ termsAccepted: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    He leído y aceptolos términos y condiciones anteriores
                  </span>
                </label>
              </div>
              {/* Signature */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <PenTool size={18} className="text-slate-400" />
                  Firma del Cliente
                </h3>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center min-h-32 flex items-center justify-center relative bg-gradient-to-br from-slate-50 to-white">
                  {!state.signaturePad ? (
                    <span className="text-slate-400 text-xs italic">Firmar aquí...</span>
                  ) : (
                    <div className="text-xl font-bold text-slate-900">{state.signaturePad}</div>
                  )}
                </div>
                <button
                  onClick={() => applyUpdate({ signaturePad: state.selectedClient?.name || 'Cliente' })}
                  className="mt-3 text-xs text-blue-600 hover:underline font-bold"
                >
                  Demo Firma
                </button>
              </div>
            </div>
          </div>
          {/* Right Side: Financial Settlement (1/3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Financial Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                <div className="bg-slate-900 text-white p-6">
                  <h2 className="text-lg font-bold">Liquidación Financiera</h2>
                  <p className="text-slate-400 text-xs mt-1">Finaliza el pago antes de la entrega</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Presupuesto Total</span>
                      <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600 bg-green-50 p-2 rounded border border-green-100">
                      <span>Depósito Pagado</span>
                      <span className="font-bold">-${depositPaid.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between items-start">
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-1">Saldo a Pagar</p>
                        <p className="text-2xl font-bold text-blue-600">${finalBalance.toFixed(2)}</p>
                      </div>
                      <DollarSign className="text-blue-600 text-3xl" />
                    </div>
                  </div>
                  {/* Payment Method */}
                  <div className="space-y-3 border-t border-slate-100 pt-6">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wide">Método de Pago</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`flex flex-col items-center gap-2 p-3 border-2 rounded-lg transition-all ${
                          paymentMethod === 'card'
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-slate-100 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        <CreditCard size={20} />
                        <span className="text-xs font-bold">Tarjeta</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('cash')}
                        className={`flex flex-col items-center gap-2 p-3 border-2 rounded-lg transition-all ${
                          paymentMethod === 'cash'
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-slate-100 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        <DollarSign size={20} />
                        <span className="text-xs font-bold">Efectivo</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('transfer')}
                        className={`flex flex-col items-center gap-2 p-3 border-2 rounded-lg transition-all ${
                          paymentMethod === 'transfer'
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-slate-100 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        <AlertCircle size={20} />
                        <span className="text-xs font-bold">Depósito</span>
                      </button>
                    </div>
                  </div>
                  {/* Warranty Toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="text-blue-600" size={20} />
                      <div>
                        <p className="text-sm font-bold text-slate-900">Aplicar Garantía</p>
                        <p className="text-xs text-slate-500">90 días piezas & mano de obra</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={withWarranty}
                        onChange={(e) => setWithWarranty(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => onComplete()}
                      disabled={!state.termsAccepted || !state.signaturePad}
                      className={`w-full font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all ${
                        state.termsAccepted && state.signaturePad
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle2 size={20} />
                      Completar Entrega
                    </button>
                    <button className="w-full bg-slate-50 border border-slate-200 text-slate-600 font-bold py-3 px-6 rounded-lg hover:bg-slate-100 transition-all">
                      Guardar como Borrador
                    </button>
                    <p className="text-center text-xs text-slate-500 italic">
                      Al completar, se enviará confirmación por SMS y Email al cliente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
