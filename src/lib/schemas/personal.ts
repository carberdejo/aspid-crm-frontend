import { UserRole } from "@/interfaces";
import { CountryCode } from "libphonenumber-js";
import * as z from "zod";
import { validatePhoneNumber } from "..";

export const personalSchema = z
  .object({
    codUser: z
      .string()
      .min(3, "El código de usuario debe tener al menos 3 caracteres"),
    firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    email: z.string().email("Ingresa un correo electrónico válido"),
    role: z.enum([UserRole.ADMIN, UserRole.USER] as const, {
      message: "Por favor selecciona un rol",
    }),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    departmentIds: z
      .array(z.number().int())
      .min(1, "Selecciona al menos un área"),
    //---
    countryCode: z.string().min(1, "Requerido"),
    countryIso: z.string().min(1) as z.ZodType<CountryCode>, // Guardamos el ISO (PE, MX) para la lógica
    phone: z.string().min(5, "Teléfono muy corto"),
    country: z.string().min(1, "Selecciona un país de residencia"),
  })
  .refine(
    (data) => {
      // Validación dinámica: Valida el teléfono usando el ISO del país seleccionado
      return validatePhoneNumber(data.phone, data.countryIso);
    },
    {
      message: "El formato del teléfono no es válido para el país seleccionado",
      path: ["phone"], // El error aparecerá en el campo de teléfono
    },
  );
// .transform((data) => {
//   // AQUÍ ESTÁ EL TRUCO: Quitamos countryIso antes de que llegue al onSubmit
//   const { countryIso, ...rest } = data;
//   return rest;
// });

export type PersonalFormValues = z.infer<typeof personalSchema>;
