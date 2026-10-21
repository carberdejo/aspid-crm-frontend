import { concarApi } from "@/api/concarApi";
import {
  AnnulDocumentDto,
  ApiResponse,
  CreateInvoiceDto,
  InvoiceQuery,
  PaginatedResponse,
  ResponseOperation,
  Invoice,
  UpdateInvoiceDto,
} from "@/interfaces";

import { cleanParams } from "@/lib";

export const invoiceService = {
  getInvoices: async (
    query: InvoiceQuery,
  ): Promise<PaginatedResponse<Invoice>> => {
    const params = cleanParams(query as Record<string, unknown>);

    const { data } = await concarApi.get<
      ApiResponse<PaginatedResponse<Invoice>>
    >(`/invoices`, { params });
    return data.data;
  },

  create: async (data: CreateInvoiceDto) => {
    const { data: responseData } = await concarApi.post<
      ApiResponse<ResponseOperation>
    >(`/invoices`, data);
    return responseData.data;
  },

  update: async (id: number, data: UpdateInvoiceDto) => {
    const { data: responseData } = await concarApi.patch<
      ApiResponse<ResponseOperation>
    >(`/invoices/${id}`, data);
    return responseData.data;
  },

  // La factura deja de contar en lo facturado; su número queda reservado
  annul: async (id: number, data: AnnulDocumentDto) => {
    const { data: responseData } = await concarApi.patch<
      ApiResponse<ResponseOperation>
    >(`/invoices/${id}/annul`, data);
    return responseData.data;
  },
};
