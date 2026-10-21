import { UserRole } from "@/interfaces/role-user.interface";
import { useAuthStore } from "@/store";

/**
 * Filtro de dueño para los listados de las páginas de área.
 *
 * - Empleado: no se envía userId. El backend ya limita la lista a sus registros
 *   en sus áreas, y así aparecen también las cotizaciones (y sus OC/facturas)
 *   donde participa como colaborador.
 * - Admin: se envía su propio id para que la página del área muestre lo suyo
 *   (sin filtro, el backend le devolvería todo lo del área).
 */
export function useOwnerFilter() {
  const user = useAuthStore((state) => state.user);

  return {
    ownerId:
      user?.role === UserRole.ADMIN ? Number(user.sub) : undefined,
    // Las consultas esperan a que haya sesión (antes dependían de userId)
    isReady: !!user,
  };
}
