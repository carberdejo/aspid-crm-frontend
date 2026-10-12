import { concarApi } from "@/api/concarApi";
import {
  ApiResponse,
  Delivery,
  DeliveryCreateDto,
  PaginatedResponse,
  PurchaseOrderFilters,
  ResponseOperation,
} from "@/interfaces";
import { cleanParams } from "@/lib/utils";

export const deliveryService = {
  // Usa los mismos filtros que la tabla de OC (área, página, orden, fechas, búsqueda)
  getDeliverys: async (
    filters: Partial<PurchaseOrderFilters> = {},
  ): Promise<PaginatedResponse<Delivery>> => {
    const params = cleanParams(filters as Record<string, unknown>);
    const { data } = await concarApi.get<
      ApiResponse<PaginatedResponse<Delivery>>
    >("/deliverys", { params });
    return data.data;
  },

  createDelivery: async (
    clientData: DeliveryCreateDto,
  ): Promise<ResponseOperation> => {
    const { data } = await concarApi.post<ApiResponse<ResponseOperation>>(
      "/deliverys",
      clientData,
    );
    return data.data;
  },
};
