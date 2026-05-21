import axios from "axios";
import { toast } from "sonner";

export const exportClientsToExcel = async (term?: string) => {
  const toastId = toast.loading("Generando Excel...");

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/clients/export-excel`,
      {
        params: { term: term || undefined }, // Pasamos el filtro
        responseType: "blob", // ¡CRÍTICO PARA ARCHIVOS!
      },
    );

    // Truco de JS para descargar el archivo silenciosamente
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Maestra_Clientes_ACME.xlsx");

    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    toast.success("Excel descargado correctamente", { id: toastId });
  } catch (error) {
    toast.error("Error al descargar el Excel", { id: toastId });
  }
};
