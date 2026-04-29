import type { LucideIcon } from "lucide-react";

import type { NavSection } from "@/components/layout/NavItems";

export interface DashboardSidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
}

export interface DashboardSidebarSection {
  title: string;
  items: DashboardSidebarItem[];
}

export function adaptNavSectionsToSidebar(
  sections: NavSection[],
  pathname: string,
): DashboardSidebarSection[] {
  return sections.map((section) => ({
    title: section.title,
    items: section.items.map((item) => ({
      title: item.title,
      href: item.href,
      icon: item.icon,
      active:
        (item.active ?? pathname === item.href) ||
        pathname.startsWith(`${item.href}/`),
    })),
  }));
}
