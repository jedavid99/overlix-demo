import { z } from 'zod';

export const clientCreateSchema = z.object({
  nombre_completo: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  telefono: z.string().min(10, 'El teléfono debe tener al menos 10 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  dni: z.string().min(7, 'El DNI debe tener al menos 7 caracteres').optional().or(z.literal('')),
  direccion: z.string().min(5, 'La dirección debe tener al menos 5 caracteres').optional().or(z.literal('')),
  ciudad: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres').optional().or(z.literal('')),
  provincia: z.string().min(2, 'La provincia debe tener al menos 2 caracteres').optional().or(z.literal('')),
  notas: z.string().max(500, 'Las notas no pueden exceder 500 caracteres').optional().or(z.literal('')),
});

export type ClientCreateFormData = z.infer<typeof clientCreateSchema>;
