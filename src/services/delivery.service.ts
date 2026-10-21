import { aspidApi } from "@/api/aspidApi";
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
    const { data } = await aspidApi.get<
      ApiResponse<PaginatedResponse<Delivery>>
    >("/deliverys", { params });
    return data.data;
  },

  createDelivery: async (
    clientData: DeliveryCreateDto,
  ): Promise<ResponseOperation> => {
    const { data } = await aspidApi.post<ApiResponse<ResponseOperation>>(
      "/deliverys",
      clientData,
    );
    return data.data;
  },

  updateDelivery: async (
    id: number,
    update: Partial<DeliveryCreateDto>,
  ): Promise<ResponseOperation> => {
    const { data } = await aspidApi.patch<ApiResponse<ResponseOperation>>(
      `/deliverys/${id}`,
      update,
    );
    return data.data;
  },

  // Eliminado lógico en el backend: la entrega deja de aparecer en los listados
  removeDelivery: async (id: number): Promise<ResponseOperation> => {
    const { data } = await aspidApi.delete<ApiResponse<ResponseOperation>>(
      `/deliverys/${id}`,
    );
    return data.data;
  },
};
