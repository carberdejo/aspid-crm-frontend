import { toast } from "sonner";
import { ApiErrorResponse } from "@/interfaces";

export const handleApiError = (
  error: any | ApiErrorResponse,
  defaultMessage = "Error inesperado",
) => {
  // 1. Errores de red o de servidor caído (Postgres apagado, etc.)
  if (error.message === "Network Error" || !error.response) {
    toast.error("Error de conexión", {
      description: "No se pudo contactar al servidor.",
    });
    return;
  }

  // 2. Extraemos la respuesta estandarizada de tu ExceptionFilter de NestJS
  const apiError = error.response.data as ApiErrorResponse;

  // Asumiendo que tu filtro envía los errores detallados en 'errors' o el general en 'message'
  const backendMessage = apiError.errors || apiError.message;

  if (Array.isArray(backendMessage)) {
    toast.error("Error de validación", {
      description: backendMessage.join(", "), // Une: "RUC inválido, Faltan datos"
      duration: 5000,
    });
    return;
  }

  if (typeof backendMessage === "string") {
    // Errores de negocio (Ej: 400 Bad Request o 404 Not Found)
    toast.error("Atención", {
      description: backendMessage,
    });
    return;
  }

  // Fallback por si la estructura cambia
  toast.error("Error", {
    description: defaultMessage,
  });
};
