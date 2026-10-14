import * as z from "zod";

export const visitSchema = z.object({
    clientId: z.string().min(1, "Selecciona un cliente"),
    contactId: z.string().min(1, "Selecciona un contacto"),
    // Responsable: solo lo elige el admin (vacío = el usuario conectado)
    userId: z.string().optional(),
    departmentId: z.number().int().min(1, "Selecciona un área"),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Ingresa una fecha válida",
    }),
    visitTopics: z.string().min(5, "Los temas de la visita deben tener al menos 5 caracteres"),
    outcomeSummary: z.string().min(5, "El resumen de resultados debe tener al menos 5 caracteres"),
});
 

export type VisitFormValues = z.infer<typeof visitSchema>;