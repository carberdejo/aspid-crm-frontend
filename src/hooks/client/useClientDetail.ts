import { clientService } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useClientDetail = (id: number) => {
  const clientDetailQuery = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientService.getClientDetail(id), // Tu servicio que devuelve el JSON que pasaste
  });
  return clientDetailQuery;
};