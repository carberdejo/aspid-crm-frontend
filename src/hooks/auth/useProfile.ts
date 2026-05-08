import { authService } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useProfile = (id: string) => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => authService.getProfile(id), // Debe retornar UserProfile
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
