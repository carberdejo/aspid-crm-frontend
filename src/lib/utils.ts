import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// src/lib/utils.ts (O donde guardes tus utilitarios)
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
