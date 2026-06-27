import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Phone,
  ShoppingBag,
  QrCode,
  Power,
  Cloud,
  Receipt,
  CheckCircle,
  X,
  BarChart2,
  Zap,
  Smartphone,
  Volume2,
  ArrowLeft,
  ArrowRight,
  Settings,
} from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { MdCheck } from 'react-icons/md'
export default function CanjeNew() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const [device, setDevice] = useState({ model: '', storage: '', battery: 50 })
  const [imei, setImei] = useState('')
  const [powerOn, setPowerOn] = useState(false)
  const [icloudLogout, setIcloudLogout] = useState(false)
  const [deviceColor, setDeviceColor] = useState('space-black')
  const [checks, setChecks] = useState({ screen: false, faceid: false, backglass: false, cameras: false })
  const [selectedNew, setSelectedNew] = useState({ id: '', name: '', desc: '', price: 0 })
  const [damages, setDamages] = useState<{ id: number; label: string; amount: number }[]>([])
  // 📦 Catálogo de dispositivos para canje – vacío (cargar desde API)
  const availableDevices: { id: string; name: string; storage: string; image: string; basePrice: number }[] = []
  // 📦 Catálogo de dispositivos nuevos – vacío (cargar desde API)
  const newDevices: { id: string; name: string; desc: string; price: number }[] = []
  const addDamage = (label = 'Scratch', amount = 15) => setDamages(d => [...d, { id: d.length + 1, label, amount }])
  const removeDamage = (id: number) => setDamages(d => d.filter(x => x.id !== id))
  // Tabla de precios base – vacía
  const tradeInBase: Record<string, number> = {}
  const tradeInCredit = useMemo(() => {
    const base = tradeInBase[device.model] ?? 0
    const batteryFactor = device.battery / 100
    const damageTotal = damages.reduce((s, x) => s + x.amount, 0)
    return Math.max(0, Math.round((base * batteryFactor - damageTotal) * 100) / 100)
  }, [device, damages, tradeInBase])
  const finalize = () => {
    const id = `TC-${Math.floor(Math.random() * 900000) + 100000}`
    alert(`Transacción completada: ${id}`)
    navigate('/iphone-canje')
  }
  // 🎨 Colores – pueden venir de la API
  const colorOptions = [
    { name: 'Negro Espacial', value: 'space-black', hex: '#3b3c36' },
    { name: 'Blanco', value: 'white', hex: '#f5f5f0' },
    { name: 'Dorado', value: 'gold', hex: '#d4a574' },
    { name: 'Plata', value: 'silver', hex: '#a8a9ad' },
    { name: 'Púrpura Profundo', value: 'purple', hex: '#2c445a' }
  ]
  const StepperComponent = ({ current }: { current: number }) => (
    <div className="mb-12">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0"></div>
        {[1, 2, 3].map((num) => {
          let state = 'pending'
          if (num < current) state = 'completed'
          if (num === current) state = 'active'
          return (
            <div key={num} className="stepper-item relative z-10 flex flex-col items-center gap-2 bg-background px-4">
              <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-colors ${
                state === 'active' ? 'bg-primary text-white border-primary' :
                state === 'completed' ? 'bg-green-500 text-white border-green-500' :
                'bg-muted text-muted-foreground border-muted'
              }`}>
                {state === 'completed' ? <MdCheck size={12} /> : num}
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${
                state === 'active' ? 'text-primary' :
                state === 'completed' ? 'text-green-500' :
                'text-muted-foreground'
              }`}>
                {num === 1 ? 'Identificación' : num === 2 ? 'Evaluación' : 'Resumen'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
  return (
    <div className="space-y-6">
      <StepperComponent current={step} />
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {step === 1 && 'Identificación del Dispositivo'}
          {step === 2 && 'Evaluación del Dispositivo'}
          {step === 3 && 'Resumen Final'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {step === 1 && 'Paso 1: Identifique el iPhone actual del cliente y su estado básico.'}
          {step === 2 && 'Paso 2: Evalúe la condición física y la salud de la batería.'}
          {step === 3 && 'Paso 3: Revise y confirme la transacción de canje.'}
        </p>
      </div>
      {step === 1 && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingBag className="text-primary p-2 bg-primary/10 rounded-lg w-8 h-8" />
                <h2 className="text-xl font-bold text-foreground">Seleccione su Dispositivo de Canje</h2>
              </div>
              {/* Buscador (opcional, mejora UX) */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar modelo, almacenamiento..."
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
              {availableDevices.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Smartphone className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="font-medium">No hay dispositivos disponibles</p>
                  <p className="text-sm">Agrega dispositivos desde el panel de administración</p>
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                  {availableDevices.map(dev => (
                    <div
                      key={dev.id}
                      onClick={() => {
                        setSelectedDeviceId(dev.id)
                        setDevice({ model: dev.name, storage: dev.storage, battery: 88 })
                      }}
                      className={`flex-shrink-0 w-48 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedDeviceId === dev.id
                          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                          : 'border-border hover:border-primary/40 hover:shadow-md'
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-foreground truncate">{dev.name}</span>
                          {selectedDeviceId === dev.id && (
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">✓</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{dev.storage}</p>
                        <p className="text-lg font-bold text-primary mt-2">${dev.basePrice}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          {selectedDeviceId && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <QrCode className="text-primary p-2 bg-primary/10 rounded-lg w-8 h-8" />
                      <h2 className="text-xl font-bold text-foreground">Especificaciones del Dispositivo</h2>
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-semibold text-foreground">Capacidad</label>
                          <select value={device.storage} onChange={e => setDevice(d => ({ ...d, storage: e.target.value }))} className="rounded-lg border border-input bg-background text-foreground py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring/20 h-12">
                            <option>128 GB</option>
                            <option>256 GB</option>
                            <option>512 GB</option>
                            <option>1 TB</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-semibold text-foreground">Color</label>
                          <select value={deviceColor} onChange={e => setDeviceColor(e.target.value)} className="rounded-lg border border-input bg-background text-foreground py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring/20 h-12">
                            {colorOptions.map(c => (
                              <option key={c.value} value={c.value}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-foreground flex justify-between">
                          <span>Número IMEI</span>
                          <span className="text-xs font-normal text-muted-foreground italic">Marque *#06# para encontrar IMEI</span>
                        </label>
                        <div className="relative">
                          <input value={imei} onChange={e => setImei(e.target.value)} className="w-full rounded-lg border border-input bg-background text-foreground py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring/20 h-12 pl-4" placeholder="Ingrese IMEI de 15 dígitos..." type="text" />
                          <Button variant="outline" size="sm" onClick={() => alert('Verificando IMEI...')} className="absolute right-2 top-2">VERIFICAR</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Settings className="text-primary p-2 bg-primary/10 rounded-lg w-8 h-8" />
                      <h2 className="text-xl font-bold text-foreground">Estado Inicial</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <Power className="text-green-500 w-5 h-5" />
                          <div>
                            <p className="font-bold text-sm text-foreground">¿El dispositivo enciende?</p>
                            <p className="text-xs text-muted-foreground">El dispositivo debe llegar a la pantalla de inicio</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input checked={powerOn} onChange={e => setPowerOn(e.target.checked)} className="sr-only peer" type="checkbox" />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <Cloud className="text-amber-500 w-5 h-5" />
                          <div>
                            <p className="font-bold text-sm text-foreground">¿iCloud cerrado?</p>
                            <p className="text-xs text-muted-foreground">Buscar mi iPhone debe estar desactivado</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input checked={icloudLogout} onChange={e => setIcloudLogout(e.target.checked)} className="sr-only peer" type="checkbox" />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Estimated Price */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-0">
                  <CardContent className="p-8 flex flex-col">
                    <h3 className="text-lg font-bold mb-6">Canje Estimado</h3>
                    <div className="space-y-4 flex-1">
                      <div>
                        <p className="text-sm opacity-80 mb-1">Modelo de Dispositivo</p>
                        <p className="text-sm font-bold">{device.model || '—'}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-80 mb-1">Almacenamiento</p>
                        <p className="text-sm font-bold">{device.storage || '—'}</p>
                      </div>
                      <div className="border-t border-white/20 pt-4 mt-6">
                        <p className="text-xs opacity-70 uppercase font-bold mb-2">Valor Estimado</p>
                        <p className="text-5xl font-black tracking-tight">${availableDevices.find(d => d.id === selectedDeviceId)?.basePrice || 0}</p>
                        <p className="text-xs opacity-70 mt-2">*Sujeto a evaluación y condición</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex flex-col gap-3">
                  <Button variant="outline" onClick={() => navigate('/iphone-canje')} className="w-full">
                    <X size={16} className="mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={() => setStep(2)} className="w-full" size="lg">
                    Siguiente Paso
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            {/* Battery Health */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Zap className="text-primary text-3xl p-2 bg-primary/10 rounded-lg w-10 h-10" />
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Salud de la Batería</h2>
                      <p className="text-xs text-muted-foreground">Capacidad Máxima Reportada en Configuración</p>
                    </div>
                  </div>
                  <div className="text-4xl font-black text-primary">{device.battery}<span className="text-xl">%</span></div>
                </div>
                <div className="relative py-6">
                  <input 
                    className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer accent-primary" 
                    max="100" 
                    min="50" 
                    type="range" 
                    value={device.battery}
                    onChange={e => setDevice(d => ({ ...d, battery: Number(e.target.value) }))}
                  />
                  <div className="flex justify-between mt-4 px-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span>Degradado (50%)</span>
                    <span>Óptimo (80%+)</span>
                    <span>Nuevo (100%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Functional Inspection */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <CheckCircle className="text-primary text-3xl p-2 bg-primary/10 rounded-lg w-10 h-10" />
                  <h2 className="text-xl font-bold text-foreground">Inspección Funcional</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="relative group cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={checks.faceid} 
                      onChange={e => setChecks(c => ({ ...c, faceid: e.target.checked }))}
                      className="peer hidden" 
                    />
                    <div className="flex items-center justify-between p-5 border-2 border-border rounded-xl peer-checked:border-primary peer-checked:bg-primary/5 transition-all cursor-pointer">
                      <div className="flex items-center gap-3 flex-1">
                        <Smartphone className="text-muted-foreground peer-checked:text-primary w-5 h-5" />
                        <span className="font-bold text-sm text-foreground">FaceID / TouchID</span>
                      </div>
                      <CheckCircle className="text-muted peer-checked:text-primary w-5 h-5" />
                    </div>
                  </label>
                  
                  <label className="relative group cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={checks.cameras} 
                      onChange={e => setChecks(c => ({ ...c, cameras: e.target.checked }))}
                      className="peer hidden" 
                    />
                    <div className="flex items-center justify-between p-5 border-2 border-border rounded-xl peer-checked:border-primary peer-checked:bg-primary/5 transition-all cursor-pointer">
                      <div className="flex items-center gap-3 flex-1">
                        <Smartphone className="text-muted-foreground peer-checked:text-primary w-5 h-5" />
                        <span className="font-bold text-sm text-foreground">Todas las Cámaras</span>
                      </div>
                      <CheckCircle className="text-muted peer-checked:text-primary w-5 h-5" />
                    </div>
                  </label>
                  <label className="relative group cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={checks.screen} 
                      onChange={e => setChecks(c => ({ ...c, screen: e.target.checked }))}
                      className="peer hidden" 
                    />
                    <div className="flex items-center justify-between p-5 border-2 border-border rounded-xl peer-checked:border-primary peer-checked:bg-primary/5 transition-all cursor-pointer">
                      <div className="flex items-center gap-3 flex-1">
                        <Smartphone className="text-muted-foreground peer-checked:text-primary w-5 h-5" />
                        <span className="font-bold text-sm text-foreground">Respuesta Táctil</span>
                      </div>
                      <CheckCircle className="text-muted peer-checked:text-primary w-5 h-5" />
                    </div>
                  </label>
                  <label className="relative group cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={checks.backglass} 
                      onChange={e => setChecks(c => ({ ...c, backglass: e.target.checked }))}
                      className="peer hidden" 
                    />
                    <div className="flex items-center justify-between p-5 border-2 border-border rounded-xl peer-checked:border-primary peer-checked:bg-primary/5 transition-all cursor-pointer">
                      <div className="flex items-center gap-3 flex-1">
                        <Volume2 className="text-muted-foreground peer-checked:text-primary w-5 h-5" />
                        <span className="font-bold text-sm text-foreground">Altavoces / Mic</span>
                      </div>
                      <CheckCircle className="text-muted peer-checked:text-primary w-5 h-5" />
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>
            {/* Estimated Credit */}
            <Card className="bg-primary text-white border-0 shadow-xl shadow-primary/20">
              <CardContent className="p-8 flex items-center justify-between relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-20">
                  <Receipt className="w-40 h-40" />
                </div>
                <div className="relative z-10">
                  <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Crédito Estimado</p>
                  <h3 className="text-5xl font-black">${tradeInCredit.toFixed(2)}</h3>
                </div>
                <div className="relative z-10 text-right">
                  <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> Actualización en Vivo
                  </div>
                  <p className="text-xs opacity-70 max-w-[180px]">Basado en la evaluación actual. Valor final confirmado después de la inspección.</p>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Damage Mapping */}
          <div className="lg:col-span-5">
            <Card className="h-full">
              <CardContent className="p-8 h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <QrCode className="text-primary text-3xl p-2 bg-primary/10 rounded-lg w-10 h-10" />
                    <h2 className="text-xl font-bold text-foreground">Mapeo de Daños</h2>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setDamages([])}>Limpiar Marcas</Button>
                </div>
                <p className="text-sm text-muted-foreground mb-8">Toque en el silueta del dispositivo para marcar defectos físicos (rayaduras, grietas o abolladuras).</p>
                
                <div className="flex flex-col items-center gap-8">
                  {/* Phone Visual */}
                  <div className="relative w-48 h-96 bg-muted rounded-[2.5rem] border-8 border-border shadow-inner">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-border rounded-b-xl"></div>
                    {damages.map((dmg, idx) => (
                      <div 
                        key={dmg.id}
                        onClick={() => removeDamage(dmg.id)}
                        className="absolute w-6 h-6 bg-red-500/80 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform text-[10px] text-white font-bold"
                        style={{
                          top: `${20 + (idx * 25)}%`,
                          left: `${25 + (idx * 15)}%`,
                        }}
                      >
                        {idx + 1}
                      </div>
                    ))}
                    <div className="absolute inset-2 bg-muted/50 rounded-[1.8rem] flex items-center justify-center">
                      <span className="text-muted-foreground font-bold text-xs uppercase opacity-40">Vista Frontal</span>
                    </div>
                  </div>
                  {/* Damage List */}
                  <div className="w-full space-y-3">
                    {damages.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">Sin daños reportados</p>
                    ) : (
                      damages.map((dmg, idx) => (
                        <div key={dmg.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center size-5 bg-red-500 text-white text-[10px] font-bold rounded-full">{idx + 1}</span>
                            <span className="text-sm font-medium text-foreground">{dmg.label}</span>
                          </div>
                          <span className="text-xs font-bold text-red-600">-${dmg.amount.toFixed(2)}</span>
                        </div>
                      ))
                    )}
                  </div>
                  {/* Quick Add Damages */}
                  <div className="w-full grid grid-cols-3 gap-2 pt-4 border-t border-border">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addDamage('Grieta fina', 45)} 
                    >
                      + Grieta
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addDamage('Rayadura profunda', 15)} 
                    >
                      + Rayadura
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addDamage('Abolladura', 30)} 
                    >
                      + Abolladura
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-6">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Resumen Final de la Transacción</h1>
              <p className="text-muted-foreground mt-1">Por favor revise los detalles del canje y firme para completar la transferencia.</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-muted-foreground block mb-1">NÚMERO DE REFERENCIA</span>
              <span className="font-mono text-lg font-bold text-foreground">#{Math.floor(Math.random() * 90000) + 10000}-XC</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <Card>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 divide-x divide-border">
                    <div className="p-8">
                      <div className="flex items-center gap-2 text-muted-foreground mb-6 uppercase tracking-wider text-[10px] font-bold">
                        <X className="w-4 h-4" />
                        Su Dispositivo (Canje)
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="size-20 rounded-xl bg-muted flex items-center justify-center border border-border">
                          <Smartphone className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1 text-foreground">{device.model || '—'}</h3>
                          <p className="text-sm text-muted-foreground">{colorOptions.find(c => c.value === deviceColor)?.name || '—'}, {device.storage || '—'}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {checks.screen && <Badge variant="success" className="text-[10px]">PANTALLA OK</Badge>}
                            {checks.faceid && <Badge variant="success" className="text-[10px]">FACEID OK</Badge>}
                            <Badge variant="outline" className="text-[10px]">{device.battery}% BATERÍA</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="mt-8 pt-6 border-t border-border">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-muted-foreground">Valor Estimado</span>
                          <span className="text-2xl font-black text-foreground">${tradeInCredit.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-8 bg-primary/5">
                      <div className="flex items-center gap-2 text-primary/60 mb-6 uppercase tracking-wider text-[10px] font-bold">
                        <CheckCircle className="w-4 h-4" />
                        Nuevo Dispositivo (Compra)
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="size-20 rounded-xl bg-card flex items-center justify-center border border-primary/20 shadow-sm">
                          <Phone className="w-10 h-10 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1 text-foreground">{selectedNew.name || '—'}</h3>
                          <p className="text-sm text-muted-foreground">{selectedNew.desc || '—'}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <Badge variant="default" className="text-[10px]">NUEVO</Badge>
                            <Badge variant="outline" className="text-[10px]">EN STOCK</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="mt-8 pt-6 border-t border-primary/10">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-primary/60">Precio de Venta</span>
                          <span className="text-2xl font-black text-foreground">${selectedNew.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Autorización Legal de Transferencia</h3>
                      <p className="text-sm text-muted-foreground mt-1">Certifico que el dispositivo que se está canjeando es de mi propiedad y autorizo la transferencia.</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => {}}>Limpiar Firma</Button>
                  </div>
                  <div className="signature-pad w-full h-48 border-2 border-dashed border-border rounded-xl relative overflow-hidden flex items-center justify-center cursor-crosshair group bg-muted/30">
                    <span className="text-muted-foreground font-medium group-hover:opacity-0 transition-opacity">Firma del Cliente Requerida</span>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      <QrCode className="w-4 h-4" />
                      Use mouse o stylus para firmar
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-4">
                <Card className="bg-slate-900 text-white border-0 shadow-2xl relative overflow-hidden">
                  <CardContent className="p-8">
                    <div className="absolute -right-8 -top-8 opacity-5">
                      <Receipt className="w-48 h-48" />
                    </div>
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-2 relative z-10">
                      <BarChart2 className="w-5 h-5 text-primary" />
                      Resumen Financiero
                    </h3>
                    <div className="space-y-5 mb-8 relative z-10">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Subtotal Nuevo Dispositivo</span>
                        <span className="font-mono font-medium">${selectedNew.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Crédito de Canje</span>
                        <span className="font-mono font-medium text-green-400">-${tradeInCredit.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Impuesto de Ventas (Aplicado)</span>
                        <span className="font-mono font-medium">$0.00</span>
                      </div>
                      <div className="border-t border-slate-800 pt-6 mt-6">
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Saldo Total a Pagar</span>
                          <span className="text-5xl font-black text-white tracking-tighter leading-none">${Math.max(0, (selectedNew.price - tradeInCredit)).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={finalize} className="w-full" size="lg">
                      <CheckCircle size={20} className="mr-2" />
                      Completar e Imprimir
                    </Button>
                    <div className="mt-6 space-y-3 relative z-10">
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <CheckCircle className="w-4 h-4" />
                        Activa Contrato e Impresión de Factura
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <BarChart2 className="w-4 h-4" />
                        Actualiza Inventario Automáticamente
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col gap-2">
                    <Button variant="outline" onClick={() => setStep(2)} className="w-full justify-between">
                      Editar Detalles
                      <QrCode size={16} />
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/iphone-canje')} className="w-full justify-between text-destructive hover:text-destructive">
                      Cancelar Transacción
                      <X size={16} />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
      {step > 1 && step < 3 && (
        <div className="mt-8 flex gap-4">
          <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
            <ArrowLeft size={16} className="mr-2" />
            Anterior
          </Button>
          <Button onClick={() => setStep(step + 1)} className="flex-[2]">
            Siguiente Paso
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
