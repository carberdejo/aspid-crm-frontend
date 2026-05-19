import * as z from "zod";

export const segmentSchema = z.object({
  code: z
    .string()
    .min(2, "El código debe tener al menos 2 caracteres")
    .max(20, "El código no puede superar los 20 caracteres")
    .regex(/^[A-Z0-9&]+$/, "Solo letras mayúsculas, números y el símbolo &"),
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),
});

export type SegmentFormValues = z.infer<typeof segmentSchema>;
