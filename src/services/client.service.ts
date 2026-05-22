import { concarApi } from "@/api/concarApi";
import { ImportResults } from "@/hooks/client/useImportClients";
import {
  ApiResponse,
  ClientAndContactResponseCreate,
  ClientCreateDto,
  ClientDetail,
  ClientFilters,
  ClientItem,
  ClientListItem,
  Contact,
  ContactCreateDto,
  PaginatedResponse,
  ResponseRuc,
  UserFilters,
} from "@/interfaces";
import { cleanParams } from "@/lib/utils";

// src/services/client.service.ts
export const clientService = {
  getClients: async (
    filters: ClientFilters = {},
  ): Promise<PaginatedResponse<ClientListItem>> => {
    // Limpiamos dinámicamente: si agregas 'sector' o 'ciudad' a ClientFilters,
    // cleanParams lo manejará automáticamente.
    const params = cleanParams(filters as Record<string, unknown>);
    // console.log("datos en service", params);
    const { data } = await concarApi.get<
      ApiResponse<PaginatedResponse<ClientListItem>>
    >("/clients", {
      params,
    });
    // console.log({ data: data.data });
    return data.data; // Retorna solo la data paginada, no el mensaje ni el código
  },

  getClientDetail: async (id: number): Promise<ClientDetail> => {
    const { data } = await concarApi.get<ApiResponse<ClientDetail>>(
      `/clients/${id}`,
    );
    return data.data;
  },

  getContactsByClient: async (codClient: number): Promise<Contact[]> => {
    const { data } = await concarApi.get<ApiResponse<Contact[]>>(
      `/clients/${codClient}/contacts`,
    );
    return data.data;
  },

  createClient: async (
    clientData: ClientCreateDto,
  ): Promise<ClientAndContactResponseCreate<ClientItem>> => {
    // console.log({userData})
    const { data } = await concarApi.post<
      ApiResponse<ClientAndContactResponseCreate<ClientItem>>
    >("/clients", clientData);
    return data.data; // Retornar solo el mensaje del servidor
  },

  findByRuc: async (ruc: string) => {
    const { data } = await concarApi.get<ApiResponse<ResponseRuc>>(
      `/clients/sunat/${ruc}`,
    );
    return data.data;
  },

  createContact: async (
    contactData: ContactCreateDto,
  ): Promise<ClientAndContactResponseCreate<Contact>> => {
    const { data } = await concarApi.post<
      ApiResponse<ClientAndContactResponseCreate<Contact>>
    >("/clients/contacts", contactData);
    console.log({ dataservice: data.data });
    return data.data;
  },

  importClientsFromExcel: async (file: File) => {
    const formData = new FormData(); // Creamos un FormData para enviar el archivo como multipart/form-data
    formData.append("file", file); // 'file' es el nombre que espera el FileInterceptor en NestJS
    const { data } = await concarApi.post<ApiResponse<ImportResults>>(
      "/clients/import-excel",
      formData, // Enviamos el archivo al backend
      {
        headers: {
          "Content-Type": "multipart/form-data", // Indicamos que es un archivo
        },
      },
    );
    return data.data;
  },

  exportClientsToExcel: async (filter: ClientFilters) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { limit, offset, ...exportFilters } = filter; // Desestructuramos para limpiar el objeto de filtros
    console.log({ exportFilters });
    const { data } = await concarApi.post<Blob>(
      "/clients/export-excel",
      exportFilters, // Enviamos solo los filtros relevantes para la exportación
      {
        responseType: "blob", // ¡CRÍTICO PARA ARCHIVOS!
      },
    );
    return data; // Retorna el Blob del archivo Excel
  },
};
