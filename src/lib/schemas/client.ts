import { z } from "zod";

export const clientSchema = z.object({
  commercialName: z
    .string()
    .min(3, "El nombre comercial debe tener al menos 3 caracteres"),
  businessName: z.string().min(3, "La razón social es obligatoria"),
  ruc: z
    .string()
    .length(11, "El RUC debe tener exactamente 11 dígitos")
    .regex(/^\d+$/, "El RUC solo debe contener números"),
  address: z.string().min(5, "La dirección es obligatoria"),
  segmentId: z.coerce
    .number()
    .positive("Debes seleccionar un segmento industrial"),
  portfolioId: z.coerce
    .number()
    .positive("Debes seleccionar una cartera de accesos"),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
