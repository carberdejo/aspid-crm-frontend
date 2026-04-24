import { authService } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useTerminateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.terminateSession,
    onMutate: (variables) => {
      console.log("🚀 onMutate disparado con:", variables);
      // Es buena práctica retornar algo o null
      return null; 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success("Sesión finalizada");
    },
    onError: (error) => {
      console.error("❌ Error en mutación:", error);
    }
  });
};

export const useTerminateAllSessions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.terminateAllSessions,
    onMutate(data){
      console.log({"data entrante en el hook ALL": data});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success("Se han cerrado todas las demás sesiones");
    },
    onError: (error) => {
      console.error("❌ Error en mutación:", error);
    }
  });
};



// export const useLogout = () => {
//     const queryClient = useQueryClient();

//   const useTerminateSessionQuery = useMutation({
//     mutationFn: authService.terminateSession,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['profile'] });
//       toast.success("Sesión finalizada");
//     }
//   });

//   const useTerminateAllSessionsQuery = useMutation({
//     mutationFn: authService.terminateAllSessions,
//     onMutate(data){
//       console.log({"data entrante": data});
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['profile'] });
//       toast.success("Se han cerrado todas las demás sesiones");
//     }
//   });

//   return {
//     logout: useTerminateSessionQuery.mutate,
//     isLoggingOut: useTerminateSessionQuery.isPending,
//     terminateAllSessions: useTerminateAllSessionsQuery.mutate,
//     isTerminatingAllSessions: useTerminateAllSessionsQuery.isPending
//   };

// }
