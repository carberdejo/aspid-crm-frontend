import { z } from "zod";

export const createInvoiceFormSchema = z.object({
  orderId: z.number().min(1, "La orden es requerida"),
  invoiceNumber: z.string().min(1, "El número de factura es requerido"),
  amount: z.number().min(0.01, "El monto a facturar debe ser mayor a 0"),
  issueDate: z.string().min(1, "La fecha de emisión es requerida"),
  currency: z.string().min(1, "La moneda es requerida"),
});

export type CreateInvoiceFormValues = z.infer<typeof createInvoiceFormSchema>;
