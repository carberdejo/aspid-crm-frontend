import { 
  LayoutDashboard,
  FolderKanban,
  FileText,
  Settings,
  Users,
  type LucideIcon
} from 'lucide-react';
import { Department } from '@/interfaces';
import { UserRole } from '@/interfaces/role-user.interface';

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

// Secciones fijas PRINCIPAL - disponibles para todos
const getPrincipalSection = (): NavSection => ({
  title: 'PRINCIPAL',
  items: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: false,
    },
    {
      title: 'Facturaciones',
      href: '/facturaciones',
      icon: FileText,
      active: false,
    },
    {
      title: 'Usuarios',
      href: '/user',
      icon: Users,
      active: false,
    }
  ],
});

// Secciones fijas ANALYTICS & REPORTS - solo para ADMIN
const getAnalyticsSection = (): NavSection => ({
  title: 'ANALYTICS & REPORTS',
  items: [
    {
      title: 'Clientes',
      href: '/client',
      icon: Users,
      active: false,
    },
    {
      title: 'Ajustes',
      href: '/ajustes',
      icon: Settings,
      active: false,
    },
  ],
});

// Sección MONITORING dinámica basada en departamentos del usuario
const getMonitoringSection = (userDeptIds: number[], departments: Department[]): NavSection => {
  const items: NavItem[] = [];

  // Agregar items solo para los departamentos del usuario
  userDeptIds.forEach((deptId) => {
    const dept = departments.find((d) => d.id === deptId);
    if (dept) {
      items.push({
        title: dept.name,
        href: `/department/${deptId}`,
        icon: FolderKanban,
        active: false,
        deptId: deptId,
      });
    }
  });

  return {
    title: 'MIS ÁREAS',
    items,
  };
};

// Generar navSections dinámicamente según rol y departamentos del usuario
export const generateNavSections = (
  userRole: UserRole,
  userDeptIds: number[],
  departments: Department[]
): NavSection[] => {
  const sections: NavSection[] = [];

  // PRINCIPAL siempre está disponible
  sections.push(getPrincipalSection());

  // MIS ÁREAS - para usuarios con departamentos asignados
  if (userDeptIds.length > 0) {
    sections.push(getMonitoringSection(userDeptIds, departments));
  }

  // ANALYTICS & REPORTS - solo para ADMIN
  if (userRole === UserRole.ADMIN) {
    sections.push(getAnalyticsSection());
  }

  return sections;
};

// Fallback para mantener compatibilidad
export const navSections: NavSection[] = [
  getPrincipalSection(),
  {
    title: 'MIS ÁREAS',
    items: [],
  },
  getAnalyticsSection(),
];
