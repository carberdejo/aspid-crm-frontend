import { GenericFilters } from "./api.interface";

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  receivedAt: string;
  quoteNumber: string; // Para la lista simplificada
  clientName: string; // Para la lista simplificada
  ruc?: string;
  // Estos campos vienen en el findOne (detalle)
  quote?: {
    id: number;
    quoteNumber: string;
    amount: number;
    currency: string;
    status: string;
  };
  client?: {
    id: number;
    name: string;
    ruc: string;
  };
}

export interface PurchaseOrderFilters
  extends GenericFilters, Record<string, unknown> {
  term?: string;
}

export interface CreatePurchaseOrderDto {
  poNumber: string;
  receivedAt?: string;
  quoteId: number;
}
