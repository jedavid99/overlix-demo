import { z } from 'zod';

export const businessInfoSchema = z.object({
  nombre_negocio: z.string().min(2, 'El nombre del negocio debe tener al menos 2 caracteres'),
  propietario_nombre: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefono: z.string().min(10, 'El teléfono debe tener al menos 10 caracteres').optional(),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  provincia: z.string().optional(),
  codigo_postal: z.string().optional(),
  sitio_web: z.string().url('URL inválida').optional().or(z.literal('')),
  descripcion: z.string().max(500, 'La descripción no puede exceder 500 caracteres').optional(),
  horarios: z.object({
    lunes: z.string().optional(),
    martes: z.string().optional(),
    miercoles: z.string().optional(),
    jueves: z.string().optional(),
    viernes: z.string().optional(),
    sabado: z.string().optional(),
    domingo: z.string().optional(),
  }).optional(),
});

export type BusinessInfoFormData = z.infer<typeof businessInfoSchema>;
