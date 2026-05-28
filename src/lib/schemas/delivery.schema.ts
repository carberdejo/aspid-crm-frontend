import { z } from "zod";

// Esquema para cada ítem del JSONB
const deliveryItemSchema = z.object({
  producto: z.string().min(1, "El nombre del producto es requerido"),
  // Usamos coerce para convertir el input string de HTML a number automáticamente
  cantidad: z.coerce.number().min(1, "La cantidad debe ser al menos 1"),
});

export const createDeliverySchema = z.object({
  // El ClientSearchSelector maneja strings, luego en el submit lo pasamos a number
  clientId: z.coerce.number().optional(),
  //   userId: z.coerce.number().positive("Selecciona un usuario del sistema"),
  deliveryDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Ingresa una fecha válida",
  }),
  // Array opcional, por defecto vacío, justo como lo configuramos en la BD
  deliveryItems: z.array(deliveryItemSchema).optional().default([]),
});

export type CreateDeliveryValues = z.infer<typeof createDeliverySchema>;
