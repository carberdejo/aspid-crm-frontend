import { QuoteCurrency } from "@/interfaces";
import { z } from "zod";

export const purchaseOrderFormSchema = z.object({
  poNumber: z.string().min(1, "El número de orden es obligatorio"),
  receivedAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Ingresa una fecha válida",
  }),
  quoteId: z.number().positive("Selecciona una cotización válida"),

  amount: z.number().min(0.01, "El monto debe ser mayor a 0"),
  currency: z.nativeEnum(QuoteCurrency, {
    error: "Debe seleccionar una moneda",
  }),
});

export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderFormSchema>;

// Edición de una OC: la cotización no se cambia. El monto no puede quedar por debajo
// de lo ya facturado (el backend lo vuelve a validar)
export const updatePurchaseOrderSchema = (invoicedAmount: number) =>
  z.object({
    poNumber: z.string().min(1, "El número de orden es obligatorio"),
    receivedAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Ingresa una fecha válida",
    }),
    amount: z
      .number({ error: "Ingresa un monto válido" })
      .min(0.01, "El monto debe ser mayor a 0")
      .min(
        invoicedAmount,
        `El monto no puede ser menor a lo ya facturado (${invoicedAmount})`,
      ),
    currency: z.nativeEnum(QuoteCurrency, {
      error: "Debe seleccionar una moneda",
    }),
  });

export type UpdatePurchaseOrderFormValues = z.infer<
  ReturnType<typeof updatePurchaseOrderSchema>
>;
