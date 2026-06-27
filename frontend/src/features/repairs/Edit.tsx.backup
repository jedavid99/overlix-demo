import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Trash2,
  Camera,
  Smartphone,
  Laptop,
  Gamepad2,
  Clock,
  User,
  Phone,
  DollarSign,
  Shield,
  Wrench,
  CheckCircle,
  Search,
  ChevronDown,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Badge } from '@/shared/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { repairService } from '@/services/repairService';

interface RepairPart {
  id: string;
  nombre: string;
  cantidad: number;
  costo_unitario: number;
}

interface RepairData {
  id: string;
  numero_reparacion?: string;
  cliente_nombre?: string;
  cliente_telefono?: string;
  dispositivo: string;
  marca?: string;
  modelo?: string;
  problema_reportado: string;
  diagnosis?: string;
  reparacion_realizada?: string;
  estado: string;
  prioridad: string;
  fecha_ingreso: string;
  fecha_estimada_entrega?: string;
  total_reparacion?: number;
  notas?: string;
  foto_evidencia?: string;
  repuestos?: RepairPart[];
}

// Icono según categoría
const getDeviceIcon = (categoria: string) => {
  switch (categoria) {
    case 'telefono': return <Smartphone className="h-5 w-5" />;
    case 'laptop':
    case 'pc': return <Laptop className="h-5 w-5" />;
    case 'consola': return <Gamepad2 className="h-5 w-5" />;
    default: return <Smartphone className="h-5 w-5" />;
  }
};

// Color del estado (actualizado)
const getStatusColor = (estado: string) => {
  switch (estado) {
    case 'diagnostic': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'in_progress': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    case 'waiting_parts': return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'repaired': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'warranty': return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'irreparable': return 'bg-red-100 text-red-800 border-red-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
};

export default function RepairEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [repairData, setRepairData] = useState<RepairData | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    problema_reportado: '',
    diagnosis: '',
    reparacion_realizada: '',
    estado: 'diagnostic',
    costo_piezas: 0,
    costo_mano_obra: 0,
    total_reparacion: 0,
    notas: '',
    foto_evidencia: '',
    tecnico_asignado_id: '',
    fecha_estimada_entrega: '',
    categoria_dispositivo: '',
    dispositivo: '',
    marca: '',
    modelo: '',
    numero_serie: '',
    condicion_estetica: '',
    accesorios_incluidos: '',
    tiempo_estimado_minutos: 0,
    pagado: false,
    metodo_pago: '',
    monto_pagado: 0,
    tipo_seguridad: 'none',
    pin_acceso: '',
    patron_puntos: '',
    secuencia_patron: '',
    chequeo_hardware: '',
  });

  const [repuestos, setRepuestos] = useState<RepairPart[]>([]);
  const [nuevoRepuesto, setNuevoRepuesto] = useState({
    nombre: '',
    cantidad: 1,
    costo_unitario: 0,
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Dropdown de estado
  const estadoOptions = [
    { value: 'diagnostic', label: 'Diagnóstico', icon: Search },
    { value: 'in_progress', label: 'En Progreso', icon: Wrench },
    { value: 'waiting_parts', label: 'Esperando Repuestos', icon: Clock },
    { value: 'repaired', label: 'Reparado', icon: CheckCircle },
    { value: 'warranty', label: 'Garantía', icon: Shield },
    { value: 'irreparable', label: 'Irreparable', icon: XCircle },
  ];
  const [isEstadoOpen, setIsEstadoOpen] = useState(false);
  const estadoRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (estadoRef.current && !estadoRef.current.contains(event.target as Node)) {
        setIsEstadoOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🔥 Efecto para recalcular total cuando cambian repuestos o mano de obra
  useEffect(() => {
    const totalRepuestos = repuestos.reduce((sum, r) => sum + r.cantidad * r.costo_unitario, 0);
    setFormData((prev) => ({
      ...prev,
      costo_piezas: totalRepuestos,
      total_reparacion: totalRepuestos + prev.costo_mano_obra,
    }));
  }, [repuestos]);

  // 🔥 Efecto para recalcular total cuando cambia mano de obra
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      total_reparacion: prev.costo_piezas + prev.costo_mano_obra,
    }));
  }, [formData.costo_mano_obra]);

  // Cargar datos
  useEffect(() => {
    if (id) loadRepairData(id);
  }, [id]);

  const loadRepairData = async (repairId: string) => {
    try {
      setLoading(true);
      const response = await repairService.getById(repairId) as any;
      const orderData = response?.data?.data || response?.data || response;
      setRepairData(orderData);

      setFormData({
        problema_reportado: orderData.problema_reportado || '',
        diagnosis: orderData.diagnosis || '',
        reparacion_realizada: orderData.reparacion_realizada || '',
        estado: orderData.estado || 'diagnostic',
        costo_piezas: orderData.costo_piezas || 0,
        costo_mano_obra: orderData.costo_mano_obra || 0,
        total_reparacion: orderData.total_reparacion || 0,
        notas: orderData.notas || '',
        foto_evidencia: orderData.foto_evidencia || '',
        tecnico_asignado_id: orderData.tecnico_asignado_id || '',
        fecha_estimada_entrega: orderData.fecha_estimada_entrega || '',
        categoria_dispositivo: orderData.categoria_dispositivo || '',
        dispositivo: orderData.dispositivo || '',
        marca: orderData.marca || '',
        modelo: orderData.modelo || '',
        numero_serie: orderData.numero_serie || '',
        condicion_estetica: orderData.condicion_estetica || '',
        accesorios_incluidos: Array.isArray(orderData.accesorios_incluidos)
          ? orderData.accesorios_incluidos.join(', ')
          : orderData.accesorios_incluidos || '',
        tiempo_estimado_minutos: orderData.tiempo_estimado_minutos || 0,
        pagado: orderData.pagado || false,
        metodo_pago: orderData.metodo_pago || '',
        monto_pagado: orderData.monto_pagado || 0,
        tipo_seguridad: orderData.tipo_seguridad || 'none',
        pin_acceso: orderData.pin_acceso || '',
        patron_puntos: Array.isArray(orderData.patron_puntos)
          ? orderData.patron_puntos.join(', ')
          : orderData.patron_puntos || '',
        secuencia_patron: Array.isArray(orderData.secuencia_patron)
          ? orderData.secuencia_patron.join(', ')
          : orderData.secuencia_patron || '',
        chequeo_hardware: typeof orderData.chequeo_hardware === 'object'
          ? JSON.stringify(orderData.chequeo_hardware, null, 2)
          : orderData.chequeo_hardware || '',
      });

      setRepuestos(orderData.repuestos || []);
    } catch (error: any) {
      console.error('Error al cargar reparación:', error);
      toast({ title: 'Error', description: 'No se pudo cargar la reparación', variant: 'destructive' });
      navigate('/reparaciones/list');
    } finally {
      setLoading(false);
    }
  };

  // Guardar
  const handleSave = async () => {
    if (!repairData) return;

    try {
      setSaving(true);

      const validTransitions: Record<string, string[]> = {
        diagnostic: ['in_progress', 'irreparable'],
        in_progress: ['waiting_parts', 'repaired', 'irreparable'],
        waiting_parts: ['in_progress', 'repaired', 'irreparable'],
        repaired: ['warranty'],
        warranty: [],
        irreparable: [],
      };

      const payload: any = {};

      if (formData.estado !== repairData.estado) {
        const allowed = validTransitions[repairData.estado] || [];
        if (!allowed.includes(formData.estado)) {
          toast({
            title: 'Error',
            description: `No puedes cambiar de "${repairData.estado}" a "${formData.estado}". Transición no válida.`,
            variant: 'destructive',
          });
          setSaving(false);
          return;
        }
        payload.estado = formData.estado;
      }

      // Campos de diagnóstico
      if (formData.problema_reportado) payload.problema_reportado = formData.problema_reportado;
      if (formData.diagnosis) payload.diagnosis = formData.diagnosis;
      if (formData.reparacion_realizada) payload.reparacion_realizada = formData.reparacion_realizada;
      if (formData.notas) payload.notas = formData.notas;
      if (formData.costo_piezas > 0) payload.costo_piezas = formData.costo_piezas;
      if (formData.costo_mano_obra > 0) payload.costo_mano_obra = formData.costo_mano_obra;
      if (formData.total_reparacion > 0) payload.total_reparacion = formData.total_reparacion;
      if (formData.foto_evidencia) payload.foto_evidencia = formData.foto_evidencia;
      if (formData.tecnico_asignado_id) payload.tecnico_asignado_id = formData.tecnico_asignado_id;
      if (formData.fecha_estimada_entrega) payload.fecha_estimada_entrega = formData.fecha_estimada_entrega;

      // Dispositivo
      if (formData.categoria_dispositivo) payload.categoria_dispositivo = formData.categoria_dispositivo;
      if (formData.dispositivo) payload.dispositivo = formData.dispositivo;
      if (formData.marca) payload.marca = formData.marca;
      if (formData.modelo) payload.modelo = formData.modelo;
      if (formData.numero_serie) payload.numero_serie = formData.numero_serie;
      if (formData.condicion_estetica) payload.condicion_estetica = formData.condicion_estetica;
      if (formData.accesorios_incluidos) {
        payload.accesorios_incluidos = formData.accesorios_incluidos
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
      }
      if (formData.tiempo_estimado_minutos > 0) {
        payload.tiempo_estimado_minutos = formData.tiempo_estimado_minutos;
      }

      // Pago
      payload.pagado = formData.pagado;
      if (formData.metodo_pago) payload.metodo_pago = formData.metodo_pago;
      if (formData.monto_pagado !== undefined) payload.monto_pagado = formData.monto_pagado;

      // Seguridad
      if (formData.tipo_seguridad && formData.tipo_seguridad !== 'none') {
        payload.tipo_seguridad = formData.tipo_seguridad;
      }
      if (formData.pin_acceso) payload.pin_acceso = formData.pin_acceso;
      if (formData.patron_puntos) {
        payload.patron_puntos = formData.patron_puntos
          .split(',')
          .map(s => parseInt(s.trim()))
          .filter(n => !isNaN(n));
      }
      if (formData.secuencia_patron) {
        payload.secuencia_patron = formData.secuencia_patron
          .split(',')
          .map(s => parseInt(s.trim()))
          .filter(n => !isNaN(n));
      }

      // Hardware
      if (formData.chequeo_hardware) {
        try {
          payload.chequeo_hardware = JSON.parse(formData.chequeo_hardware);
        } catch {
          // ignore
        }
      }

      if (repuestos.length > 0) payload.repuestos = repuestos;

      if (Object.keys(payload).length === 0) {
        toast({ title: 'Aviso', description: 'No hay cambios para guardar', variant: 'default' });
        setSaving(false);
        return;
      }

      await repairService.update(repairData.id, payload);
      toast({ title: 'Éxito', description: 'Reparación actualizada correctamente' });
      navigate('/reparaciones/list', { state: { reload: true } });
    } catch (error: any) {
      console.error('Error al actualizar reparación:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo actualizar la reparación',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Repuestos
  const handleAddRepuesto = () => {
    if (!nuevoRepuesto.nombre || nuevoRepuesto.cantidad <= 0) {
      toast({ title: 'Error', description: 'Complete los datos del repuesto', variant: 'destructive' });
      return;
    }
    const repuesto: RepairPart = {
      id: Date.now().toString(),
      nombre: nuevoRepuesto.nombre,
      cantidad: nuevoRepuesto.cantidad,
      costo_unitario: nuevoRepuesto.costo_unitario,
    };
    setRepuestos([...repuestos, repuesto]);
    setNuevoRepuesto({ nombre: '', cantidad: 1, costo_unitario: 0 });
  };

  const handleRemoveRepuesto = (repuestoId: string) => {
    setRepuestos(repuestos.filter(r => r.id !== repuestoId));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingPhoto(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, foto_evidencia: reader.result as string });
        setUploadingPhoto(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast({ title: 'Error', description: 'No se pudo subir la foto', variant: 'destructive' });
      setUploadingPhoto(false);
    }
  };

  const calculateTotalRepuestos = () => {
    return repuestos.reduce((sum, r) => sum + r.cantidad * r.costo_unitario, 0);
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!repairData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No se encontró la reparación</p>
      </div>
    );
  }

  // Obtener icono del estado actual
  const getCurrentEstadoIcon = () => {
    const found = estadoOptions.find(o => o.value === formData.estado);
    return found?.icon || Search;
  };
  const CurrentIcon = getCurrentEstadoIcon();

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="w-full max-w-full px-2 md:px-4 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/reparaciones/list')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-[200px]">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Wrench className="h-6 w-6 text-primary" />
              Editar Reparación
            </h1>
            <p className="text-sm text-muted-foreground">
              Orden: <span className="font-mono font-medium">{repairData.numero_reparacion || repairData.id?.substring(0, 8)}</span>
              {' · '}
              <Badge className={getStatusColor(formData.estado)} variant="outline">
                {formData.estado === 'diagnostic' && 'Diagnóstico'}
                {formData.estado === 'in_progress' && 'En Progreso'}
                {formData.estado === 'waiting_parts' && 'Esperando Repuestos'}
                {formData.estado === 'repaired' && 'Reparado'}
                {formData.estado === 'warranty' && 'Garantía'}
                {formData.estado === 'irreparable' && 'Irreparable'}
              </Badge>
            </p>
          </div>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={() => navigate('/reparaciones/list')}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>

        {/* Layout dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna Izquierda */}
          <div className="space-y-6">
            {/* Cliente (solo lectura) */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {repairData.cliente_nombre?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{repairData.cliente_nombre || '—'}</p>
                    <p className="text-xs text-muted-foreground">Cliente</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{repairData.cliente_telefono || '—'}</p>
                    <p className="text-xs text-muted-foreground">Teléfono</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dispositivo (solo lectura) */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  {getDeviceIcon(formData.categoria_dispositivo)}
                  Dispositivo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-0.5">Categoría</label>
                    <p className="text-sm font-medium text-foreground">
                      {formData.categoria_dispositivo === 'telefono' && '📱 Teléfono'}
                      {formData.categoria_dispositivo === 'pc' && '💻 PC'}
                      {formData.categoria_dispositivo === 'laptop' && '💻 Laptop'}
                      {formData.categoria_dispositivo === 'consola' && '🎮 Consola'}
                      {formData.categoria_dispositivo === 'tablet' && '📱 Tablet'}
                      {!formData.categoria_dispositivo && '—'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-0.5">Dispositivo</label>
                    <p className="text-sm font-medium text-foreground">{formData.dispositivo || '—'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-0.5">Marca</label>
                    <p className="text-sm text-foreground">{formData.marca || '—'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-0.5">Modelo</label>
                    <p className="text-sm text-foreground">{formData.modelo || '—'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-0.5">N° de Serie</label>
                  <p className="text-sm font-mono text-foreground">{formData.numero_serie || '—'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-0.5">Condición Estética</label>
                  <p className="text-sm text-foreground">{formData.condicion_estetica || '—'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-0.5">Accesorios</label>
                  <p className="text-sm text-foreground">{formData.accesorios_incluidos || '—'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Repuestos */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Plus className="h-4 w-4 text-muted-foreground" />
                  Repuestos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2 items-end">
                  <div className="flex-1 min-w-[140px]">
                    <label className="block text-xs font-medium text-muted-foreground mb-0.5">Nombre</label>
                    <Input
                      className="h-9"
                      value={nuevoRepuesto.nombre}
                      onChange={e => setNuevoRepuesto({ ...nuevoRepuesto, nombre: e.target.value })}
                      placeholder="Repuesto"
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs font-medium text-muted-foreground mb-0.5">Cant</label>
                    <Input
                      type="number"
                      className="h-9"
                      value={nuevoRepuesto.cantidad}
                      onChange={e => setNuevoRepuesto({ ...nuevoRepuesto, cantidad: parseInt(e.target.value) || 0 })}
                      min={1}
                    />
                  </div>
                  <div className="w-28">
                    <label className="block text-xs font-medium text-muted-foreground mb-0.5">Costo unit.</label>
                    <Input
                      type="number"
                      className="h-9"
                      value={nuevoRepuesto.costo_unitario}
                      onChange={e => setNuevoRepuesto({ ...nuevoRepuesto, costo_unitario: parseFloat(e.target.value) || 0 })}
                      min={0}
                      step={0.01}
                    />
                  </div>
                  <Button onClick={handleAddRepuesto} className="h-9 gap-1">
                    <Plus className="h-4 w-4" /> Agregar
                  </Button>
                </div>

                {repuestos.length > 0 && (
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {repuestos.map(r => (
                      <div key={r.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div>
                          <span className="font-medium">{r.nombre}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {r.cantidad} x {formatCurrency(r.costo_unitario)} ={' '}
                            <span className="font-semibold">{formatCurrency(r.cantidad * r.costo_unitario)}</span>
                          </span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveRepuesto(r.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notas */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  className="min-h-[100px] resize-none"
                  value={formData.notas}
                  onChange={e => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Notas adicionales..."
                />
              </CardContent>
            </Card>

            {/* Foto de evidencia */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Foto de Evidencia</CardTitle>
              </CardHeader>
              <CardContent>
                {formData.foto_evidencia ? (
                  <div className="relative">
                    <img src={formData.foto_evidencia} alt="Evidencia" className="w-full h-40 object-cover rounded-md" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={() => setFormData({ ...formData, foto_evidencia: '' })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                    <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Sube una foto del equipo</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload">
                      <Button asChild disabled={uploadingPhoto} variant="outline" size="sm">
                        <span>
                          <Upload className="h-4 w-4 mr-1" />
                          {uploadingPhoto ? 'Subiendo...' : 'Subir'}
                        </span>
                      </Button>
                    </label>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Columna Derecha */}
          <div className="space-y-6">
            {/* Diagnóstico */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  Diagnóstico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-0.5">Problema Reportado *</label>
                  <Textarea
                    className="min-h-[80px] resize-none"
                    value={formData.problema_reportado}
                    onChange={e => setFormData({ ...formData, problema_reportado: e.target.value })}
                    placeholder="Descripción del problema"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-0.5">Diagnóstico</label>
                  <Textarea
                    className="min-h-[60px] resize-none"
                    value={formData.diagnosis}
                    onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
                    placeholder="Diagnóstico técnico"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-0.5">Reparación Realizada</label>
                  <Textarea
                    className="min-h-[60px] resize-none"
                    value={formData.reparacion_realizada}
                    onChange={e => setFormData({ ...formData, reparacion_realizada: e.target.value })}
                    placeholder="Reparación ejecutada"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Estado y Asignación */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Estado y Asignación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Estado - Custom Dropdown con Lucide icons */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-0.5">Estado</label>
                  <div className="relative" ref={estadoRef}>
                    <button
                      type="button"
                      onClick={() => setIsEstadoOpen(!isEstadoOpen)}
                      className="w-full h-9 flex items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="flex items-center gap-2">
                        <CurrentIcon className="h-4 w-4 text-muted-foreground" />
                        {estadoOptions.find(o => o.value === formData.estado)?.label || 'Seleccionar'}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isEstadoOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isEstadoOpen && (
                      <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-white shadow-lg overflow-hidden">
                        {estadoOptions.map(option => {
                          const Icon = option.icon;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, estado: option.value });
                                setIsEstadoOpen(false);
                              }}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-gray-100 ${
                                formData.estado === option.value ? 'bg-gray-50 font-medium' : ''
                              }`}
                            >
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              {option.label}
                              {formData.estado === option.value && (
                                <CheckCircle className="h-4 w-4 text-primary ml-auto" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Técnico */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-0.5">Técnico</label>
                  <Input
                    className="h-9"
                    value={formData.tecnico_asignado_id}
                    onChange={e => setFormData({ ...formData, tecnico_asignado_id: e.target.value })}
                    placeholder="Nombre o ID del técnico"
                  />
                </div>

                {/* Fecha Estimada y Tiempo (ocultar tiempo si hay mano de obra) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-0.5">Fecha Estimada</label>
                    <Input
                      type="date"
                      className="h-9"
                      value={formData.fecha_estimada_entrega}
                      onChange={e => setFormData({ ...formData, fecha_estimada_entrega: e.target.value })}
                    />
                  </div>
                  {/* 🔥 Ocultar Tiempo (min) si hay mano de obra */}
                  {formData.costo_mano_obra === 0 && (
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-0.5">Tiempo (min)</label>
                      <Input
                        type="number"
                        className="h-9"
                        value={formData.tiempo_estimado_minutos}
                        onChange={e => setFormData({ ...formData, tiempo_estimado_minutos: parseInt(e.target.value) || 0 })}
                        placeholder="Minutos"
                        min={0}
                        step={5}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Costos y Pago */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Costos y Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-0.5">Mano de Obra</label>
                    <Input
                      type="number"
                      className="h-9"
                      value={formData.costo_mano_obra}
                      onChange={e => setFormData({ ...formData, costo_mano_obra: parseFloat(e.target.value) || 0 })}
                      min={0}
                      step={0.01}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-0.5">Total</label>
                    <Input
                      type="number"
                      className="h-9"
                      value={formData.total_reparacion}
                      onChange={e => setFormData({ ...formData, total_reparacion: parseFloat(e.target.value) || 0 })}
                      min={0}
                      step={0.01}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
                  <span className="text-sm font-medium">Total Repuestos</span>
                  <span className="text-sm font-bold text-primary">{formatCurrency(calculateTotalRepuestos())}</span>
                </div>

                <div className="border-t pt-3 space-y-3">
                  {/* 🔥 Mejora visual del estado de pago */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">Estado de pago</span>
                      <Badge
                        variant={formData.pagado ? 'success' : 'destructive'}
                        className="text-xs"
                      >
                        {formData.pagado ? 'Pagado' : 'Pendiente'}
                      </Badge>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        pagado: !prev.pagado,
                        monto_pagado: !prev.pagado ? prev.total_reparacion : 0,
                      }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        formData.pagado ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.pagado ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Método de pago - Select nativo con fondo sólido */}
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-0.5">Método de Pago</label>
                    <select
                      value={formData.metodo_pago}
                      onChange={e => setFormData({ ...formData, metodo_pago: e.target.value })}
                      className="w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Seleccionar método</option>
                      <option value="efectivo">💵 Efectivo</option>
                      <option value="transferencia">🏦 Transferencia</option>
                      <option value="tarjeta">💳 Tarjeta de Crédito</option>
                      <option value="cuotas">📆 Cuotas</option>
                    </select>
                  </div>

                  {!formData.pagado && (
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-0.5">Monto Pagado</label>
                      <Input
                        type="number"
                        className="h-9"
                        min={0}
                        max={formData.total_reparacion || 0}
                        step={0.01}
                        value={formData.monto_pagado ?? 0}
                        onChange={e => {
                          const value = parseFloat(e.target.value) || 0;
                          setFormData({
                            ...formData,
                            monto_pagado: Math.min(value, formData.total_reparacion || 0),
                          });
                        }}
                      />
                      <div className="flex justify-between mt-1 text-sm">
                        <span className="text-muted-foreground">Saldo restante</span>
                        <span className="font-bold text-destructive">
                          {formatCurrency((formData.total_reparacion || 0) - (formData.monto_pagado || 0))}
                        </span>
                      </div>
                    </div>
                  )}

                  {formData.pagado && (
                    <div className="bg-green-50 p-2 rounded-md border border-green-200 flex justify-between">
                      <span className="text-sm font-medium text-green-700">Pagado</span>
                      <span className="text-sm font-bold text-green-700">
                        {formatCurrency(formData.total_reparacion || 0)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-2 border-t border-border">
          <Button variant="outline" onClick={() => navigate('/reparaciones/list')}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    </div>
  );
}