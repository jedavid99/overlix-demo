import { z } from 'zod';

export const repairCreateSchema = z.object({
  cliente_id: z.string().min(1, 'Debe seleccionar un cliente'),
  dispositivo: z.string().min(3, 'El dispositivo debe tener al menos 3 caracteres'),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  problema_reportado: z.string().min(5, 'El problema reportado debe tener al menos 5 caracteres'),
  diagnosis: z.string().optional(),
  prioridad: z.enum(['low', 'medium', 'high', 'critical']),
  fecha_ingreso: z.string().min(1, 'La fecha de ingreso es requerida'),
  tecnico_asignado_id: z.string().optional(),
  notas: z.string().max(500, 'Las notas no pueden exceder 500 caracteres').optional(),
});

export type RepairCreateFormData = z.infer<typeof repairCreateSchema>;
