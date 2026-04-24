import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import { ApiErrorResponse, LoginDto, Payload } from '@/interfaces/api.interface';
import { UserRole } from '@/interfaces';
import { jwtDecode } from 'jwt-decode';
import { cookieUtils } from '@/lib/cookies';
import { toast } from 'sonner';

export const useAuth = () => {
  const router = useRouter();
  const loginStore = useAuthStore((state) => state.login);
  const logoutStore = useAuthStore((state) => state.logout);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginDto) => authService.login(credentials),
    onSuccess: (res) => {
      console.log("DATA LLEGANDO:", res); // Mira esto en la consola
      // Ajustado a tu contrato: { data: { accessToken, refreshToken } }
      const { accessToken, refreshToken } = res;
      
      if (!accessToken || !refreshToken) {
        console.error("No se recibieron los tokens correctamente", res);
        return;
      }

      loginStore(accessToken, refreshToken);

      //TODO: Optimizar esta parte para no decodificar dos veces el token (aquí y en el store)
      const decodedPayload = jwtDecode<Payload>(accessToken);
      const returnTo = cookieUtils.getReturnTo();

      console.log("Login exitoso, payload:", decodedPayload);

      if (returnTo && returnTo !== '/') {
        cookieUtils.removeReturnTo();
        router.push(returnTo);
        return;
      }

      // Redirección Inteligente
      if (decodedPayload.role === UserRole.ADMIN) {
        router.push('/dashboard');
      } else {
        // Usamos el ID del primer departamento asignado
        const firstDeptId = decodedPayload.depts?.[0] || 0;
        router.push(`/department/${firstDeptId}`);
      }

      toast.success('Sesión iniciada', {
        description: `Bienvenido al sistema, ${decodedPayload.email || 'Usuario'}`
      });
    },
    onError: (error: ApiErrorResponse) => {
      const message = error.message || 'Credenciales inválidas';
      toast.error('Error de acceso', { description: message });
    }
  });

  const logout = () => {
    logoutStore(); // Limpia Zustand y Cookies
    router.push('/auth/login');
    toast.info('Sesión cerrada correctamente');
  };

  return {
    login: loginMutation.mutate,
    logout,
    isLoading: loginMutation.isPending,
    isError: loginMutation.isError,
    error: loginMutation.error
  };
};