import { UserRole } from "@/interfaces/role-user.interface";
import { useAuthStore } from "@/store";

/**
 * Indica si el usuario conectado puede editar o eliminar un registro (visita, cotización, entrega).
 *
 * Misma regla que el backend: solo el dueño del registro o un admin.
 * El colaborador de una cotización puede verla, pero no modificarla.
 */
export function useCanModify(ownerId?: number | string | null) {
  const user = useAuthStore((state) => state.user);
  if (!user) return false;
  if (user.role === UserRole.ADMIN) return true;
  return ownerId != null && String(ownerId) === String(user.sub);
}
