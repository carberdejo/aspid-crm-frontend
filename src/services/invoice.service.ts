import { concarApi } from "@/api/concarApi";
import {
  ApiResponse,
  CreateInvoiceDto,
  InvoiceQuery,
  PaginatedResponse,
  ResponseOperation,
  Invoice,
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

  //   update: async (id: number, data: IndustrySegmentUpdateDto) => {
  //     const { data: responseData } = await concarApi.patch<
  //       ApiResponse<ResponseOperation>
  //     >(`/catalogs/segments/${id}`, data);
  //     return responseData.data;
  //   },
};
