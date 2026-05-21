import { PaginatedResponse } from ".";

export enum QuoteStatus {
  PENDIENTE = "PENDIENTE",
  APROBADO = "APROBADO",
  RECHAZADO = "RECHAZADO",
}

export enum QuoteType {
  PRODUCTO = "PRODUCTO",
  SERVICIO = "SERVICIO",
  PROYECTO = "PROYECTO",
}

export enum QuoteOrderType {
  IMPORTACION = "IMPORTACION",
  STOCK = "STOCK",
  ENTREGA_PARCIAL = "ENTREGA_PARCIAL",
}

export enum QuoteCurrency {
  USD = "USD",
  PEN = "PEN",
}
export interface UserLite {
  id: number;
  codUSer: string;
  firstName: string;
  lastName: string;
}

export interface ClientLite {
  id: number;
  commercialName: string;
  ruc: string;
}

export interface ClientFull extends ClientLite {
  businessName: string;
  address: string;
}

export interface ContactLite {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
}

export interface ContactFull extends ContactLite {
  phone: string;
}

export interface Quote {
  id: number;
  quoteNumber: string;
  amount: number;
  currency: QuoteCurrency;
  status: QuoteStatus;
  type: string;
  createdAt: string;
  userId: number;
  clientId: number;
  contactId: number;
  collaboratorId?: number;
  departmentId: number;

  // Relaciones
  user: UserLite;
  client: ClientLite;
  contact: ContactLite;
  collaborator?: UserLite;
}

export interface QuoteDetail extends Omit<Quote, "client" | "contact"> {
  // Detalles adicionales para la vista de detalle
  orderType?: string;
  description: string;
  statusReason?: string;
  updatedAt: string;
  client: ClientFull;
  contact: ContactFull;
}

export interface QuoteCreateDto {
  quoteNumber: string;
  userId: number;
  clientId: number;
  contactId: number;
  departmentId: number;
  amount: number;
  type: string;
  orderType: string;
  description: string;
  collaboratorId?: number | null;
  createdAt: Date;
  currency?: QuoteCurrency;
}

export interface QuoteDelete {
  statusReason: string;
}

export interface QuoteUpdateDto {
  quoteNumber?: string;
  userId?: number;
  clientId?: number;
  contactId?: number;
  departmentId?: number;
  amount?: number;
  type?: string;
  orderType?: string;
  description?: string;
  collaboratorId?: number | null;
}

export interface QuotePaginatedResponse extends PaginatedResponse<Quote> {
  totalAmountUSD: number;
}
