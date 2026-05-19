import * as z from "zod";

// Sub-esquema para validar a cada usuario asignado a la cartera
export const portfolioUserItemSchema = z.object({
  userId: z.coerce.number().positive("Selecciona un usuario del sistema"),
  roleInPortfolio: z.enum(
    ["RESPONSABLE", "ING_PROYECTOS", "SERVICIOS"] as const,
    { error: "El rol operativo es requerido" },
  ),
});

// Esquema principal de la Cartera
export const portfolioSchema = z.object({
  code: z
    .string()
    .min(2, "El código debe tener al menos 2 caracteres")
    .regex(/^C\d+$/, "El código debe tener el formato C1, C2, etc. (Ej: C5)"),
  type: z.string().min(2, "El tipo de cartera es obligatorio"),
  province: z.string().optional(),
  zone: z.string().optional(),
  users: z.array(portfolioUserItemSchema).default([]),
});

export type PortfolioFormValues = z.infer<typeof portfolioSchema>;
