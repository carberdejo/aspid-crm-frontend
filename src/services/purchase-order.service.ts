import { concarApi } from "@/api/concarApi";
import {
  ApiResponse,
  PaginatedResponse,
  ResponseOperation,
} from "@/interfaces/api.interface";
import {
  CreatePurchaseOrderDto,
  PurchaseOrder,
  PurchaseOrderFilters,
} from "@/interfaces/purchase-order.interface";

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
};
