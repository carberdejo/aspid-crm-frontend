import { aspidApi } from "@/api/aspidApi";
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

    const { data } = await aspidApi.get<
      ApiResponse<PaginatedResponse<Invoice>>
    >(`/invoices`, { params });
    return data.data;
  },

  create: async (data: CreateInvoiceDto) => {
    const { data: responseData } = await aspidApi.post<
      ApiResponse<ResponseOperation>
    >(`/invoices`, data);
    return responseData.data;
  },

  update: async (id: number, data: UpdateInvoiceDto) => {
    const { data: responseData } = await aspidApi.patch<
      ApiResponse<ResponseOperation>
    >(`/invoices/${id}`, data);
    return responseData.data;
  },

  // La factura deja de contar en lo facturado; su número queda reservado
  annul: async (id: number, data: AnnulDocumentDto) => {
    const { data: responseData } = await aspidApi.patch<
      ApiResponse<ResponseOperation>
    >(`/invoices/${id}/annul`, data);
    return responseData.data;
  },
};
