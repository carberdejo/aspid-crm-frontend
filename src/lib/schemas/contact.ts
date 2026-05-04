import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().min(2, "El nombre es obligatorio"),
  lastName: z.string().min(2, "El apellido es obligatorio"),
  position: z.string().min(2, "El cargo es obligatorio"),
  phone: z.string().min(9, "Teléfono inválido").max(15),
  clientId: z.number().int("El ID del cliente es inválido"),
  email: z.string().email("Correo electrónico inválido"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
