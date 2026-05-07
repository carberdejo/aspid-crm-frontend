"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/interfaces/api.interface";
import { Edit, Trash } from "lucide-react";
import { UserRole } from "@/interfaces/role-user.interface";

/**
 * Formatear role para mostrar en español
 */
const getRoleLabel = (role: UserRole): string => {
  const roleLabels: Record<UserRole, string> = {
    [UserRole.ADMIN]: "Administrador",
    [UserRole.USER]: "Usuario",
  };

  return roleLabels[role] || role;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "Usuario",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-xs text-gray-500">ID: {user.codUser}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Correo Electrónico",
    cell: ({ row }) => (
      <span className="text-sm text-gray-700">{row.getValue("email")}</span>
    ),
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const role = row.getValue("role") as UserRole;
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#1a2a53]/10 text-[#1a2a53]">
          {getRoleLabel(role)}
        </span>
      );
    },
  },
  {
    accessorKey: "departments",
    header: "Departamentos",
    cell: ({ row }) => {
      const departments = row.original.departments;

      if (!departments || departments.length === 0) {
        return <span className="text-xs text-gray-400">Sin departamentos</span>;
      }

      return (
        <div className="flex flex-wrap gap-1">
          {departments.map((dept, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-secondary/10 text-secondary border border-secondary/20 uppercase"
            >
              {dept}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      return (
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              isActive ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          <span
            className={`text-sm font-medium ${
              isActive ? "text-green-700" : "text-gray-500"
            }`}
          >
            {isActive ? "Activo" : "Inactivo"}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const user = row.original;
      const whatsappUrl = `https://wa.me/${user.countryCode}${user.phone}`;
      return (
        <div className="flex items-center gap-2">
          {/* BOTÓN WHATSAPP */}
          {user.phone && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-400 hover:text-[#25D366] hover:bg-[#25D366]/10 transition-all active:scale-90"
              title="Enviar WhatsApp"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          )}
          <button
            onClick={() => {
              // TODO: Implementar edición
              console.log("Editar usuario:", user.codUser);
            }}
            className="p-2 hover:bg-[#1a2a53]/10 rounded-md text-[#1a2a53] transition-colors"
            title="Editar usuario"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              // TODO: Implementar eliminación con confirmación
              if (confirm(`¿Eliminar a ${user.firstName} ${user.lastName}?`)) {
                console.log("Eliminar usuario:", user.codUser);
              }
            }}
            className="p-2 hover:bg-red-50 rounded-md text-red-600 transition-colors"
            title="Eliminar usuario"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      );
    },
  },
];
