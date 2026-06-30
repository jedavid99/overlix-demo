import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDate, IsNumber, Min, IsUUID, IsBoolean, IsArray, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export enum RepairStatus {
  DIAGNOSTIC = 'Diagnóstico',
  IN_PROGRESS = 'En Progreso',
  WAITING_PARTS = 'Esperando Repuestos',
  TESTING = 'Reparado',
  COMPLETED = 'Garantía',
  CANCELLED = 'Irreparable',
}

// English status values for frontend compatibility
export enum RepairStatusEnglish {
  PENDING = 'pending',
  DIAGNOSTIC = 'diagnostic',
  IN_PROGRESS = 'in_progress',
  WAITING_PARTS = 'waiting_parts',
  READY = 'ready',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

// Mapping from English to Spanish
export const STATUS_ENGLISH_TO_SPANISH: Record<string, string> = {
  [RepairStatusEnglish.PENDING]: RepairStatus.DIAGNOSTIC,
  [RepairStatusEnglish.DIAGNOSTIC]: RepairStatus.DIAGNOSTIC,
  [RepairStatusEnglish.IN_PROGRESS]: RepairStatus.IN_PROGRESS,
  [RepairStatusEnglish.WAITING_PARTS]: RepairStatus.WAITING_PARTS,
  [RepairStatusEnglish.READY]: RepairStatus.TESTING,
  [RepairStatusEnglish.DELIVERED]: RepairStatus.COMPLETED,
  [RepairStatusEnglish.CANCELLED]: RepairStatus.CANCELLED,
};

// Mapping from Spanish to English
export const STATUS_SPANISH_TO_ENGLISH: Record<string, string> = {
  [RepairStatus.DIAGNOSTIC]: RepairStatusEnglish.DIAGNOSTIC,
  [RepairStatus.IN_PROGRESS]: RepairStatusEnglish.IN_PROGRESS,
  [RepairStatus.WAITING_PARTS]: RepairStatusEnglish.WAITING_PARTS,
  [RepairStatus.TESTING]: RepairStatusEnglish.READY,
  [RepairStatus.COMPLETED]: RepairStatusEnglish.DELIVERED,
  [RepairStatus.CANCELLED]: RepairStatusEnglish.CANCELLED,
};

export enum RepairPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum DeviceCategory {
  PHONE = 'phone',
  LAPTOP = 'laptop',
  TABLET = 'tablet',
  WATCH = 'watch',
  CONSOLE = 'console',
  OTHER = 'other',
}

export enum SecurityType {
  NONE = 'none',
  PIN = 'pin',
  PATTERN = 'pattern',
  FINGERPRINT = 'fingerprint',
  FACE = 'face',
}

export class CreateRepairDto {
  @IsNotEmpty()
  @IsUUID()
  cliente_id: string;

  @IsNotEmpty()
  @IsString()
  dispositivo: string;

  @IsOptional()
  @IsEnum(DeviceCategory)
  categoria_dispositivo?: DeviceCategory;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsString()
  modelo?: string;

  @IsOptional()
  @IsString()
  numero_serie?: string;

  @IsNotEmpty()
  @IsString()
  problema_reportado: string;

  @IsOptional()
  @IsString()
  condicion_estetica?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accesorios_incluidos?: string[];

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  fecha_ingreso: Date;

  @IsOptional()
  @IsEnum(RepairPriority)
  prioridad?: RepairPriority;

  @IsOptional()
  @IsUUID()
  tecnico_asignado_id?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fecha_estimada_entrega?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tiempo_estimado_minutos?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total_reparacion?: number;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsBoolean()
  pagado?: boolean;

  @IsOptional()
  @IsUUID()
  metodo_pago_id?: string;

  // Seguridad y acceso
  @IsOptional()
  @IsEnum(SecurityType)
  tipo_seguridad?: SecurityType;

  @IsOptional()
  @IsString()
  pin_acceso?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  patron_puntos?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  secuencia_patron?: number[];

  // Chequeo de hardware
  @IsOptional()
  @IsObject()
  chequeo_hardware?: Record<string, any>;
}
