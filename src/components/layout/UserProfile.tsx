"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/simple-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { UserRole } from "@/interfaces";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "../shared/ConfirmDialog";

export default function UserProfile() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!user) {
    return null;
  }

  // Generar iniciales del email
  const getInitials = (email: string) => {
    const parts = email.split("@")[0].split(".");
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return email.charAt(0).toUpperCase() + email.charAt(1).toUpperCase();
  };

  // Formatear role para mostrar
  const getRoleDisplay = (role: UserRole) => {
    return role === UserRole.ADMIN ? "Administrador" : "Usuario";
  };

  // Formatear email para mostrar como nombre
  const getDisplayName = (email: string) => {
    const localPart = email.split("@")[0];
    return localPart
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };

  const handleProfileClick = () => {
    // TODO: Implementar navegación a perfil
    console.log("Ir a perfil de usuario");
    router.push(`/profile/${user.codUser}`);
  };

  const handleSettingsClick = () => {
    // TODO: Implementar navegación a configuración
    console.log("Ir a configuración");
  };

  const handleLogoutClick = () => {
    logout();
    setShowLogoutModal(true);
    router.push("/auth/login");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors group">
            <Avatar className="h-10 w-10 border-2 border-[#1a2a53]/20">
              <AvatarFallback className="bg-[#1a2a53] text-white font-bold">
                {getInitials(user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col flex-1">
              <span className="text-sm font-semibold text-gray-800 leading-tight">
                {getDisplayName(user.email)}
              </span>
              <span className="text-xs text-gray-500">
                {getRoleDisplay(user.role)}
              </span>
            </div>
            <ChevronDown className="hidden md:block h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          {/* Información del usuario */}
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {getDisplayName(user.email)}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
            {user.depts.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {user.depts.map((dept) => (
                  <span
                    key={dept}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#f8aa19]/10 text-[#f8aa19] border border-[#f8aa19]/20"
                  >
                    {dept}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Opciones del menú */}
          <DropdownMenuItem onClick={handleProfileClick}>
            <User className="mr-2 h-4 w-4" />
            <span>Ver Perfil</span>
          </DropdownMenuItem>

          {user.role === UserRole.ADMIN && (
            <DropdownMenuItem onClick={handleSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogoutClick}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        isOpen={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        title="¿Cerrar sesión?"
        description="Tu sesión actual será finalizada y tendrás que volver a ingresar tus credenciales para acceder a ACME & CIA."
        onConfirm={handleLogoutClick}
        variant="destructive"
      />

      {/* Modal de logout */}
      {/* <LogoutModal 
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
      /> */}
    </>
  );
}
