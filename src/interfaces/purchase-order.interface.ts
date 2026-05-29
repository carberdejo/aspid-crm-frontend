import { GenericFilters } from ".";

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  receivedAt: string;
  quoteNumber: string;
  clientName: string;
  ruc?: string;
  billingStatus: BillingStatus;
  amount: number;
  currency: string;
  remainingAmount: number; // Para mostrar cuánto falta por facturar
  billingPercentage?: number; // Porcentaje de la orden que ha sido facturado
  invoicedAmount: number; // Monto que ya ha sido facturado

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
  userId?: number;
  departmentId?: number;
  clientId?: number;
  billingStatus?: string;
}

export interface CreatePurchaseOrderDto {
  poNumber: string;
  receivedAt?: string;
  quoteId: number;
}

export enum BillingStatus {
  PENDIENTE_FACTURACION = "PENDIENTE_FACTURACION",
  FACTURADO_PARCIAL = "FACTURADO_PARCIAL",
  FACTURADO_COMPLETO = "FACTURADO_COMPLETO",
}
