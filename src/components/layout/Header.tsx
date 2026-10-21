'use client';

import { Menu, Bell, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/simple-separator';
import { useSidebarStore } from '@/store/useSidebarStore';
import UserProfile from './UserProfile';
import { useHeaderStore } from '@/store';

interface HeaderProps {
  currentSection?: string;
}

export default function Header({ currentSection = 'Dashboard' }: HeaderProps) {
  const { toggleMobile } = useSidebarStore();
  const headerTitle = useHeaderStore((state) => state.headerTitle);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between w-full h-16 px-4 lg:px-8 bg-white border-b border-gray-200 shadow-sm">
      {/* Left Side - Mobile Menu + Section Title */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobile}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </button>

        {/* Current Section Title */}
        <h1 className="text-xl font-semibold text-primary hidden sm:block">
          {headerTitle}
        </h1>
      </div>

      {/* Right Side - Notifications + User Profile */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Export Button (Optional - commented out) 
        <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
          <Download className="h-4 w-4" />
          <span className="text-sm font-medium">Exportar PDF</span>
        </button>
        */}

        {/* Notifications */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative hover:opacity-80 transition-opacity p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-primary bg-secondary rounded-full">
              3
            </span>
          </button>

          {/* Messages */}
          <button className="relative hover:opacity-80 transition-opacity p-2 hover:bg-gray-100 rounded-lg">
            <MessageSquare className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-primary bg-secondary rounded-full">
              10
            </span>
          </button>
        </div>

        {/* Separator */}
        <Separator orientation="vertical" className="h-8 hidden md:block bg-gray-300" />

        {/* User Profile Component */}
        <UserProfile />
      </div>
    </header>
  );
}
