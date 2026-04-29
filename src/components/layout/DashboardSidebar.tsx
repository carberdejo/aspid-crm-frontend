"use client";

import Image from "next/image";
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import logoAcme from "@/assets/logo_icono_orange.png";

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

  const formatLabel = (value: string) =>
    value
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const displaySections = sections.map((section) => ({
    originalTitle: section.title,
    ...section,
    title: formatLabel(section.title),
    items: section.items.map((item) => ({
      ...item,
      title: formatLabel(item.title),
    })),
  }));

  const navMainItems = displaySections.map((section) => ({
    title: section.title,
    url: section.items[0]?.href ?? "#",
    icon: (() => {
      const Icon = getSectionIcon(section.originalTitle);

      return <Icon className="size-4 text-white/72" />;
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
      className="border-r border-primary-dark bg-primary text-primary-foreground"
      style={
        {
          "--sidebar": "222 52% 21%",
          "--sidebar-foreground": "210 40% 98%",
          "--sidebar-primary": "40 95% 53%",
          "--sidebar-primary-foreground": "222 52% 21%",
          "--sidebar-accent": "222 52% 27%",
          "--sidebar-accent-foreground": "210 40% 98%",
          "--sidebar-border": "222 52% 26%",
          "--sidebar-ring": "16 82% 57%",
        } as React.CSSProperties
      }
    >
      <SidebarHeader className="border-b border-white/8 px-4 py-4">
        <TeamSwitcher
          teams={[
            {
              name: "ACME & CIA",
              logo: (
                <Image
                  src={logoAcme}
                  alt="ACME & CIA"
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
              ),
              plan: "Dashboard",
            },
          ]}
        />
      </SidebarHeader>

      <SidebarContent>
        {user ? (
          <NavMain items={navMainItems} />
        ) : (
          <SidebarMenu>
            <div className="px-4 py-3 text-sm text-white/66">
              Inicia sesión para cargar roles y departamentos reales.
            </div>
          </SidebarMenu>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-white/8 px-2 py-3">
        {user ? (
          <NavUser
            user={{
              name: formatLabel(user.email.split("@")[0].replaceAll(".", " ")),
              email: user.email,
              avatar: buildAvatarDataUri(
                formatLabel(user.email.split("@")[0].replaceAll(".", " ")),
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
