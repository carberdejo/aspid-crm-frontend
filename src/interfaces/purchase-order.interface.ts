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
  invoicedAmount: number; // Monto que ya ha sido facturado (solo facturas vigentes)
  // Anulación: una OC anulada sigue en el listado, pero ya no se edita ni se factura
  status: DocumentStatus;
  annulledAt?: string | null;
  annulReason?: string | null;
  userId?: number; // Dueño de la cotización: decide si se muestran editar/anular

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
  status?: DocumentStatus; // Sin valor: vigentes y anuladas
}

export interface CreatePurchaseOrderDto {
  poNumber: string;
  receivedAt?: string;
  quoteId: number;
}

// La cotización de una OC no se cambia: para otra cotización se anula y se registra otra
export interface UpdatePurchaseOrderDto {
  poNumber?: string;
  receivedAt?: string;
  amount?: number;
  currency?: string;
}

/** Motivo para anular una OC o una factura (mínimo 10 caracteres) */
export interface AnnulDocumentDto {
  annulReason: string;
}

/** Vigencia de una OC o factura; independiente del estado de facturación */
export enum DocumentStatus {
  VIGENTE = "VIGENTE",
  ANULADA = "ANULADA",
}

export enum BillingStatus {
  PENDIENTE_FACTURACION = "PENDIENTE_FACTURACION",
  FACTURADO_PARCIAL = "FACTURADO_PARCIAL",
  FACTURADO_COMPLETO = "FACTURADO_COMPLETO",
}
