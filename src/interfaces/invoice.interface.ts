export interface CreateInvoiceDto {
  orderId: number;
  invoiceNumber: string;
  amount: number;
  issueDate: string;
}
