import { UserRole } from "@/interfaces/role-user.interface";
import { useAuthStore } from "@/store";
import { useDepartmentMembers } from "@/hooks/department/useDepartment";

/**
 * Datos para elegir el responsable (dueño) de un registro nuevo: visita, cotización o entrega.
 *
 * - Admin: puede registrar a nombre de un usuario activo del área (por defecto, él mismo).
 * - Empleado: siempre a su nombre; el backend ignora cualquier otro userId.
 *
 * Los miembros del área se cargan siempre: también sirven para elegir el colaborador.
 */
export function useRecordOwner(departmentId: number) {
  const user = useAuthStore((state) => state.user);
  const { members, isLoading } = useDepartmentMembers(departmentId);

  return {
    isAdmin: user?.role === UserRole.ADMIN,
    currentUserId: user ? String(user.sub) : "",
    members,
    isLoadingMembers: isLoading,
  };
}
