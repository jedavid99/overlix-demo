import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Power,
  MonitorPlay,
  Wifi,
  Bluetooth,
  Camera,
  Volume2,
  Lock,
  CheckCircle2,
  AlertCircle,
  Info,
  Check,
  Fingerprint,
  Key,
  Eye,
  Battery,
  Zap,
  Smartphone,
  Mic,
  Volume,
  SwitchCamera,
} from 'lucide-react';
import { MdCheck, MdBuild } from 'react-icons/md';
import type { RepairData } from './RepairFlow';
import { RiSimCard2Line } from "react-icons/ri";
interface RepairTechnicalProps {
  data?: RepairData;
  updateData?: (updates: Partial<RepairData>) => void;
  onNext?: () => void;
  onBack?: () => void;
  currentStep?: number;
}
export default function RepairTechnical({ data, updateData, onNext = () => {}, onBack = () => {}, currentStep = 2 }: RepairTechnicalProps) {
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
  const [localData, setLocalData] = useState<RepairData>(defaultData);
  const state = data ?? localData;
  const applyUpdate = (updates: Partial<RepairData>) => {
    if (updateData) updateData(updates);
    else setLocalData(prev => ({ ...prev, ...updates }));
  };
  const hardwareItems = [
    { key: 'botonPawer', label: 'Botón de Power', icon: Power },
    { key: 'botonVolumen', label: 'Botón de Volumen', icon: Volume },
    { key: 'sensorProximidad', label: 'Sensor de Proximidad', icon: Eye },
    { key: 'camaraFrontal', label: 'Cámara Frontal', icon: SwitchCamera  },
    { key: 'modulo', label: 'Módulo', icon: Smartphone },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'huella', label: 'Huella', icon: Fingerprint },
    { key: 'camaraTrasera', label: 'Cámara Trasera', icon: Camera },
    { key: 'audio', label: 'Audio', icon: Volume2 },
    { key: 'altavoz', label: 'Altavoz', icon: Mic  },
    { key: 'fichaCarga', label: 'Ficha de Carga', icon: Zap },
    { key: 'bateria', label: 'Batería', icon: Battery },
{ key: 'lectorSimcard', label: 'Lector de Simcard', icon: RiSimCard2Line  },
    
  ];
  const handleHardwareToggle = (key: string) => {
    const updated = { ...state.hardwareChecks };
    updated[key as keyof typeof state.hardwareChecks] = !updated[key as keyof typeof state.hardwareChecks];
    applyUpdate({ hardwareChecks: updated });
  };
  const functionalCount = Object.values(state.hardwareChecks).filter(Boolean).length;
  // Pattern drawing helpers
  const isDrawing = useRef(false);
  const seqRef = useRef<number[]>(state.patternSequence ? [...state.patternSequence] : []);
  const [localDots, setLocalDots] = useState<boolean[]>(state.patternDots.slice());
  const [refresh, setRefresh] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsPositionRef = useRef<{ x: number; y: number }[]>([]);
  useEffect(() => {
    setLocalDots(state.patternDots.slice());
    seqRef.current = state.patternSequence ? [...state.patternSequence] : [];
  }, [state.patternDots, state.patternSequence]);
  // Calculate dot positions and draw canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Calculate positions (3x3 grid centered in canvas)
    const startX = 35;
    const startY = 35;
    const spacing = 93;
    dotsPositionRef.current = [];
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      dotsPositionRef.current.push({
        x: startX + col * spacing,
        y: startY + row * spacing,
      });
    }
    // Draw lines between connected dots
    if (seqRef.current.length > 1) {
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      const first = dotsPositionRef.current[seqRef.current[0]];
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < seqRef.current.length; i++) {
        const dot = dotsPositionRef.current[seqRef.current[i]];
        ctx.lineTo(dot.x, dot.y);
      }
      ctx.stroke();
    }
  }, [refresh, seqRef.current]);
  const startDraw = (idx: number, e: React.PointerEvent) => {
    isDrawing.current = true;
    try { (e.currentTarget as Element).setPointerCapture(e.pointerId); } catch {}
    if (!seqRef.current.includes(idx)) {
      seqRef.current.push(idx);
      setLocalDots(prev => { const next = [...prev]; next[idx] = true; return next; });
      setRefresh(r => r + 1);
    }
  };
  const enterDot = (idx: number) => {
    if (!isDrawing.current) return;
    if (!seqRef.current.includes(idx)) {
      seqRef.current.push(idx);
      setLocalDots(prev => { const next = [...prev]; next[idx] = true; return next; });
      setRefresh(r => r + 1);
    }
  };
  const endDraw = (e?: React.PointerEvent) => {
    isDrawing.current = false;
    if (e) try { (e.currentTarget as Element).releasePointerCapture(e.pointerId); } catch {}
    applyUpdate({ patternSequence: seqRef.current, patternDots: localDots });
  };
  const clearPattern = () => {
    seqRef.current = [];
    const cleared = Array(9).fill(false);
    setLocalDots(cleared);
    setRefresh(r => r + 1);
    applyUpdate({ patternSequence: [], patternDots: cleared });
  };
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-[1400px] mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Información Técnica</h1>
            <p className="text-muted-foreground text-sm">Paso 2: Información Técnica y Seguridad</p>
          </div>
          {/* Stepper */}
          <div className="hidden md:flex items-center gap-4">
            {[
              { num: 1, label: 'Cliente y Dispositivo', icon: <MdCheck size={16} />, completed: true },
              { num: 2, label: 'Información Técnica', icon: <MdBuild size={16} />, completed: false },
              { num: 3, label: 'Finalizar', icon: <MdCheck size={16} />, completed: false },
            ].map((step, idx) => (
              <React.Fragment key={step.num}>
                <div
                  className={`flex items-center gap-2 opacity-${currentStep >= step.num ? '100' : '40'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStep > step.num
                        ? 'bg-primary/10 text-primary'
                        : currentStep === step.num
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {currentStep > step.num ? <MdCheck size={12} /> : step.num}
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      currentStep >= step.num
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < 2 && <div className="w-8 h-px bg-border"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Hardware & Software Check */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                  <CheckCircle2 size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Chequeo rapido </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {hardwareItems.map((item) => {
                  const Icon = item.icon;
                  const isChecked = state.hardwareChecks[item.key as keyof typeof state.hardwareChecks];
                  return (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          className={`${
                            isChecked ? 'text-blue-600' : 'text-slate-400'
                          }`}
                        />
                        <span className="text-sm font-bold text-slate-700">
                          {item.label}
                        </span>
                      </div>
                      {/* Toggle Switch */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleHardwareToggle(item.key)}
                          className="sr-only"
                        />
                        <div
                          className={`w-11 h-6 rounded-full transition-colors ${
                            isChecked ? 'bg-blue-600' : 'bg-slate-200'
                          }`}
                        >
                          <div
                            className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${
                              isChecked ? 'translate-x-5' : ''
                            }`}
                          />
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </section>
            {/* Two Column Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Security & Access */}
              <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-amber-100 text-amber-600 p-2 rounded-xl">
                    <Lock size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Seguridad y Acceso</h2>
                </div>
                <div className="space-y-6">
                  {/* Security Type Selector */}
                  <div className="flex p-1 bg-slate-100 rounded-xl">
                    {[
                      { id: 'Ninguno', label: 'Ninguno' },
                      { id: 'Pin', label: 'PIN/Pass' },
                      { id: 'Patron', label: 'Patron' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => applyUpdate({ securityType: type.id })}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                          state.securityType === type.id
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                  {state.securityType !== 'Ninguno' && (
                    <div className="space-y-4">
                      {state.securityType === 'Pin' && (
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Accesso por PIN / Clave
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              value={state.accessPin}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => applyUpdate({ accessPin: e.target.value })}
                              placeholder="••••••"
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all font-mono font-bold tracking-widest text-slate-900"
                            />
                            <Lock
                              size={18}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                          </div>
                        </div>
                      )}
                      {state.securityType === 'Patron' && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">
                           Patrón de Bloqueo - Arrastra para dibujar
                          </p>
                          <div className="flex flex-col items-center gap-4">
                            <div className="relative bg-white p-8 rounded-3xl border-2 border-blue-200 shadow-md" style={{ width: '280px', height: '280px' }}>
                              {/* Canvas for drawing lines */}
                              <canvas
                                ref={canvasRef}
                                width={280}
                                height={280}
                                className="absolute inset-0 rounded-3xl"
                                style={{ cursor: 'crosshair' }}
                              />
                              {/* Grid of dots */}
                              <div className="absolute inset-8 grid grid-cols-3 gap-6 pointer-events-none">
                                {localDots.map((_, idx) => (
                                  <div key={idx} className="w-full h-full" />
                                ))}
                              </div>
                              {/* Dot buttons */}
                              <div className="absolute inset-8 grid grid-cols-3 gap-6">
                                {localDots.map((active, idx) => (
                                  <button
                                    key={idx}
                                    onPointerDown={(e) => startDraw(idx, e)}
                                    onPointerEnter={() => enterDot(idx)}
                                    onPointerUp={(e) => endDraw(e)}
                                    onPointerCancel={() => endDraw()}
                                    onPointerLeave={() => {
                                      // Permite movimiento fuera pero no termina
                                    }}
                                    className={`rounded-full transition-all transform touch-none select-none cursor-pointer relative z-10 ${
                                      active
                                        ? 'bg-blue-600 shadow-lg shadow-blue-300 scale-110'
                                        : 'bg-slate-300 hover:bg-slate-400 hover:scale-105'
                                    }`}
                                    style={{
                                      width: '50px',
                                      height: '50px',
                                      margin: 'auto',
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                            
                            {/* Sequence display */}
                            {seqRef.current.length > 0 && (
                              <div className="text-sm text-slate-700 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                                <span className="font-semibold">Secuencia dibujada:</span> {seqRef.current.map(n => n + 1).join(' → ')}
                              </div>
                            )}
                            
                            {/* Clear button */}
                            <button 
                              onClick={clearPattern} 
                              className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-bold transition-colors"
                            >
                              Limpiar Patrón
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
              {/* Internal Diagnosis */}
              <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
                    <AlertCircle size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Diagnóstico interno</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Nota del tecnico
                    </label>
                    <textarea
                      value={state.technicianNotes}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => applyUpdate({ technicianNotes: e.target.value })}
                      placeholder="Introduce los hallazgos preliminares, indicadores de humedad, observaciones de daño interno..."
                      rows={8}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all text-slate-900"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <Check size={20} />
                    <span className="text-xs font-semibold">
                      Listo para seleccionar piezas y revisión final
                    </span>
                  </div>
                </div>
              </section>
            </div>
            {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4">
              <button
                onClick={onBack}
                className="px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                Volver a Información del Cliente
              </button>
              <button
                onClick={onNext}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2 group"
              >
                Siguiente: Revisión Final
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
          {/* Right Column - Ticket Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Ticket Summary Card */}
              <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-lg">Resumen del Ticket</h3>
                    <span className="text-[10px] font-bold bg-blue-600/30 text-blue-300 px-2 py-1 rounded uppercase tracking-widest">
                      En Progreso
                    </span>
                  </div>
                  <div className="space-y-6">
                    {/* Customer */}
                    <div className="flex items-start gap-3">
                      <div className="bg-white/10 p-2 rounded-lg">
                        <svg
                          className="w-5 h-5 text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          Cliente
                        </p>
                        <p className="font-semibold text-sm">{state.selectedClient?.name || 'N/A'}</p>
                        <p className="text-xs text-slate-400">{state.selectedClient?.phone || ''}</p>
                      </div>
                    </div>
                    {/* Device Info */}
                    <div className="flex items-start gap-3">
                      <div className="bg-white/10 p-2 rounded-lg">
                        <svg
                          className="w-5 h-5 text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 18c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5-3H7V4h10v13z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          Información del Dispositivo
                        </p>
                        <p className="font-semibold text-sm">
                          {state.brand && state.model ? `${state.brand} ${state.model}` : 'N/A'}
                        </p>
                        <p className="text-xs text-slate-400 font-mono">
                          IMEI: {state.serial || '---'}
                        </p>
                      </div>
                    </div>
                    {/* Pre-Check Status */}
                    <div className="flex items-start gap-3">
                      <div className="bg-white/10 p-2 rounded-lg">
                        <AlertCircle size={18} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          Estado de Pre-Check
                        </p>
                        <p className="font-semibold text-sm text-green-400">
                          {functionalCount}/13 Funcionales
                        </p>
                        <p className="text-xs text-slate-400">
                          {functionalCount === 13
                            ? 'Todos los sistemas operativos'
                            : `${13 - functionalCount} módulo${13 - functionalCount > 1 ? 's' : ''} defectuoso`}
                        </p>
                      </div>
                    </div>
                    {/* Budget */}
                    <div className="pt-6 border-t border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Tarifa de Servicio</span>
                        <span className="font-bold text-sm">$</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-400 text-sm">Partes Estimadas</span>
                        <span className="font-bold text-sm">$</span>
                      </div>
                      <div className="flex items-center justify-between text-xl font-bold pt-4 border-t border-white/20">
                        <span>Subtotal</span>
                        <span className="text-blue-400">$</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Process Help */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <Info size={18} className="text-blue-600" />
                  <span className="text-xs font-bold text-slate-600">Ayuda del Proceso</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Complete el diagnóstico técnico para generar la cotización final del reparación.
                  Todas las pruebas de hardware son obligatorias para la validación de garantía.
                </p>
                <p className="text-[10px] text-slate-400 mt-4 italic">
                  Borrador actualizado por última vez a las 10:48 AM
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
