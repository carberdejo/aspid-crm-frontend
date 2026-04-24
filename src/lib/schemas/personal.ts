import { UserRole } from "@/interfaces";
import * as z from "zod";

export const personalSchema = z.object({
  codUser: z.string().min(3, "El código de usuario debe tener al menos 3 caracteres"),
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  phone: z.string().min(9, "El teléfono debe tener al menos 9 dígitos"),
  role: z.enum([UserRole.ADMIN, UserRole.USER] as const, {
    message: "Por favor selecciona un rol",
  }),
  country: z.string().min(2, "El país debe tener al menos 2 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  departmentIds: z.array(z.number().int()).min(1, "Selecciona al menos un área"),
});

export type PersonalFormValues = z.infer<typeof personalSchema>;