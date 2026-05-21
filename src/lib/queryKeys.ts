import type { ClientFilters } from "@/interfaces/client.interface";
import type { VisitFilter } from "@/interfaces/visit.interface";
import type { QuoteFilters } from "@/services/quote.service";

/**
 * Query Keys Factory
 *
 * Centraliza todas las query keys de la aplicación para garantizar:
 * 1. Consistencia en toda la app
 * 2. Fácil mantenimiento
 * 3. Evita mismatches entre setQueryData y useQuery
 *
 * Uso:
 * - En hooks: queryKey: clientQueryKeys.list(filters)
 * - En setQueryData: clientQueryKeys.list({ term: "", limit: 10 })
 */

/**
 * Query Keys para Clientes
 * Normaliza SIEMPRE con propiedades: term (no "name"), limit, offset
 */
export const clientQueryKeys = {
  all: ["clients"] as const,

  /**
   * Lista de clientes con filtros normalizados
   * @param filters Objeto con término de búsqueda y límite
   */
  list: (filters: Partial<ClientFilters> = {}) =>
    [
      "clients",
      {
        term: filters.term || "",
        limit: filters.limit || 10,
        offset: filters.offset || 0,
        // Agregar más filtros aquí si es necesario (ej: sector, ciudad, etc)
      },
    ] as const,

  /**
   * Búsqueda rápida de cliente por término
   * @param term Término de búsqueda
   * @param limit Límite de resultados
   */
  search: (term: string, limit = 10) =>
    ["clients", { term: term || "", limit }] as const,

  /**
   * Detalle individual de cliente
   * @param id ID del cliente
   */
  detail: (id: number) => ["client", id] as const,
} as const;

/**
 * Query Keys para Contactos
 */
export const contactQueryKeys = {
  all: ["contacts"] as const,

  /**
   * Contactos de un cliente específico
   * @param clientId ID del cliente
   */
  byClient: (clientId: number) => ["contacts-client", clientId] as const,

  /**
   * Detalle individual de contacto
   * @param id ID del contacto
   */
  detail: (id: number) => ["contact", id] as const,
} as const;

/**
 * Query Keys para Visitas
 */
export const visitQueryKeys = {
  all: ["visits"] as const,

  /**
   * Lista de visitas con filtros
   * @param filters Objeto con filtros
   */
  list: (filters: VisitFilter = {}) => ["visits", filters] as const,

  /**
   * Detalle individual de visita
   * @param id ID de la visita
   */
  detail: (id: number) => ["visit", id] as const,
} as const;

/**
 * Query Keys para Cotizaciones
 */
export const quoteQueryKeys = {
  all: ["quotes"] as const,

  /**
   * Lista de cotizaciones con filtros
   * @param filters Objeto con filtros
   */
  list: (filters: QuoteFilters = {}) => ["quotes", filters] as const,

  /**
   * Detalle individual de cotización
   * @param id ID de la cotización
   */
  detail: (id: number) => ["quote", id] as const,
} as const;
