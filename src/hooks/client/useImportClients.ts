import { ApiErrorResponse, ClientFilters } from "@/interfaces";
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

export const useExportClients = () => {
  return useMutation({
    mutationFn: (filters: ClientFilters) =>
      clientService.exportClientsToExcel(filters),
    onSuccess: (blobData) => {
      // Magia del navegador para descargar el archivo silenciosamente
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Maestra_Clientes_ASPID.xlsx");

      document.body.appendChild(link);
      link.click();

      // Limpieza de memoria
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Excel generado y descargado correctamente");
    },
    onError: (error) => {
      console.error("Error exporting:", error);
      toast.error("Error al descargar el Excel. Intente nuevamente.");
    },
  });
};
