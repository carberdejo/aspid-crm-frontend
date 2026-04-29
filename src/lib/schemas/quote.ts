import { z } from "zod";

export const quoteSchema = z.object({
  quoteNumber: z.string().min(1, "El número de cotización es obligatorio"),
  userId: z.number(),
  clientId: z.string().min(1, "El cliente es obligatorio"),
  contactId: z.string().min(1, "El contacto es obligatorio"),
  departmentId: z.number(),
  amount: z.number().positive("El monto debe ser un número positivo"),
  type: z.string().min(1, "El tipo es obligatorio"),
  orderType: z.string().min(1, "El tipo de orden es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  collaboratorId: z.number().optional(),
});

export type QuoteFormValues = z.infer<typeof quoteSchema>;
