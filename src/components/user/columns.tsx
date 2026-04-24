'use client';

import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/interfaces/api.interface';
import { Edit, Trash } from 'lucide-react';
import { UserRole } from '@/interfaces/role-user.interface';

/**
 * Formatear role para mostrar en español
 */
const getRoleLabel = (role: UserRole): string => {
  const roleLabels: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'Administrador',
    [UserRole.USER]: 'Usuario',
  };
  
  return roleLabels[role] || role;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'firstName',
    header: 'Usuario',
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
    accessorKey: 'email',
    header: 'Correo Electrónico',
    cell: ({ row }) => (
      <span className="text-sm text-gray-700">{row.getValue('email')}</span>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Rol',
    cell: ({ row }) => {
      const role = row.getValue('role') as UserRole;
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#1a2a53]/10 text-[#1a2a53]">
          {getRoleLabel(role)}
        </span>
      );
    },
  },
  {
    accessorKey: 'departments',
    header: 'Departamentos',
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
    accessorKey: 'isActive',
    header: 'Estado',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive');
      return (
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              isActive ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
          <span
            className={`text-sm font-medium ${
              isActive ? 'text-green-700' : 'text-gray-500'
            }`}
          >
            {isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const user = row.original;
      
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              // TODO: Implementar edición
              console.log('Editar usuario:', user.codUser);
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
                console.log('Eliminar usuario:', user.codUser);
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
