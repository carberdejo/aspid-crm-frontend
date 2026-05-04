import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Función para limpiar parámetros de consulta (eliminar undefined, null o string vacío)
export const cleanParams = (
  params: Record<string, unknown>,
): Record<string, unknown> => {
  return Object.entries(params).reduce(
    (acc, [key, value]) => {
      // Validamos: no undefined, no null, no string vacío
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, unknown>,
  );
};

//------ Función para obtener rangos de fechas predefinidos (ejemplo para filtros)
export type DateFilterType =
  | "this-week"
  | "last-week"
  | "this-month"
  | "last-month";

export const getDateRange = (type: DateFilterType) => {
  const now = new Date();
  let start = new Date();
  let end = new Date();

  switch (type) {
    case "this-week":
      // Domingo a Domingo
      start.setDate(now.getDate() - now.getDay());
      end.setDate(start.getDate() + 6);
      break;
    case "last-week":
      start.setDate(now.getDate() - now.getDay() - 7);
      end.setDate(start.getDate() + 6);
      break;
    case "this-month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case "last-month":
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
  }

  // Formatear a YYYY-MM-DD para la API
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
};
