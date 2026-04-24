'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/simple-separator';
import { useSidebarStore } from '@/store/useSidebarStore';
import { generateNavSections } from './NavItems';
import { useAuthStore } from '@/store/useAuthStore';
import { useDepartmentStore } from '@/store/useDepartmentStore';

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  const { user } = useAuthStore();
  const { departments, isLoading } = useDepartmentStore();

  // Generar navSections dinámicamente
  const navSections = user && !isLoading
    ? generateNavSections(user.role, user.depts, departments)
    : [];

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col h-screen transition-all duration-300 border-r',
        isCollapsed ? 'w-20' : 'w-64',
        'bg-[#1a2a53] text-white border-[#2a3a63]'
      )}
    >
      {/* Logo Area */}
      <div className="flex items-center justify-center h-20 border-b border-white/10 px-4 overflow-hidden">
        {!isCollapsed ? (
          // Logo completo horizontal en modo expandido
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
        ) : (
          // Letra "A" estilizada en modo colapsado
          <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
            <span className="text-[#1a2a53] font-bold text-2xl">A</span>
          </div>
        )}
      </div>

      {/* Toggle Button - Ahora más visible */}
      <div className={cn(
        "flex px-3 py-3 border-b border-white/10",
        isCollapsed ? "justify-center" : "justify-end"
      )}>
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
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {navSections.map((section, idx) => (
          <div key={idx}>
            {!isCollapsed && (
              <h3 className="px-3 mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <li key={itemIdx}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                        isActive
                          ? 'bg-white/10 text-white before:content-[""] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#f8aa19] before:rounded-r-md'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white',
                        isCollapsed && 'justify-center'
                      )}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <Icon className="text-lg h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium text-sm">{item.title}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {!isCollapsed && idx < navSections.length - 1 && (
              <Separator className="my-4 bg-white/10" />
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
