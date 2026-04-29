"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FolderKanban,
  LayoutDashboard,
  Settings2,
  Users,
  type LucideIcon,
} from "lucide-react";

import { adaptNavSectionsToSidebar } from "./sidebar-adapter";
import { generateNavSections } from "@/components/layout/NavItems";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { useAuthStore } from "@/store/useAuthStore";
import { useDepartmentStore } from "@/store/useDepartmentStore";
import { UserRole } from "@/interfaces";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";

function getSectionIcon(title: string): LucideIcon {
  switch (title) {
    case "PRINCIPAL":
      return LayoutDashboard;
    case "REPORTES":
      return BarChart3;
    case "MIS ÁREAS":
      return FolderKanban;
    case "CONFIGURACIÓN":
      return Settings2;
    default:
      return Users;
  }
}

function buildAvatarDataUri(name: string) {
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "AC";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
      <rect width="96" height="96" rx="20" fill="#1a2a53"/>
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="34" font-weight="700">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const departments = useDepartmentStore((state) => state.departments);

  const sections = useMemo(() => {
    if (!user) {
      return [];
    }

    return adaptNavSectionsToSidebar(
      generateNavSections(user.role, user.depts, departments),
      pathname,
    );
  }, [departments, pathname, user]);

  const roleLabel = user?.role === UserRole.ADMIN ? "Administrador" : "Usuario";
  const teams =
    departments.length > 0
      ? departments.map((department) => ({
          name: department.name,
          logo: <FolderKanban className="size-4" />,
          plan: roleLabel,
        }))
      : [
          {
            name: "ACME & CIA",
            logo: <FolderKanban className="size-4" />,
            plan: roleLabel,
          },
        ];

  const navMainItems = sections.map((section) => ({
    title: section.title,
    url: section.items[0]?.href ?? "#",
    icon: (() => {
      const Icon = getSectionIcon(section.title);

      return <Icon className="size-4" />;
    })(),
    isActive: section.items.some((item) => item.active),
    items: section.items.map((item) => ({
      title: item.title,
      url: item.href,
    })),
  }));

  return (
    <Sidebar
      collapsible="icon"
      style={
        {
          "--sidebar": "hsl(var(--primary))",
          "--sidebar-foreground": "hsl(var(--primary-foreground))",
          "--sidebar-primary": "hsl(var(--secondary))",
          "--sidebar-primary-foreground": "hsl(var(--secondary-foreground))",
          "--sidebar-accent": "rgba(255, 255, 255, 0.08)",
          "--sidebar-accent-foreground": "hsl(var(--primary-foreground))",
          "--sidebar-border": "rgba(255, 255, 255, 0.12)",
          "--sidebar-ring": "hsl(var(--accent))",
        } as React.CSSProperties
      }
    >
      <SidebarHeader className="border-b border-sidebar-border/70">
        <TeamSwitcher teams={teams} />
      </SidebarHeader>

      <SidebarContent>
        {user ? (
          <NavMain items={navMainItems} />
        ) : (
          <SidebarMenu>
            <div className="px-4 py-3 text-sm text-sidebar-foreground/70">
              Inicia sesión para cargar roles y departamentos reales.
            </div>
          </SidebarMenu>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/70">
        {user ? (
          <NavUser
            user={{
              name: user.email.split("@")[0].replaceAll(".", " "),
              email: user.email,
              avatar: buildAvatarDataUri(
                user.email.split("@")[0].replaceAll(".", " "),
              ),
            }}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-sidebar-border px-3 py-4 text-sm text-sidebar-foreground/70">
            Sin usuario autenticado.
          </div>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
