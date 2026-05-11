import {
  LayoutDashboard,
  FolderKanban,
  Users,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { Department } from "@/interfaces";
import { UserRole } from "@/interfaces/role-user.interface";

// Normaliza nombres para comparar sin acentos ni mayúsculas
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
  deptId?: number; // ID del departamento para items dinámicos
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// ==================== SECCIONES PARA ADMIN ====================

// Sección PRINCIPAL - Solo para ADMIN
const getAdminPrincipalSection = (): NavSection => ({
  title: "PRINCIPAL",
  items: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: false,
    },
    // {
    //   title: "Facturaciones",
    //   href: "/invoice",
    //   icon: FileText,
    //   active: false,
    // },
    {
      title: "Usuarios",
      href: "/user",
      icon: Users,
      active: false,
    },
  ],
});

// Sección REPORTES - Todas las áreas/departamentos disponibles en el sistema (Solo ADMIN)
const getReportesSection = (
  deptIds: number[],
  allDepartments: Department[],
  title: string = "REPORTES DE ÁREA",
): NavSection | null => {
  const reportItems: NavItem[] = deptIds
    .map((id) => allDepartments.find((d) => d.id === id))
    .filter(
      (dept) =>
        dept && dept.isActive && normalize(dept.name) !== "administracion",
    )
    .map((dept) => ({
      title: `Reportes ${dept!.name}`,
      href: `/department/${dept!.id}/reports`, // Ruta sugerida
      icon: BarChart3,
      active: false,
      deptId: dept!.id,
    }));

  if (reportItems.length === 0) return null;

  return {
    title,
    items: reportItems,
  };
};

// Sección DEPARTAMENTOS - Aparece solo si el ADMIN tiene un departamento distinto a "Administración"
const getDepartamentosSection = (
  userDeptIds: number[],
  departments: Department[],
): NavSection | null => {
  // Filtrar el departamento "Administración" (asumimos que tiene un nombre específico o ID específico)
  const adminDept = departments.find(
    (d) => normalize(d.name) === "administracion",
  );

  // Si el usuario tiene solo el departamento de Administración, no mostrar sección
  if (
    userDeptIds.length === 1 &&
    adminDept &&
    userDeptIds[0] === adminDept.id
  ) {
    return null;
  }

  // Filtrar departamentos que NO sean Administración
  const departmentItems: NavItem[] = userDeptIds
    .map((deptId) => departments.find((d) => d.id === deptId))
    .filter((dept) => dept && normalize(dept.name) !== "administracion")
    .map((dept) => ({
      title: dept!.name,
      href: `/department/${dept!.id}`,
      icon: FolderKanban,
      active: false,
      deptId: dept!.id,
    }));

  if (departmentItems.length === 0) {
    return null;
  }

  return {
    title: "MIS ÁREAS",
    items: departmentItems,
  };
};

// Sección compartida CONFIGURACIÓN - Clientes y Ajustes (Compartida con ADMIN y USERS)
const getSharedConfigSection = (): NavSection => ({
  title: "OTROS",
  items: [
    {
      title: "Clientes",
      href: "/client",
      icon: Users,
      active: false,
    },
    // {
    //   title: "Ajustes",
    //   href: "/settings",
    //   icon: Settings,
    //   active: false,
    // },
  ],
});

// ==================== SECCIONES PARA USERS/PERSONAL ====================

// Sección PRINCIPAL - Para USERS (sin Usuarios ni Facturaciones)
const getUserPrincipalSection = (): NavSection => ({
  title: "PRINCIPAL",
  items: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: false,
    },
  ],
});

// Sección DEPARTAMENTOS - Para USERS (solo sus departamentos asignados)
const getUserDepartamentosSection = (
  userDeptIds: number[],
  departments: Department[],
): NavSection | null => {
  const items: NavItem[] = userDeptIds
    .map((deptId) => departments.find((d) => d.id === deptId))
    .filter((dept) => dept && normalize(dept.name) !== "administracion")
    .map((dept) => ({
      title: dept!.name,
      href: `/department/${dept!.id}`,
      icon: FolderKanban,
      active: false,
      deptId: dept!.id,
    }));

  if (items.length === 0) {
    return null;
  }

  return {
    title: "MIS ÁREAS",
    items,
  };
};

// ==================== FUNCIÓN PRINCIPAL DE GENERACIÓN ====================

/**
 * Genera las secciones de navegación según el rol del usuario
 *
 * ADMIN:
 *   - PRINCIPAL: Dashboard, Facturaciones, Usuarios
 *   - REPORTES: Todos los departamentos disponibles en el sistema
 *   - DEPARTAMENTOS: Solo si tiene un depto distinto a "Administración"
 *   - CONFIGURACIÓN: Clientes, Ajustes
 *
 * USER:
 *   - PRINCIPAL: Dashboard
 *   - MIS ÁREAS: Sus departamentos asignados
 *   - CONFIGURACIÓN: Clientes, Ajustes
 */
export const generateNavSections = (
  userRole: UserRole,
  userDeptIds: number[],
  departments: Department[],
): NavSection[] => {
  const sections: NavSection[] = [];

  if (userRole === UserRole.ADMIN) {
    // ADMIN NAVIGATION
    sections.push(getAdminPrincipalSection());

    const allDeptIds = departments.map((d) => d.id);
    // Agregar REPORTES (todos los departamentos del sistema)
    const reportesSection = getReportesSection(
      allDeptIds,
      departments,
      "REPORTES GENERALES",
    );
    if (reportesSection) {
      sections.push(reportesSection);
    }

    // Agregar DEPARTAMENTOS solo si tiene uno distinto a Administración
    const deptosSection = getDepartamentosSection(userDeptIds, departments);
    if (deptosSection) {
      sections.push(deptosSection);
    }

    // Agregar sección compartida CONFIGURACIÓN
    sections.push(getSharedConfigSection());
  } else {
    // USER/PERSONAL NAVIGATION
    // sections.push(getUserPrincipalSection());

    // Agregar MIS ÁREAS (sus departamentos asignados)
    const userDeptosSection = getUserDepartamentosSection(
      userDeptIds,
      departments,
    );
    if (userDeptosSection) {
      sections.push(userDeptosSection);
    }

    // Agregar sección compartida CONFIGURACIÓN
    sections.push(getSharedConfigSection());
  }

  return sections;
};
