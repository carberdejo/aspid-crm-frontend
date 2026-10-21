import { DocumentStatus } from "./purchase-order.interface";

export interface CreateInvoiceDto {
  orderId: number;
  invoiceNumber: string;
  amount: number;
  issueDate: string;
  currency: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  issueDate: string;
  amount: number;
  currency: string;
  orderId?: number;
  poNumber: string;
  quoteNumber: string;
  businessName: string;
  ruc: string;
  // Anulación: el número de una factura anulada queda reservado
  status: DocumentStatus;
  annulledAt?: string | null;
  annulReason?: string | null;
  userId?: number; // Dueño de la cotización: decide si se muestran editar/anular
}

export interface InvoiceQuery {
  term?: string;
  userId?: number;
  departmentId?: number;
  clientId?: number;
  status?: DocumentStatus; // Sin valor: vigentes y anuladas
}

// La OC y la moneda de una factura no se cambian (la moneda es la de su OC)
export interface UpdateInvoiceDto {
  invoiceNumber?: string;
  issueDate?: string;
  amount?: number;
}
