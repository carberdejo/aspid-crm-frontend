import { z } from "zod";

export const quoteSchema = z.object({
  quoteNumber: z.string().min(1, "El número de cotización es obligatorio"),
  // Responsable: solo lo elige el admin (vacío = el usuario conectado)
  userId: z.string().optional(),
  clientId: z.string().min(1, "El cliente es obligatorio"),
  contactId: z.string().min(1, "El contacto es obligatorio"),
  departmentId: z.number(),
  amount: z.number().positive("El monto debe ser un número positivo"),
  type: z.string().min(1, "El tipo es obligatorio"),
  orderType: z.string().min(1, "El tipo de orden es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  // Colaborador opcional: usuario activo del área, distinto del responsable
  collaboratorId: z.string().optional(),
  createdAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Ingresa una fecha válida",
  }),
  currency: z.enum(["USD", "PEN", "CLP", "MXN"]).optional(),
});

export type QuoteFormValues = z.infer<typeof quoteSchema>;
