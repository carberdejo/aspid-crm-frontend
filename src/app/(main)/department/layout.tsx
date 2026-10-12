"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store";

// true solo en el navegador: en el servidor no existe la sesión (vive en localStorage)
const subscribeNoop = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

/**
 * Protege /department/[id]/*: solo se puede entrar a las áreas asignadas al usuario
 * (también el admin, igual que en el sidebar). El backend aplica la misma regla;
 * esto evita mostrar una pantalla que solo devolvería errores.
 */
export default function DepartmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const isClient = useIsClient();
  const user = useAuthStore((state) => state.user);

  const departmentId = Number(params?.id);
  const userDepartments = (user?.depts ?? []).map(Number);
  const hasAccess = userDepartments.includes(departmentId);
  const fallbackDepartment = userDepartments[0];

  useEffect(() => {
    if (!isClient || !user || hasAccess || !fallbackDepartment) return;

    toast.error("Acceso denegado", {
      description: "No perteneces a esta área. Te llevamos a una de tus áreas.",
    });
    router.replace(`/department/${fallbackDepartment}`);
  }, [isClient, user, hasAccess, fallbackDepartment, router]);

  if (isClient && user && userDepartments.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center">
        <ShieldAlert className="h-10 w-10 text-[#ea6839]" />
        <p className="font-semibold text-[#1a2a53]">
          No tienes áreas asignadas
        </p>
        <p className="text-sm text-gray-500">
          Pide a un administrador que te asigne al menos un área.
        </p>
      </div>
    );
  }

  if (!isClient || !hasAccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a2a53]" />
      </div>
    );
  }

  return <>{children}</>;
}
