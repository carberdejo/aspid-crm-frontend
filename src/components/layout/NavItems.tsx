import {
  LayoutDashboard,
  FolderKanban,
  Users,
  BarChart3,
  Briefcase, // Sugerencia de icono para Directorio/Clientes
  Settings, // Sugerencia de icono para Administración
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
  deptId?: number;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// ==================== SECCIONES COMUNES (TODOS LOS ROLES) ====================

const getPrincipalSection = (): NavSection => ({
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

// Elevamos "Clientes" a su propia sección comercial, visible para todos.
const getDirectorioSection = (): NavSection => ({
  title: "DIRECTORIO",
  items: [
    { title: "Clientes", href: "/client", icon: Briefcase, active: false },
  ],
});

// Unificamos la lógica de "Mis Áreas". Aplica igual para Admin y Users.
const getOperacionesSection = (
  userDeptIds: number[],
  departments: Department[],
): NavSection | null => {
  const items: NavItem[] = userDeptIds
    .map((deptId) => departments.find((d) => d.id === deptId))
    .filter(
      (dept) =>
        dept && dept.isActive && normalize(dept.name) !== "administracion",
    )
    .map((dept) => ({
      title: dept!.name,
      href: `/department/${dept!.id}`,
      icon: FolderKanban,
      active: false,
      deptId: dept!.id,
    }));

  return items.length > 0 ? { title: "MIS ÁREAS", items } : null;
};

// ==================== SECCIONES EXCLUSIVAS (SOLO ADMIN) ====================

const getAnaliticaSection = (departments: Department[]): NavSection | null => {
  const items: NavItem[] = departments
    .filter(
      (dept) => dept.isActive && normalize(dept.name) !== "administracion",
    )
    .map((dept) => {
      // Creamos un ID HTML seguro: sin acentos, minúsculas y espacios por guiones
      const sectionId = normalize(dept.name).replace(/\s+/g, "-");

      return {
        title: `Reportes ${dept.name}`,
        // Ajusta "/analytics" o "/dashboard/analytics" según donde vayas a crear tu page.tsx
        href: `/analytics#${sectionId}`,
        icon: BarChart3,
        active: false,
        deptId: dept.id,
      };
    });

  return items.length > 0 ? { title: "ANALÍTICA", items } : null;
};

const getAdministracionSection = (): NavSection => ({
  title: "ADMINISTRACIÓN",
  items: [
    { title: "Usuarios", href: "/user", icon: Users, active: false },
    {
      title: "Datos Maestros",
      href: "/admin/master-data",
      icon: Settings,
      active: false,
    },
  ],
});

// ==================== GENERADOR DINÁMICO ====================

export const generateNavSections = (
  userRole: UserRole,
  userDeptIds: number[],
  departments: Department[],
): NavSection[] => {
  const sections: NavSection[] = [];

  // 1. Agregamos las secciones que TODO el mundo debe ver
  sections.push(getPrincipalSection());
  sections.push(getDirectorioSection());

  // 2. Agregamos las áreas de trabajo (Depende de qué departamentos tenga asignados)
  const operacionesSection = getOperacionesSection(userDeptIds, departments);
  if (operacionesSection) {
    sections.push(operacionesSection);
  }

  // 3. Agregamos las secciones bloqueadas (Solo para el Admin)
  if (userRole === UserRole.ADMIN) {
    const analiticaSection = getAnaliticaSection(departments);
    if (analiticaSection) {
      sections.push(analiticaSection);
    }

    sections.push(getAdministracionSection());
  }

  return sections;
};
