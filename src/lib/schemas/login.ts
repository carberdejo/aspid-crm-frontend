import * as z from "zod";

// Esquema de validación
export const loginSchema = z.object({
  email: z.string().email('Ingrese un correo electrónico válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});
export type LoginFormValues = z.infer<typeof loginSchema>;