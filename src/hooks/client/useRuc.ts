import { useQuery, useQueryClient } from "@tanstack/react-query";
import { clientService } from "@/services/client.service";

export const useRuc = (ruc?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["ruc-search", ruc ?? ""],
    queryFn: () => clientService.findByRuc(ruc ?? ""),
    enabled: false, // No ejecutar automáticamente: usaremos fetchByRuc manual
    retry: false,
    staleTime: Infinity,
  });

  const fetchByRuc = async (searchRuc: string) => {
    if (!searchRuc) throw new Error("RUC vacío");
    return queryClient.fetchQuery({
      queryKey: ["ruc-search", searchRuc],
      queryFn: () => clientService.findByRuc(searchRuc),
    });
  };

  return { ...query, fetchByRuc };
};
