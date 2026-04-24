'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();

  useEffect(() => {
    // Esperar a que Zustand se hidrate con el token
    if (!token || !user) {
      // Si no hay token/usuario después de hidratación, el middleware/AuthGuard ya debería
      // haber redirigido a login. Esto es un fallback por seguridad.
      return;
    }

    // Token y usuario presentes, redirigir según el rol
    if (user.role === 'admin') {
      router.push('/dashboard');
    } else if (user.depts && user.depts.length > 0) {
      router.push(`/department/${user.depts[0]}`);
    } else {
      // Usuario sin departamentos asignados (caso de error)
      router.push('/auth/login');
    }
  }, [user, token, router]);

  // Mostrar loading mientras se valida la autenticación
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a2a53]" />
        <p className="text-sm text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  );
}