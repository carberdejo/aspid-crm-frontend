'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { useDepartments } from '@/hooks/useDepartment';
import { Loader2 } from 'lucide-react';
import { cookieUtils } from '@/lib/cookies';
import { jwtDecode } from 'jwt-decode';
import { Payload } from '@/interfaces/api.interface';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user } = useAuthStore();
  const { setDepartments } = useDepartmentStore();
  const { departments, isLoading: isDepartmentsLoading, isError } = useDepartments();
  const [isChecking, setIsChecking] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  // Primer effect: Validar token y autenticación
  useEffect(() => {
    const validateAuth = () => {
      const cookieToken = cookieUtils.getToken();
      
      // Si no hay token ni en store ni en cookies, redirigir a login
      if (!token && !cookieToken) {
        cookieUtils.setReturnTo(pathname);
        router.push('/auth/login');
        setIsChecking(false);
        return;
      }

      // Si hay token en cookies pero no en Zustand, validar
      if (cookieToken && !token) {
        try {
          const decoded = jwtDecode<Payload>(cookieToken);
          const currentTime = Date.now() / 1000;

          // Verificar que el token no esté expirado
          if (decoded.exp && decoded.exp < currentTime) {
            cookieUtils.clearAuth();
            cookieUtils.setReturnTo(pathname);
            router.push('/auth/login');
            setIsChecking(false);
            return;
          }

          // Token válido pero no está en Zustand, redirigir a login
          // para que se rehidrate correctamente
          setIsTokenValid(true);
          setIsChecking(false);
          return;
        } catch (error) {
          // Token malformado
          cookieUtils.clearAuth();
          cookieUtils.setReturnTo(pathname);
          router.push('/auth/login');
          setIsChecking(false);
          return;
        }
      }

      // Hay token en Zustand, marcar como válido
      if (token && user) {
        setIsTokenValid(true);
      }

      setIsChecking(false);
    };

    validateAuth();
  }, [token, user, router, pathname]);

  // Segundo effect: Cargar departamentos cuando el usuario esté autenticado
  useEffect(() => {
    if (isTokenValid && !isDepartmentsLoading && user && !isError) {
      setDepartments(departments);
    }
  }, [isTokenValid, isDepartmentsLoading, user, isError, departments, setDepartments]);

  // Si estamos verificando o cargando datos, mostrar spinner
  if (isChecking || (isTokenValid && isDepartmentsLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#1a2a53]" />
          <p className="text-sm text-gray-600">
            {isChecking ? 'Verificando sesión...' : 'Cargando departamentos...'}
          </p>
        </div>
      </div>
    );
  }

  // Si el token no es válido, no renderizar nada (router.push ya redirigió)
  if (!isTokenValid) {
    return null;
  }

  // Token válido y datos cargados, renderizar children
  return <>{children}</>;
}