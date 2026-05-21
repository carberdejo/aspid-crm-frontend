import { ApiErrorResponse } from "@/interfaces";
import { clientService } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Definimos la interfaz de la respuesta que armamos en NestJS
export interface ImportResults {
  message: string;
  stats: {
    totalRowsProcessed: number;
    successfullyInserted: number;
    successfullyUpdated: number;
    errorsCount: number;
  };
  details: {
    updatedRucs: string[];
    errors: { row: number; reason: string }[];
  };
}

export const useImportClients = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => clientService.importClientsFromExcel(file),
    onSuccess: () => {
      // Forzamos a la tabla de clientes a recargarse con la nueva data
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(error.message || "Error al importar el archivo");
    },
  });
};
