import { z } from "zod";
import { validatePhoneNumber } from "..";
import { CountryCode } from "libphonenumber-js";

export const contactSchema = z
  .object({
    firstName: z.string().min(2, "El nombre es obligatorio"),
    lastName: z.string().min(2, "El apellido es obligatorio"),
    position: z.string().min(2, "El cargo es obligatorio"),
    clientId: z.number().int("El ID del cliente es inválido"),
    email: z.string().email("Correo electrónico inválido"),

    countryIso: z.string().min(1, "Requerido") as z.ZodType<CountryCode>,
    countryCode: z.string().min(1, "Requerido"),
    phone: z.string().min(5, "Número muy corto"),
  })
  .refine(
    (data) => {
      return validatePhoneNumber(data.phone, data.countryIso);
    },
    {
      message: "Formato de teléfono incorrecto para el país seleccionado",
      path: ["phone"],
    },
  );

export type ContactFormValues = z.infer<typeof contactSchema>;
