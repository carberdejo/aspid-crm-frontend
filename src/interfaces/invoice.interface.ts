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
  poNumber: string;
  quoteNumber: string;
  businessName: string;
  ruc: string;
}

export interface InvoiceQuery {
  term?: string;
  userId?: number;
  departmentId?: number;
  clientId?: number;
}
