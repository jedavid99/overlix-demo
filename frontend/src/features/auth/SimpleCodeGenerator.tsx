import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  Copy,
  Plus,
  Trash2,
  LogOut,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  MessageCircle,
  Mail,
  Calendar,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import logo from '/ovelix-claro.png';
// Subscription plans
const SUBSCRIPTION_PLANS = {
  monthly: { name: 'Mensual', duration: 30, price: '$29.99' },
  quarterly: { name: 'Trimestral', duration: 90, price: '$79.99' },
  annual: { name: 'Anual', duration: 365, price: '$299.99' },
};
interface ActivationCode {
  id: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  plan: keyof typeof SUBSCRIPTION_PLANS;
  used: boolean;
  usedAt?: string;
  userEmail?: string;
  userName?: string;
  companyDetails?: {
    razonSocial: string;
    nombreFantasia: string;
    address: string;
    googleMapsLink?: string;
    phone: string;
    email: string;
    cuit: string;
    owner: string;
    paymentMethod: string;
    workshopType: string;
  };
  status: 'active' | 'expired' | 'expiring_soon';
}
export default function SimpleCodeGenerator() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [newCode, setNewCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<keyof typeof SUBSCRIPTION_PLANS>('monthly');
  const [companyData, setCompanyData] = useState({
    cuit: '',
    owner: '',
    workshopType: '',
    paymentMethod: '',
  });
  // Check admin session
  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession === 'true') {
      setIsLoggedIn(true);
      loadCodes();
    } else {
      navigate('/admin/login');
    }
    setIsChecking(false);
  }, [navigate]);
  // Update code statuses
  useEffect(() => {
    const updateStatuses = () => {
      const now = new Date();
      const updatedCodes = codes.map((code) => {
        const expiresAt = new Date(code.expiresAt);
        const daysUntilExpiry = Math.ceil(
          (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        let status: 'active' | 'expired' | 'expiring_soon' = 'active';
        if (daysUntilExpiry <= 0) {
          status = 'expired';
        } else if (daysUntilExpiry <= 7) {
          status = 'expiring_soon';
        }
        return { ...code, status };
      });
      setCodes(updatedCodes);
    };
    updateStatuses();
  }, [codes.length]);
  // Load codes from localStorage
  const loadCodes = () => {
    const storedCodes = localStorage.getItem('activation_codes');
    if (storedCodes) {
      setCodes(JSON.parse(storedCodes));
    }
  };
  // Generate activation code
  const generateCode = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const code = 'OVERLIX-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const plan = SUBSCRIPTION_PLANS[selectedPlan];
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + plan.duration * 24 * 60 * 60 * 1000);
      const newActivationCode: ActivationCode = {
        id: Date.now().toString(),
        code,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        plan: selectedPlan,
        used: false,
        status: 'active',
        companyDetails: {
          razonSocial: '',
          nombreFantasia: '',
          address: '',
          phone: '',
          email: '',
          cuit: companyData.cuit,
          owner: companyData.owner,
          paymentMethod: companyData.paymentMethod,
          workshopType: companyData.workshopType,
        },
      };
      const updatedCodes = [newActivationCode, ...codes];
      localStorage.setItem('activation_codes', JSON.stringify(updatedCodes));
      setCodes(updatedCodes);
      setNewCode(code);
      setIsGenerating(false);
    }, 500);
  };
  // Copy code to clipboard
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };
  // Delete code
  const deleteCode = (id: string) => {
    const updatedCodes = codes.filter((c) => c.id !== id);
    localStorage.setItem('activation_codes', JSON.stringify(updatedCodes));
    setCodes(updatedCodes);
    setShowDeleteConfirm(null);
  };
  // Send WhatsApp reminder
  const sendWhatsAppReminder = (code: ActivationCode) => {
    const message = `Hola ${code.userName || 'usuario'}, tu código de activación ${code.code} vence el ${new Date(
      code.expiresAt
    ).toLocaleDateString()}. Por favor renueva tu suscripción para continuar usando Overlix.`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  // Send Gmail reminder
  const sendGmailReminder = (code: ActivationCode) => {
    const subject = 'Recordatorio: Tu suscripción de Overlix está por vencer';
    const body = `Hola ${code.userName || 'usuario'},\n\nTu código de activación ${code.code} vence el ${new Date(
      code.expiresAt
    ).toLocaleDateString()}.\n\nPor favor renueva tu suscripción para continuar usando Overlix.\n\nSaludos,\nEquipo de Overlix`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  };
  // Logout
  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_email');
    navigate('/admin/login');
  };
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f9f9ff]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-[#0058be] mx-auto mb-4" />
          <p className="text-[#424754]">Verificando acceso...</p>
        </div>
      </div>
    );
  }
  if (!isLoggedIn) {
    return null;
  }
  return (
    <main className="min-h-screen bg-[#f9f9ff] text-[#191b23]">
      {/* Header */}
      <header className="bg-white border-b border-[#c2c6d6]/60 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Overlix" className="w-10 h-10 rounded-full" />
            <div>
              <h1 className="text-xl font-bold text-[#191b23]">Generador de Códigos</h1>
              <p className="text-xs text-[#727785]">Códigos de Activación</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Salir
          </Button>
        </div>
      </header>
      <div className="max-w-4xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-white border border-[#c2c6d6]/60">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Key className="w-6 h-6 text-[#0058be]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#191b23]">{codes.length}</p>
                <p className="text-sm text-[#727785]">Total</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white border border-[#c2c6d6]/60">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#191b23]">
                  {codes.filter((c) => c.status === 'active' && !c.used).length}
                </p>
                <p className="text-sm text-[#727785]">Activos</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white border border-[#c2c6d6]/60">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#191b23]">
                  {codes.filter((c) => c.status === 'expiring_soon').length}
                </p>
                <p className="text-sm text-[#727785]">Por vencer</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white border border-[#c2c6d6]/60">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#191b23]">
                  {codes.filter((c) => c.status === 'expired').length}
                </p>
                <p className="text-sm text-[#727785]">Vencidos</p>
              </div>
            </div>
          </Card>
        </div>
        {/* Generate Code Section */}
        <Card className="p-6 bg-white border border-[#c2c6d6]/60 mb-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#191b23] mb-1">Generar Nuevo Código</h2>
            <p className="text-sm text-[#727785]">
              Selecciona el plan de suscripción, ingresa los datos de la empresa y genera el código
            </p>
          </div>
          <div className="mb-6">
            <Label className="text-sm font-semibold text-[#191b23] mb-3 block">Plan de Suscripción</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(Object.keys(SUBSCRIPTION_PLANS) as Array<keyof typeof SUBSCRIPTION_PLANS>).map((plan) => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    selectedPlan === plan
                      ? 'border-[#0058be] bg-blue-50/50'
                      : 'border-[#c2c6d6] hover:border-[#0058be]/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[#191b23]">{SUBSCRIPTION_PLANS[plan].name}</span>
                    <span className="text-sm font-bold text-[#0058be]">{SUBSCRIPTION_PLANS[plan].price}</span>
                  </div>
                  <p className="text-xs text-[#727785]">{SUBSCRIPTION_PLANS[plan].duration} días de duración</p>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <Label className="text-sm font-semibold text-[#191b23] mb-3 block">Datos de la Empresa</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cuit" className="text-xs text-[#727785] mb-1 block">
                  CUIT *
                </Label>
                <Input
                  id="cuit"
                  placeholder="Ej: 20-12345678-9"
                  value={companyData.cuit}
                  onChange={(e) => setCompanyData({ ...companyData, cuit: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="owner" className="text-xs text-[#727785] mb-1 block">
                  Dueño / Responsable *
                </Label>
                <Input
                  id="owner"
                  placeholder="Ej: Juan Pérez"
                  value={companyData.owner}
                  onChange={(e) => setCompanyData({ ...companyData, owner: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="workshopType" className="text-xs text-[#727785] mb-1 block">
                  Tipo de Taller *
                </Label>
               <Select
  value={companyData.workshopType}
  onValueChange={(value) => setCompanyData({ ...companyData, workshopType: value })}
>
  <SelectTrigger className="w-full bg-white dark:bg-slate-800 border border-input shadow-sm">
    <SelectValue placeholder="Selecciona tipo" />
  </SelectTrigger>
  <SelectContent className="bg-white dark:bg-slate-800 border border-input shadow-lg">
    <SelectItem value="electronica">Electrónica</SelectItem>
    <SelectItem value="mecanica">Mecánica Automotriz</SelectItem>
    <SelectItem value="computacion">Computación/IT</SelectItem>
    <SelectItem value="celulares">Celulares</SelectItem>
    <SelectItem value="electrodomesticos">Electrodomésticos</SelectItem>
    <SelectItem value="bicicletas">Bicicletas</SelectItem>
    <SelectItem value="general">General/Mixto</SelectItem>
    <SelectItem value="otro">Otro</SelectItem>
  </SelectContent>
</Select>
              </div>
              <div>
                <Label htmlFor="paymentMethod" className="text-xs text-[#727785] mb-1 block">
                  Forma de Pago *
                </Label>
                <Select
  value={companyData.paymentMethod}
  onValueChange={(value) => setCompanyData({ ...companyData, paymentMethod: value })}
>
  <SelectTrigger className="w-full bg-white dark:bg-slate-800 border border-input shadow-sm">
    <SelectValue placeholder="Selecciona forma de pago" />
  </SelectTrigger>
  <SelectContent className="bg-white dark:bg-slate-800 border border-input shadow-lg">
    <SelectItem value="efectivo">Efectivo</SelectItem>
    <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
    <SelectItem value="tarjeta">Tarjeta de Crédito/Débito</SelectItem>
    <SelectItem value="mercadopago">MercadoPago</SelectItem>
    <SelectItem value="cheque">Cheque</SelectItem>
  </SelectContent>
</Select>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#727785]">
              <span className="font-medium text-[#191b23]">Plan seleccionado:</span>{' '}
              {SUBSCRIPTION_PLANS[selectedPlan].name} ({SUBSCRIPTION_PLANS[selectedPlan].duration} días)
            </div>
            <Button
              onClick={generateCode}
              disabled={isGenerating || !companyData.cuit || !companyData.owner || !companyData.workshopType || !companyData.paymentMethod}
              className="bg-[#0058be] hover:bg-[#2170e4] flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Generar Código
                </>
              )}
            </Button>
          </div>
          {newCode && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-[#191b23]">Código generado:</p>
                      <p className="text-lg font-bold text-[#0058be] font-mono">{newCode}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyCode(newCode)}
                    className="flex items-center gap-2"
                  >
                    {copiedCode === newCode ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </Card>
        {/* Codes List */}
        <Card className="bg-white border border-[#c2c6d6]/60">
          <div className="p-6 border-b border-[#c2c6d6]/60">
            <h2 className="text-lg font-semibold text-[#191b23]">Historial de Códigos</h2>
          </div>
          <div className="divide-y divide-[#c2c6d6]/60">
            {codes.length === 0 ? (
              <div className="p-12 text-center">
                <Key className="w-12 h-12 text-[#c2c6d6] mx-auto mb-4" />
                <p className="text-[#727785]">No hay códigos generados aún</p>
              </div>
            ) : (
              codes.map((code) => {
                const expiresAt = new Date(code.expiresAt);
                const daysUntilExpiry = Math.ceil(
                  (expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <motion.div
                    key={code.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 hover:bg-slate-50 transition-colors ${
                      code.status === 'expired'
                        ? 'bg-red-50/30'
                        : code.status === 'expiring_soon'
                        ? 'bg-orange-50/30'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`p-2 rounded-lg shrink-0 ${
                            code.status === 'expired'
                              ? 'bg-red-100'
                              : code.status === 'expiring_soon'
                              ? 'bg-orange-100'
                              : code.used
                              ? 'bg-gray-100'
                              : 'bg-green-100'
                          }`}
                        >
                          {code.status === 'expired' ? (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          ) : code.status === 'expiring_soon' ? (
                            <Clock className="w-5 h-5 text-orange-600" />
                          ) : code.used ? (
                            <CheckCircle2 className="w-5 h-5 text-gray-600" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-mono font-bold text-[#191b23]">{code.code}</p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                code.status === 'expired'
                                  ? 'bg-red-100 text-red-700'
                                  : code.status === 'expiring_soon'
                                  ? 'bg-orange-100 text-orange-700'
                                  : code.used
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {code.status === 'expired'
                                ? 'Vencido'
                                : code.status === 'expiring_soon'
                                ? `Vence en ${daysUntilExpiry} días`
                                : code.used
                                ? 'Usado'
                                : 'Activo'}
                            </span>
                          </div>
                          <div className="space-y-0.5 text-xs text-[#727785]">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Plan: {SUBSCRIPTION_PLANS[code.plan].name} ({SUBSCRIPTION_PLANS[code.plan].price})
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              <span>Vence: {expiresAt.toLocaleDateString()}</span>
                            </div>
                            {code.userName && (
                              <div className="flex items-center gap-2">
                                <span>
                                  Usuario: {code.userName} ({code.userEmail})
                                </span>
                              </div>
                            )}
                            {code.companyDetails && (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <p className="font-medium text-[#191b23] mb-1">Datos de la empresa:</p>
                                <div className="space-y-0.5">
                                  <p>
                                    <strong>Razón Social:</strong> {code.companyDetails.razonSocial}
                                  </p>
                                  <p>
                                    <strong>Nombre Fantasía:</strong> {code.companyDetails.nombreFantasia}
                                  </p>
                                  <p>
                                    <strong>Dirección:</strong> {code.companyDetails.address}
                                  </p>
                                  {code.companyDetails.googleMapsLink && (
                                    <p>
                                      <strong>Google Maps:</strong>{' '}
                                      <a
                                        href={code.companyDetails.googleMapsLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                      >
                                        Ver ubicación
                                      </a>
                                    </p>
                                  )}
                                  <p>
                                    <strong>CUIT:</strong> {code.companyDetails.cuit}
                                  </p>
                                  <p>
                                    <strong>Dueño:</strong> {code.companyDetails.owner}
                                  </p>
                                  <p>
                                    <strong>Tipo:</strong> {code.companyDetails.workshopType}
                                  </p>
                                  <p>
                                    <strong>Pago:</strong> {code.companyDetails.paymentMethod}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!code.used && code.status !== 'expired' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyCode(code.code)}
                            className="flex items-center gap-2"
                          >
                            {copiedCode === code.code ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                Copiado
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copiar
                              </>
                            )}
                          </Button>
                        )}
                        {code.status === 'expiring_soon' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => sendWhatsAppReminder(code)}
                              className="flex items-center gap-2 text-green-600 hover:text-green-700"
                            >
                              <MessageCircle className="w-4 h-4" />
                              WhatsApp
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => sendGmailReminder(code)}
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                            >
                              <Mail className="w-4 h-4" />
                              Gmail
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDeleteConfirm(code.id)}
                          className="flex items-center gap-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                    {showDeleteConfirm === code.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <p className="text-sm text-red-800 mb-3">
                          ¿Estás seguro de que deseas eliminar este código?
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(null)}>
                            Cancelar
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deleteCode(code.id)}>
                            Eliminar
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
