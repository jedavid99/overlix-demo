import { 
  Smartphone, 
  Laptop, 
  Monitor, 
  Tablet, 
  Gamepad2, 
  Grid3X3,
  Power,
  Volume,
  Eye,
  Camera,
  Wifi,
  Fingerprint,
  Volume2,
  Mic,
  Zap,
  Battery,
  Keyboard,
  Mouse,
  HardDrive,
  Usb,
  Cpu,
  Shield,
  Key
} from 'lucide-react';
import { RiSimCard2Line } from 'react-icons/ri';
import type { RepairData } from '../../RepairFlow';

// Hardware items por categoría
export const hardwareByCategory: Record<string, { key: string; label: string; icon: any }[]> = {
  phone: [
    { key: 'botonPawer', label: 'Botón de Power', icon: Power },
    { key: 'botonVolumen', label: 'Botón de Volumen', icon: Volume },
    { key: 'sensorProximidad', label: 'Sensor de Proximidad', icon: Eye },
    { key: 'camaraFrontal', label: 'Cámara Frontal', icon: Camera },
    { key: 'modulo', label: 'Módulo', icon: Smartphone },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'huella', label: 'Huella', icon: Fingerprint },
    { key: 'camaraTrasera', label: 'Cámara Trasera', icon: Camera },
    { key: 'audio', label: 'Audio', icon: Volume2 },
    { key: 'altavoz', label: 'Altavoz', icon: Mic },
    { key: 'fichaCarga', label: 'Ficha de Carga', icon: Zap },
    { key: 'bateria', label: 'Batería', icon: Battery },
    { key: 'lectorSimcard', label: 'Lector de Simcard', icon: RiSimCard2Line },
  ],
  notebook: [
    { key: 'teclado', label: 'Teclado', icon: Keyboard },
    { key: 'trackpad', label: 'Trackpad', icon: Mouse },
    { key: 'pantalla', label: 'Pantalla', icon: Monitor },
    { key: 'bateria', label: 'Batería', icon: Battery },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'camara', label: 'Cámara', icon: Camera },
    { key: 'altavoces', label: 'Altavoces', icon: Volume2 },
    { key: 'puertos', label: 'Puertos USB', icon: Usb },
    { key: 'cargador', label: 'Cargador', icon: Zap },
  ],
  pc: [
    { key: 'fuentePoder', label: 'Fuente de Poder', icon: Power },
    { key: 'cpu', label: 'CPU', icon: Cpu },
    { key: 'ram', label: 'Memoria RAM', icon: HardDrive },
    { key: 'disco', label: 'Disco Duro/SSD', icon: HardDrive },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'puertos', label: 'Puertos USB', icon: Usb },
    { key: 'audio', label: 'Audio', icon: Volume2 },
  ],
  tablet: [
    { key: 'pantalla', label: 'Pantalla', icon: Monitor },
    { key: 'bateria', label: 'Batería', icon: Battery },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'camara', label: 'Cámara', icon: Camera },
    { key: 'altavoces', label: 'Altavoces', icon: Volume2 },
    { key: 'botones', label: 'Botones Físicos', icon: Power },
    { key: 'cargador', label: 'Cargador', icon: Zap },
  ],
  console: [
    { key: 'fuentePoder', label: 'Fuente de Poder', icon: Power },
    { key: 'lectorDiscos', label: 'Lector de Discos', icon: HardDrive },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'puertos', label: 'Puertos USB', icon: Usb },
    { key: 'audio', label: 'Audio', icon: Volume2 },
    { key: 'control', label: 'Control/Gamepad', icon: Gamepad2 },
  ],
  other: [
    { key: 'bateria', label: 'Batería', icon: Battery },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'puertos', label: 'Puertos', icon: Usb },
    { key: 'audio', label: 'Audio', icon: Volume2 },
  ],
};

// Opciones de seguridad por categoría
export const securityOptionsByCategory: Record<string, { id: string; label: string; icon: any }[]> = {
  phone: [
    { id: 'ninguno', label: 'Ninguno', icon: Shield },
    { id: 'pin', label: 'PIN', icon: Key },
    { id: 'patron', label: 'Patrón', icon: Grid3X3 },
    { id: 'huella', label: 'Huella', icon: Fingerprint },
  ],
  notebook: [
    { id: 'ninguno', label: 'Ninguno', icon: Shield },
    { id: 'pin', label: 'Contraseña', icon: Key },
    { id: 'huella', label: 'Huella', icon: Fingerprint },
  ],
  pc: [
    { id: 'ninguno', label: 'Ninguno', icon: Shield },
    { id: 'pin', label: 'Contraseña', icon: Key },
  ],
  tablet: [
    { id: 'ninguno', label: 'Ninguno', icon: Shield },
    { id: 'pin', label: 'PIN', icon: Key },
    { id: 'patron', label: 'Patrón', icon: Grid3X3 },
  ],
  console: [
    { id: 'ninguno', label: 'Ninguno', icon: Shield },
    { id: 'pin', label: 'Código', icon: Key },
  ],
  other: [
    { id: 'ninguno', label: 'Ninguno', icon: Shield },
    { id: 'pin', label: 'Contraseña', icon: Key },
  ],
};

// Categorías de dispositivo
export const deviceCategories = [
  { id: 'phone', name: 'Teléfono', icon: Smartphone, color: 'text-primary', bgColor: 'bg-primary/10' },
  { id: 'notebook', name: 'Portátil', icon: Laptop, color: 'text-info', bgColor: 'bg-info/10' },
  { id: 'pc', name: 'PC', icon: Monitor, color: 'text-success', bgColor: 'bg-success/10' },
  { id: 'tablet', name: 'Tablet', icon: Tablet, color: 'text-warning', bgColor: 'bg-warning/10' },
  { id: 'console', name: 'Consola', icon: Gamepad2, color: 'text-destructive', bgColor: 'bg-destructive/10' },
  { id: 'other', name: 'Otro', icon: Grid3X3, color: 'text-muted-foreground', bgColor: 'bg-muted' },
];

// Estado inicial por defecto
export const defaultData: RepairData = {
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
  hardwareChecks: {},
  securityType: 'ninguno',
  accessPin: '',
  patternDots: [false, false, false, false, false, false, false, false, false],
  patternSequence: [],
  technicianNotes: '',
  termsAccepted: false,
  signaturePad: '',
  printOption: 'both',
  paymentMethod: 'cash',
  installmentsCount: 1,
  paymentType: 'full',
  orderNumber: '',
};

// Props para el componente principal
export interface RepairCreateProps {
  data?: RepairData;
  updateData?: (updates: Partial<RepairData>) => void;
  onSave?: () => void;
  currentStep?: number;
}

// Props para subcomponentes
export interface ClientSelectorProps {
  selectedClient: RepairData['selectedClient'];
  onSelectClient: (client: any) => void;
  onClearClient: () => void;
}

export interface DeviceFormProps {
  deviceType: string;
  brand: string;
  model: string;
  serial: string;
  aestheticCondition: string;
  accessories: string[];
  onDeviceTypeChange: (type: string) => void;
  onBrandChange: (brand: string) => void;
  onModelChange: (model: string) => void;
  onSerialChange: (serial: string) => void;
  onConditionChange: (condition: string) => void;
  onAccessoryToggle: (accessory: string) => void;
  onGenerateSerial: () => void;
}

export interface SecurityFormProps {
  deviceType: string;
  securityType: string;
  accessPin: string;
  hardwareChecks: Record<string, boolean>;
  onSecurityTypeChange: (type: string) => void;
  onAccessPinChange: (pin: string) => void;
  onHardwareToggle: (key: string) => void;
}

export interface DiagnosticFormProps {
  issueDescription: string;
  technicianNotes: string;
  priority: string;
  estimatedDays: number;
  onIssueDescriptionChange: (desc: string) => void;
  onTechnicianNotesChange: (notes: string) => void;
  onPriorityChange: (priority: string) => void;
  onEstimatedDaysChange: (days: number) => void;
}

export interface SummaryProps {
  selectedClient: RepairData['selectedClient'];
  deviceType: string;
  brand: string;
  model: string;
  serial: string;
  hardwareChecks: Record<string, boolean>;
  orderNumber: string;
}

export interface PaymentFormProps {
  paymentMethod: string;
  paymentType: string;
  installmentsCount: number;
  onPaymentMethodChange: (method: string) => void;
  onPaymentTypeChange: (type: string) => void;
  onInstallmentsCountChange: (count: number) => void;
}

export interface ConfirmModalProps {
  isOpen: boolean;
  selectedClient: RepairData['selectedClient'];
  deviceType: string;
  brand: string;
  model: string;
  serial: string;
  issueDescription: string;
  repairPrice: string;
  submitting: boolean;
  onBack: () => void;
  onConfirm: () => void;
  onPriceChange: (price: string) => void;
}
