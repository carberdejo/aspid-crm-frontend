import { concarApi } from "@/api/concarApi";
import {
  AnnulDocumentDto,
  ApiResponse,
  PaginatedResponse,
  ResponseOperation,
  CreatePurchaseOrderDto,
  PurchaseOrder,
  PurchaseOrderFilters,
  UpdatePurchaseOrderDto,
} from "@/interfaces";

export const PurchaseOrderService = {
  findAll: async (
    filters: PurchaseOrderFilters,
  ): Promise<PaginatedResponse<PurchaseOrder>> => {
    const { data } = await concarApi.get<
      ApiResponse<PaginatedResponse<PurchaseOrder>>
    >("/orders", {
      params: filters,
    });
    return data.data; // { items, total, limit, offset }
  },

  findOne: async (id: number): Promise<PurchaseOrder> => {
    const { data } = await concarApi.get<ApiResponse<PurchaseOrder>>(
      `/orders/${id}`,
    );
    return data.data;
  },

  create: async (payload: CreatePurchaseOrderDto): Promise<string> => {
    const { data } = await concarApi.post<ApiResponse<ResponseOperation>>(
      "/orders",
      payload,
    );
    return data.message;
  },

  update: async (
    id: number,
    payload: UpdatePurchaseOrderDto,
  ): Promise<ResponseOperation> => {
    const { data } = await concarApi.patch<ApiResponse<ResponseOperation>>(
      `/orders/${id}`,
      payload,
    );
    return data.data;
  },

  // Solo sin facturas vigentes; la cotización vuelve a PENDIENTE
  annul: async (
    id: number,
    payload: AnnulDocumentDto,
  ): Promise<ResponseOperation> => {
    const { data } = await concarApi.patch<ApiResponse<ResponseOperation>>(
      `/orders/${id}/annul`,
      payload,
    );
    return data.data;
  },
};
