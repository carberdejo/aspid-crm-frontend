"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/simple-separator";
import { useSidebarStore } from "@/store/useSidebarStore";
import { generateNavSections } from "./NavItems";
import { useAuthStore } from "@/store/useAuthStore";
import { useDepartmentStore } from "@/store/useDepartmentStore";
import { useDepartments } from "@/hooks/useDepartment";

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  const { user } = useAuthStore();
  const { departments, isLoading } = useDepartmentStore();
  const { setDepartments } = useDepartmentStore();

  // ✅ Cargar departamentos desde la API y poblar el store
  const { departments: fetchedDepartments } = useDepartments();

  // ✅ Sincronizar departamentos fetched con el store
  useEffect(() => {
    if (fetchedDepartments && fetchedDepartments.length > 0) {
      setDepartments(fetchedDepartments);
    }
  }, [fetchedDepartments, setDepartments]);

  // Estado para secciones expandidas con persistencia de sesión
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    if (typeof window === "undefined") {
      return new Set();
    }

    const savedSections = sessionStorage.getItem("expandedSections");

    return savedSections ? new Set(JSON.parse(savedSections)) : new Set();
  });

  // Función para alternar secciones expandidas
  const toggleSection = (title: string) => {
    const updated = new Set(expandedSections);
    if (updated.has(title)) {
      updated.delete(title);
    } else {
      updated.add(title);
    }
    setExpandedSections(updated);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("expandedSections", JSON.stringify([...updated]));
    }
  };

  // Generar navSections dinámicamente
  const navSections =
    user && !isLoading
      ? generateNavSections(user.role, user.depts, departments)
      : [];

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen transition-all duration-300 border-r",
        isCollapsed ? "w-20" : "w-64",
        "bg-primary text-white border-primary-light",
      )}
    >
      {/* Logo Area */}
      <div className="flex items-center justify-center h-20 border-b border-white/10 px-4 overflow-hidden">
        {!isCollapsed ? (
          <div className="relative flex h-10 w-full items-center justify-center">
            <Image
              src="/logo-acme.png"
              alt="ACME & CIA Logo"
              width={180}
              height={40}
              className="h-full w-auto object-contain"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-white/10 p-1">
            <Image
              src="/logo_icono_orange.png"
              alt="ACME & CIA Icon"
              width={40}
              height={40}
              className="h-full w-full object-contain"
              unoptimized
            />
          </div>
        )}
      </div>

      {/* Toggle Button - Ahora más visible */}
      <div
        className={cn(
          "flex px-3 py-3 border-b border-white/10",
          isCollapsed ? "justify-center" : "justify-end",
        )}
      >
        <button
          onClick={toggleCollapse}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
          aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navSections.map((section, idx) => {
          const isSectionExpanded = expandedSections.has(section.title);

          return (
            <div key={idx}>
              {!isCollapsed && (
                <button
                  onClick={() => toggleSection(section.title)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200",
                    "hover:bg-white/5 group text-gray-400 hover:text-gray-300",
                  )}
                >
                  <h3 className="text-xs text-gray-400 font-semibold tracking-wider uppercase">
                    {section.title}
                  </h3>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isSectionExpanded && "rotate-180",
                    )}
                  />
                </button>
              )}

              {/* Section Items - Mostrar solo si está expandida o sidebar colapsado */}
              {(isSectionExpanded || isCollapsed) && (
                <ul className="space-y-1 mt-2">
                  {section.items.map((item, itemIdx) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <li key={itemIdx}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                            isActive
                              ? 'bg-white/10 text-white before:content-[""] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-accent before:rounded-r-md'
                              : "text-gray-300 hover:bg-white/5 hover:text-accent",
                            isCollapsed && "justify-center",
                          )}
                          title={isCollapsed ? item.title : undefined}
                        >
                          <Icon className="text-lg h-5 w-5 shrink-0" />
                          {!isCollapsed && (
                            <span className="font-medium text-sm">
                              {item.title}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Separator */}
              {!isCollapsed && idx < navSections.length - 1 && (
                <Separator className="my-4 bg-white/10" />
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
