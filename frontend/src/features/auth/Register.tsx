import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  Building2,
  UserPlus,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  Lock,
  MapPin,
  FileText,
  Shield,
  Check,
  MessageCircle,
  AlertTriangle,
  Copy,
} from 'lucide-react';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Card } from '../../shared/components/ui/card';
import { Label } from '../../shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../shared/components/ui/select';
import logo from '/ovelix-claro.png';
// ============================================================================
// TIPOS
// ============================================================================
interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  nif?: string;
  codigoEmpresa: string;
}
interface UserData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  codigoEmpresa?: string;
  role?: string;
}
interface CompanyData {
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
  nif?: string;
  codigoEmpresa: string;
}
// ============================================================================
// DATOS HARCODEADOS (simulación)
// ============================================================================
const EXISTING_COMPANIES: Company[] = [
  {
    id: '1',
    name: 'TechFix S.A.',
    address: 'Calle Principal 123',
    phone: '+34 600 123 456',
    email: 'info@techfix.com',
    codigoEmpresa: 'TF-2024',
  },
  {
    id: '2',
    name: 'Reparaciones Express',
    address: 'Avenida Central 456',
    phone: '+34 600 789 012',
    email: 'contacto@reparaciones.com',
    codigoEmpresa: 'RE-2024',
  },
  {
    id: '3',
    name: 'Taller Pro',
    address: 'Calle Industria 789',
    phone: '+34 600 345 678',
    email: 'info@tallerpro.com',
    codigoEmpresa: 'TP-2024',
  },
];
// ============================================================================
// ANIMACIONES
// ============================================================================
const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    scale: 0.95,
  }),
};
// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [activationCode, setActivationCode] = useState('');
  const [activationError, setActivationError] = useState('');
  const [hasCompanyRegistered, setHasCompanyRegistered] = useState(false);
  const [existingCompanyData, setExistingCompanyData] = useState<CompanyData | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData>({
    razonSocial: '',
    nombreFantasia: '',
    address: '',
    googleMapsLink: '',
    phone: '',
    email: '',
    cuit: '',
    owner: '',
    paymentMethod: '',
    workshopType: '',
    nif: '',
    codigoEmpresa: '',
  });
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    codigoEmpresa: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  // Redirect if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);
  // ==========================================================================
  // FUNCIONES DE VALIDACIÓN
  // ==========================================================================
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) =>
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(phone);
  // Generador de código de empresa
  const generateCompanyCode = (name: string) => {
    const prefix = name.substring(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${random}`;
  };
  // Validación del código de activación
  const validateActivationCode = () => {
    if (!activationCode.trim()) {
      setActivationError('Por favor, ingresa el código de activación');
      return false;
    }
    const storedCodes = localStorage.getItem('activation_codes');
    if (!storedCodes) {
      setActivationError('Código de activación inválido');
      return false;
    }
    const codes = JSON.parse(storedCodes);
    const codeData = codes.find((c: any) => c.code === activationCode);
    if (!codeData) {
      setActivationError('Código de activación inválido');
      return false;
    }
    const expiresAt = new Date(codeData.expiresAt);
    if (expiresAt < new Date()) {
      setActivationError('Este código de activación ha vencido');
      return false;
    }
    if (codeData.used && codeData.companyDetails && codeData.companyDetails.razonSocial) {
      setHasCompanyRegistered(true);
      setExistingCompanyData(codeData.companyDetails);
    } else {
      setHasCompanyRegistered(false);
      setExistingCompanyData(null);
    }
    setActivationError('');
    return true;
  };
  // Validación del formulario de empresa
  const validateCompanyForm = () => {
    const newErrors: Record<string, string> = {};
    if (!companyData.razonSocial.trim()) newErrors.razonSocial = 'La razón social es obligatoria';
    if (!companyData.nombreFantasia.trim()) newErrors.nombreFantasia = 'El nombre del taller es obligatorio';
    if (!companyData.address.trim()) newErrors.address = 'La dirección es obligatoria';
    if (!companyData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
    else if (!validatePhone(companyData.phone)) newErrors.phone = 'Teléfono inválido';
    if (!companyData.email.trim()) newErrors.email = 'El email es obligatorio';
    else if (!validateEmail(companyData.email)) newErrors.email = 'Email inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Validación del formulario de usuario
  const validateUserForm = () => {
    const newErrors: Record<string, string> = {};
    if (!userData.fullName.trim()) newErrors.fullName = 'El nombre completo es obligatorio';
    if (!userData.email.trim()) newErrors.email = 'El email es obligatorio';
    else if (!validateEmail(userData.email)) newErrors.email = 'Email inválido';
    if (!userData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
    else if (!validatePhone(userData.phone)) newErrors.phone = 'Teléfono inválido';
    if (hasCompanyRegistered && !userData.codigoEmpresa.trim()) {
      newErrors.codigoEmpresa = 'El código de empresa es obligatorio';
    }
    if (!userData.password) newErrors.password = 'La contraseña es obligatoria';
    else if (userData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (!userData.confirmPassword) newErrors.confirmPassword = 'Confirma tu contraseña';
    else if (userData.password !== userData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    if (hasCompanyRegistered && !userData.role) {
      newErrors.role = 'El rol es obligatorio';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // ==========================================================================
  // MANEJADORES DE PASOS
  // ==========================================================================
  const handleNextStep = () => {
    setDirection(1);
    setStep((prev) => prev + 1);
  };
  const handlePreviousStep = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };
  const handleActivationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateActivationCode()) {
      if (hasCompanyRegistered) {
        setStep(2); // Ir directamente a usuario
      } else {
        handleNextStep(); // Ir a empresa
      }
    }
  };
  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCompanyForm()) {
      // Generar código de empresa
      const codigo = generateCompanyCode(companyData.nombreFantasia);
      setCompanyData((prev) => ({ ...prev, codigoEmpresa: codigo }));
      // Guardar en localStorage (simulación)
      const newCompany: Company = {
        id: Date.now().toString(),
        name: companyData.razonSocial,
        address: companyData.address,
        phone: companyData.phone,
        email: companyData.email,
        codigoEmpresa: codigo,
      };
      localStorage.setItem('newCompany', JSON.stringify(newCompany));
      localStorage.setItem('companyDetails', JSON.stringify({ ...companyData, codigoEmpresa: codigo }));
      setStep(3); // Ir a usuario
    }
  };
  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUserForm()) {
      setIsSubmitting(true);
      setTimeout(() => {
        // Guardar en localStorage (simulación)
        const storedCodes = localStorage.getItem('activation_codes');
        if (storedCodes) {
          const codes = JSON.parse(storedCodes);
          const updatedCodes = codes.map((c: any) => {
            if (c.code === activationCode) {
              return {
                ...c,
                used: true,
                usedAt: new Date().toISOString(),
                userEmail: userData.email,
                userName: userData.fullName,
                userRole: userData.role,
                companyDetails: hasCompanyRegistered
                  ? existingCompanyData
                  : { ...companyData, codigoEmpresa: companyData.codigoEmpresa },
              };
            }
            return c;
          });
          localStorage.setItem('activation_codes', JSON.stringify(updatedCodes));
        }
        const registrationData = {
          userData,
          companyData: hasCompanyRegistered ? existingCompanyData : companyData,
          registrationType: hasCompanyRegistered ? 'existing' : 'new',
          activationCode,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem('registrationData', JSON.stringify(registrationData));
        console.log('Registration completed:', registrationData);
        setIsSubmitting(false);
        handleNextStep();
      }, 1500);
    }
  };
  const handleGoToLogin = () => {
    navigate('/');
  };
  // Función para copiar el código de empresa
  const handleCopyCode = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  // ==========================================================================
  // STEPPER
  // ==========================================================================
  const Stepper = () => {
    const steps = hasCompanyRegistered
      ? [
          { number: 1, label: 'Solicitar' },
          { number: 2, label: 'Activación' },
          { number: 3, label: 'Usuario' },
          { number: 4, label: 'Confirmación' },
        ]
      : [
          { number: 1, label: 'Solicitar' },
          { number: 2, label: 'Activación' },
          { number: 3, label: 'Empresa' },
          { number: 4, label: 'Usuario' },
          { number: 5, label: 'Confirmación' },
        ];
    const getStepStatus = (stepNumber: number) => {
      if (stepNumber < step + 1) return 'completed';
      if (stepNumber === step + 1) return 'current';
      return 'pending';
    };
    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, index) => (
          <React.Fragment key={s.number}>
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  getStepStatus(s.number) === 'completed'
                    ? 'bg-green-500 text-white'
                    : getStepStatus(s.number) === 'current'
                    ? 'bg-[#0058be] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                {getStepStatus(s.number) === 'completed' ? <Check className="w-4 h-4" /> : s.number}
              </motion.div>
              <span
                className={`text-xs font-medium ${
                  getStepStatus(s.number) === 'current' ? 'text-[#0058be]' : 'text-gray-500'
                }`}
              >
                {s.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 ${
                  getStepStatus(s.number) === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };
  // ==========================================================================
  // RENDERIZADO
  // ==========================================================================
  return (
    <main className="flex min-h-screen flex-col lg:flex-row bg-[#f9f9ff] text-[#191b23] select-none">
      {/* Left section - branding */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1588515603140-81bd9f7d1db0?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent/95 to-transparent/70 z-10"></div>
        <div className="relative z-20 max-w-lg text-white flex flex-col justify-center items-center h-full text-center py-16">
          <div className="flex flex-col items-center space-y-6">
            <motion.div
              className="relative group"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 -z-10 bg-gradient-to-tr from-slate-800 via-blue-900 to-indigo-900 blur-2xl rounded-full scale-150"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="p-[3px] rounded-full bg-gradient-to-br from-slate-400 via-blue-300 to-slate-600 shadow-2xl shadow-blue-900/40 transition-all duration-700 group-hover:shadow-blue-700/70">
                <img
                  src={logo}
                  alt="Overlix"
                  className="w-40 h-40 rounded-full object-cover border-4 border-white/80 bg-black/30"
                />
              </div>
              <motion.div
                className="absolute inset-0 -z-10 rounded-full border border-white/10"
                animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
                Únete a Overlix
              </span>
              <br />
              <span className="text-blue-200/60 text-base lg:text-xl font-light tracking-[0.2em] uppercase">
                Gestiona tu taller
              </span>
            </h1>
          </div>
        </div>
      </section>
      {/* Right section - form */}
      <section className="flex-1 flex flex-col justify-between min-h-screen p-6 lg:p-12 relative">
        {/* Mobile logo */}
        <div className="w-full lg:hidden flex items-center justify-center py-4">
          <img
            src={logo}
            alt="Overlix"
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white/80 bg-black/30"
          />
        </div>
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-[500px]">
            <Stepper />
            <AnimatePresence mode="wait" initial={false}>
              {/* STEP 0: Solicitar código */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-xl border border-[#c2c6d6]/60 p-8 lg:p-10"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#191b23] tracking-tight mb-2">
                      Solicita tu código de activación
                    </h2>
                    <p className="text-sm text-[#424754]">
                      Para registrarte en Overlix, necesitas un código de activación. Solicítalo a través de
                      WhatsApp.
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-100 rounded-full">
                        <MessageCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#191b23] mb-2">¿Cómo obtener tu código?</h3>
                        <ul className="text-sm text-[#424754] space-y-1">
                          <li>• Haz clic en el botón de WhatsApp</li>
                          <li>• Envía el mensaje predefinido</li>
                          <li>• Recibirás tu código de activación</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/1234567890?text=Hola,%20me%20gustaría%20solicitar%20un%20código%20de%20activación%20para%20registrarme%20en%20Overlix"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button className="w-full bg-green-500 hover:bg-green-600" size="lg">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Solicitar código por WhatsApp
                    </Button>
                  </a>
                  <div className="mt-6 text-center">
                    <p className="text-xs text-[#727785]">
                      ¿Ya tienes tu código?{' '}
                      <button
                        onClick={handleNextStep}
                        className="text-[#0058be] font-medium hover:underline cursor-pointer"
                      >
                        Ingresa aquí
                      </button>
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleGoToLogin} className="w-full mt-4">
                    Volver al login
                  </Button>
                </motion.div>
              )}
              {/* STEP 1: Activación */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-xl border border-[#c2c6d6]/60 p-8 lg:p-10"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#191b23] tracking-tight mb-2">
                      Activación de cuenta
                    </h2>
                    <p className="text-sm text-[#424754]">
                      Ingresa el código de activación que te proporcionamos por WhatsApp.
                    </p>
                  </div>
                  <form onSubmit={handleActivationSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="activationCode">Código de activación</Label>
                      <Input
                        id="activationCode"
                        type="text"
                        placeholder="Ej: OVERLIX-2024"
                        value={activationCode}
                        onChange={(e) => {
                          setActivationCode(e.target.value.toUpperCase());
                          setActivationError('');
                        }}
                        leftIcon={<Key className="w-5 h-5" />}
                        className="pl-11"
                        error={activationError}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-[#0058be] hover:bg-[#2170e4]" size="lg">
                      Verificar código
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </form>
                  <div className="mt-6 text-center">
                    <p className="text-xs text-[#727785]">
                      ¿Ya tienes una cuenta?{' '}
                      <button onClick={handleGoToLogin} className="text-[#0058be] font-medium hover:underline">
                        Inicia sesión
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}
              {/* STEP 2: Datos de empresa (solo si no existe) */}
              {step === 2 && !hasCompanyRegistered && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-xl border border-[#c2c6d6]/60 p-8 lg:p-10"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#191b23] tracking-tight mb-2">
                      Datos de la empresa
                    </h2>
                    <p className="text-sm text-[#424754]">Ingresa la información de tu negocio.</p>
                  </div>
                  <form onSubmit={handleCompanySubmit} className="space-y-4">
                    {/* Razón Social */}
                    <div className="space-y-1.5">
                      <Label htmlFor="razonSocial">Razón Social *</Label>
                      <Input
                        id="razonSocial"
                        placeholder="Ej: TechFix S.A."
                        value={companyData.razonSocial}
                        onChange={(e) => setCompanyData({ ...companyData, razonSocial: e.target.value })}
                        leftIcon={<Building2 className="w-5 h-5" />}
                        error={errors.razonSocial}
                      />
                    </div>
                    {/* Nombre Fantasía */}
                    <div className="space-y-1.5">
                      <Label htmlFor="nombreFantasia">Nombre del taller *</Label>
                      <Input
                        id="nombreFantasia"
                        placeholder="Ej: TechFix"
                        value={companyData.nombreFantasia}
                        onChange={(e) => setCompanyData({ ...companyData, nombreFantasia: e.target.value })}
                        leftIcon={<Building2 className="w-5 h-5" />}
                        error={errors.nombreFantasia}
                      />
                    </div>
                    {/* Dirección */}
                    <div className="space-y-1.5">
                      <Label htmlFor="companyAddress">Dirección *</Label>
                      <Input
                        id="companyAddress"
                        placeholder="Ej: Calle Principal 123"
                        value={companyData.address}
                        onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                        leftIcon={<MapPin className="w-5 h-5" />}
                        error={errors.address}
                      />
                    </div>
                    {/* Google Maps */}
                    <div className="space-y-1.5">
                      <Label htmlFor="googleMapsLink">Link de Google Maps (opcional)</Label>
                      <Input
                        id="googleMapsLink"
                        placeholder="Ej: https://maps.google.com/..."
                        value={companyData.googleMapsLink}
                        onChange={(e) => setCompanyData({ ...companyData, googleMapsLink: e.target.value })}
                        leftIcon={<MapPin className="w-5 h-5" />}
                      />
                    </div>
                    {/* Teléfono */}
                    <div className="space-y-1.5">
                      <Label htmlFor="companyPhone">Teléfono *</Label>
                      <Input
                        id="companyPhone"
                        placeholder="Ej: +34 600 123 456"
                        value={companyData.phone}
                        onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                        leftIcon={<Phone className="w-5 h-5" />}
                        error={errors.phone}
                      />
                    </div>
                    {/* Email */}
                    <div className="space-y-1.5">
                      <Label htmlFor="companyEmail">Email *</Label>
                      <Input
                        id="companyEmail"
                        type="email"
                        placeholder="Ej: info@empresa.com"
                        value={companyData.email}
                        onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                        leftIcon={<Mail className="w-5 h-5" />}
                        error={errors.email}
                      />
                    </div>
                    {/* NIF opcional */}
                    <div className="space-y-1.5">
                      <Label htmlFor="companyNif">NIF/CIF (opcional)</Label>
                      <Input
                        id="companyNif"
                        placeholder="Ej: B12345678"
                        value={companyData.nif}
                        onChange={(e) => setCompanyData({ ...companyData, nif: e.target.value })}
                        leftIcon={<FileText className="w-5 h-5" />}
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePreviousStep}
                        className="flex-1"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Atrás
                      </Button>
                      <Button type="submit" className="flex-1 bg-[#0058be] hover:bg-[#2170e4]">
                        Continuar
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
              {/* STEP 3: Datos del usuario */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-xl border border-[#c2c6d6]/60 p-8 lg:p-10"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#191b23] tracking-tight mb-2">
                      Datos del usuario
                    </h2>
                    <p className="text-sm text-[#424754]">Completa tu información personal.</p>
                    {/* Mostrar código de empresa si ya existe o se ha generado */}
                    {hasCompanyRegistered && existingCompanyData && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-[#191b23] mb-2">
                          Empresa ya registrada: {existingCompanyData.razonSocial}
                        </p>
                        <p className="text-xs text-[#727785]">
                          Código de empresa: <strong>{existingCompanyData.codigoEmpresa}</strong>
                        </p>
                      </div>
                    )}
                    {!hasCompanyRegistered && companyData.codigoEmpresa && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-[#191b23] mb-2">
                          Tu empresa se registrará con el código:
                        </p>
                        <p className="text-lg font-bold text-[#0058be]">{companyData.codigoEmpresa}</p>
                        <p className="text-xs text-[#727785] mt-1">
                          Este código será necesario para que otros usuarios accedan a la empresa.
                        </p>
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleUserSubmit} className="space-y-4">
                    {/* Nombre completo */}
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName">Nombre completo *</Label>
                      <Input
                        id="fullName"
                        placeholder="Ej: Juan Pérez"
                        value={userData.fullName}
                        onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                        leftIcon={<UserPlus className="w-5 h-5" />}
                        error={errors.fullName}
                      />
                    </div>
                    {/* Email */}
                    <div className="space-y-1.5">
                      <Label htmlFor="userEmail">Email *</Label>
                      <Input
                        id="userEmail"
                        type="email"
                        placeholder="Ej: juan@empresa.com"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        leftIcon={<Mail className="w-5 h-5" />}
                        error={errors.email}
                      />
                    </div>
                    {/* Teléfono */}
                    <div className="space-y-1.5">
                      <Label htmlFor="userPhone">Teléfono *</Label>
                      <Input
                        id="userPhone"
                        placeholder="Ej: +34 600 123 456"
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        leftIcon={<Phone className="w-5 h-5" />}
                        error={errors.phone}
                      />
                    </div>
                    {/* Código de empresa (solo si es existente) */}
                    {hasCompanyRegistered && (
                      <div className="space-y-1.5">
                        <Label htmlFor="codigoEmpresa">Código de empresa *</Label>
                        <Input
                          id="codigoEmpresa"
                          placeholder="Ej: TF-2024"
                          value={userData.codigoEmpresa}
                          onChange={(e) =>
                            setUserData({ ...userData, codigoEmpresa: e.target.value.toUpperCase() })
                          }
                          leftIcon={<Key className="w-5 h-5" />}
                          error={errors.codigoEmpresa}
                        />
                        <p className="text-[10px] text-muted-foreground">
                          Ingresa el código que te proporcionó el administrador de la empresa.
                        </p>
                      </div>
                    )}
                    {/* Rol (solo si empresa existente) */}
                    {hasCompanyRegistered && (
                      <div className="space-y-1.5">
                        <Label htmlFor="role">Rol en la empresa *</Label>
                        <Select
                          value={userData.role}
                          onValueChange={(value) => setUserData({ ...userData, role: value })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona tu rol" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="tecnico">Técnico</SelectItem>
                            <SelectItem value="recepcionista">Recepcionista</SelectItem>
                            <SelectItem value="gerente">Gerente</SelectItem>
                            <SelectItem value="contador">Contador</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.role && <p className="text-xs text-destructive mt-1">{errors.role}</p>}
                      </div>
                    )}
                    {/* Contraseña */}
                    <div className="space-y-1.5">
                      <Label htmlFor="password">Contraseña *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={userData.password}
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        leftIcon={<Lock className="w-5 h-5" />}
                        error={errors.password}
                      />
                    </div>
                    {/* Confirmar contraseña */}
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Repite tu contraseña"
                        value={userData.confirmPassword}
                        onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                        leftIcon={<Shield className="w-5 h-5" />}
                        error={errors.confirmPassword}
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePreviousStep}
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Atrás
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-[#0058be] hover:bg-[#2170e4]"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Registrando...' : 'Completar registro'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
              {/* STEP 4: Confirmación final */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-xl border border-[#c2c6d6]/60 p-8 lg:p-10 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-[#191b23] tracking-tight mb-3">
                    ¡Registro completado!
                  </h2>
                  <p className="text-sm text-[#424754] mb-8">
                    ¡Gracias por confiar en Overlix! Ahora eres parte de nuestra comunidad de talleres.
                  </p>
                  {/* Resumen del registro */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                    <h3 className="font-semibold text-[#191b23] mb-2 text-sm">Resumen del registro:</h3>
                    <div className="space-y-1 text-xs text-[#424754]">
                      <p>
                        <strong>Tipo:</strong> {hasCompanyRegistered ? 'Empresa existente' : 'Nueva empresa'}
                      </p>
                      <p>
                        <strong>Nombre:</strong> {userData.fullName}
                      </p>
                      <p>
                        <strong>Email:</strong> {userData.email}
                      </p>
                      <p>
                        <strong>Teléfono:</strong> {userData.phone}
                      </p>
                      {!hasCompanyRegistered && companyData.razonSocial && (
                        <p>
                          <strong>Empresa:</strong> {companyData.razonSocial}
                        </p>
                      )}
                      {hasCompanyRegistered && existingCompanyData && (
                        <p>
                          <strong>Empresa:</strong> {existingCompanyData.razonSocial}
                        </p>
                      )}
                    </div>
                    {/* Código de empresa con botón copiar */}
                    <div className="mt-4 pt-3 border-t border-blue-200">
                      <p className="text-xs font-medium text-[#191b23]">🔑 Código de acceso a la empresa:</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xl font-mono font-bold text-[#0058be]">
                          {hasCompanyRegistered
                            ? existingCompanyData?.codigoEmpresa || 'No disponible'
                            : companyData.codigoEmpresa || 'No disponible'}
                        </p>
                        <button
                          onClick={() =>
                            handleCopyCode(
                              hasCompanyRegistered
                                ? existingCompanyData?.codigoEmpresa || ''
                                : companyData.codigoEmpresa || ''
                            )
                          }
                          className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                          title="Copiar código"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-[#0058be]" />
                          )}
                        </button>
                      </div>
                      {copied && (
                        <p className="text-xs text-green-600 mt-1">¡Copiado al portapapeles!</p>
                      )}
                      <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800">
                          <strong>¡Guarda este código!</strong> Es necesario para que los usuarios de tu
                          empresa accedan al sistema. Si lo pierdes, contacta con soporte.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleGoToLogin} className="w-full bg-[#0058be] hover:bg-[#2170e4]" size="lg">
                    Ir al login
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}
