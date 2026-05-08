import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/services/client.service';

export const useRuc = (ruc: string) => {
  return useQuery({
    queryKey: ['ruc-search', ruc],
    queryFn: () => clientService.findByRuc(ruc),
    enabled: false, // 👈 Evita que se ejecute al cargar el componente
    retry: false,
    staleTime: Infinity, // El RUC de una empresa no cambia, lo guardamos en caché para siempre
  });
};