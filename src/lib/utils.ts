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
  const year = now.getFullYear();
  const month = now.getMonth();
  // new Date(año, mes, día) normaliza desbordes: el día 0 o el 33 cruzan de mes correctamente
  const sunday = now.getDate() - now.getDay();

  let start: Date;
  let end: Date;

  switch (type) {
    case "this-week":
      // Domingo a sábado
      start = new Date(year, month, sunday);
      end = new Date(year, month, sunday + 6);
      break;
    case "last-week":
      start = new Date(year, month, sunday - 7);
      end = new Date(year, month, sunday - 1);
      break;
    case "this-month":
      start = new Date(year, month, 1);
      end = new Date(year, month + 1, 0);
      break;
    case "last-month":
      start = new Date(year, month - 1, 1);
      end = new Date(year, month, 0);
      break;
  }

  // YYYY-MM-DD en hora local (toISOString usa UTC y adelanta un día por la noche)
  return {
    startDate: toLocalDateString(start),
    endDate: toLocalDateString(end),
  };
};

const toLocalDateString = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
