'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/simple-separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useSidebarStore } from '@/store/useSidebarStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { generateNavSections } from './NavItems';

export default function MobileSidebar() {
  const pathname = usePathname();
  const { isMobileOpen, setMobileOpen } = useSidebarStore();
  const { user } = useAuthStore();
  const { departments, isLoading } = useDepartmentStore();

  // Estado para secciones expandidas con persistencia de sesión
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') {
      return new Set();
    }

    const savedSections = sessionStorage.getItem('expandedSections');

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

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('expandedSections', JSON.stringify([...updated]));
    }
  };

  // Generar navSections dinámicamente
  const navSections = user && !isLoading
    ? generateNavSections(user.role, user.depts, departments)
    : [];

  return (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent 
        side="left" 
        className="w-64 p-0 bg-primary text-white border-primary-light"
      >
        <SheetHeader className="px-4 pt-6 pb-4 border-b border-white/10">
          <SheetTitle className="flex items-center justify-center">
            <div className="relative w-full h-10 flex items-center justify-center">
              <Image
                src="/logo-acme.png"
                alt="ACME & CIA Logo"
                width={180}
                height={40}
                className="object-contain"
                priority
              />
            </div>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 h-[calc(100vh-140px)] overflow-y-auto space-y-6 p-4">
          {navSections.map((section, idx) => {
            const isSectionExpanded = expandedSections.has(section.title);

            return (
              <div key={idx}>
                {/* Collapsible Section Header */}
                <button
                  onClick={() => toggleSection(section.title)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200',
                    'hover:bg-white/5 group text-gray-400 hover:text-gray-300'
                  )}
                >
                  <h3 className="text-xs text-gray-400 font-semibold tracking-wider uppercase">
                    {section.title}
                  </h3>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform duration-200',
                      isSectionExpanded && 'rotate-180'
                    )}
                  />
                </button>

                {/* Section Items - Mostrar solo si está expandida */}
                {isSectionExpanded && (
                  <ul className="space-y-1 mt-2">
                    {section.items.map((item, itemIdx) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;

                      return (
                        <li key={itemIdx}>
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                              isActive
                                ? 'bg-white/10 text-white before:content-[""] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-accent before:rounded-r-md'
                                : 'text-gray-300 hover:bg-white/5 hover:text-white'
                            )}
                          >
                            <Icon className="text-lg h-5 w-5 shrink-0" />
                            <span className="font-medium text-sm">{item.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {/* Separator */}
                {idx < navSections.length - 1 && (
                  <Separator className="my-4 bg-white/10" />
                )}
              </div>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
