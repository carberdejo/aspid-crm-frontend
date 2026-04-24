'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/simple-separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useSidebarStore } from '@/store/useSidebarStore';
import { navSections } from './NavItems';

export default function MobileSidebar() {
  const pathname = usePathname();
  const { isMobileOpen, setMobileOpen } = useSidebarStore();

  return (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent 
        side="left" 
        className="w-64 p-0 bg-[#1a2a53] text-white border-[#2a3a63]"
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
          {navSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="px-3 mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                {section.title}
              </h3>
              <ul className="space-y-1">
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
                            ? 'bg-white/10 text-white before:content-[""] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#f8aa19] before:rounded-r-md'
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
              {idx < navSections.length - 1 && (
                <Separator className="my-4 bg-white/10" />
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
