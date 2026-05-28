import { concarApi } from "@/api/concarApi";
import {
  ApiResponse,
  Delivery,
  DeliveryCreateDto,
  PaginatedResponse,
  ResponseOperation,
} from "@/interfaces";
import { cleanParams } from "@/lib/utils";

export const deliveryService = {
  getDeliverys: async () // filters: ClientFilters = {},
  : Promise<PaginatedResponse<Delivery>> => {
    // Limpiamos dinámicamente: si agregas 'sector' o 'ciudad' a ClientFilters,
    // cleanParams lo manejará automáticamente.
    // const params = cleanParams(filters as Record<string, unknown>);
    const { data } = await concarApi.get<
      ApiResponse<PaginatedResponse<Delivery>>
    >("/deliverys", {
      //   params,
    });
    return data.data;
  },

  //   getClientDetail: async (id: number): Promise<ClientDetail> => {
  //     const { data } = await concarApi.get<ApiResponse<ClientDetail>>(
  //       `/clients/${id}`,
  //     );
  //     return data.data;
  //   },

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
