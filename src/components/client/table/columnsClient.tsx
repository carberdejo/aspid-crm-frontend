'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ChevronRight, ChevronDown, Building2, UserCircle, MoreHorizontal, Edit, Eye } from 'lucide-react';
import { ClientListItem } from '@/interfaces/client.interface';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<ClientListItem>[] = [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      // Solo permitimos expandir si el conteo de contactos es > 0
      // const canExpand = row.original.contacts > 0;
      const hasContacts = row.original.contacts > 0;
      return (
      <button
        onClick={row.getToggleExpandedHandler()}
        className={`p-1 rounded-md transition-colors ${
        hasContacts ? 'text-secondary' : 'text-gray-300' // Naranja si hay, gris si no
      }`}
      >
        {row.getIsExpanded() ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>
    );
    },
  },
  {
    accessorKey: 'commercialName',
    header: 'Cliente',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/5 rounded-lg text-primary">
          <Building2 size={16} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 leading-none">
            {row.original.commercialName}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-tighter mt-1">
            {row.original.businessName}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'ruc',
    header: 'RUC',
    cell: ({ row }) => (
      <span className="font-mono text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
        {row.getValue('ruc')}
      </span>
    ),
  },
  {
    accessorKey: 'address',
    header: 'Dirección',
    cell: ({ row }) => (
      <span className="text-xs text-gray-500 truncate max-w-[250px] block">
        {row.getValue('address')}
      </span>
    ),
  },
  {
    accessorKey: 'contacts',
    header: 'Contactos',
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <div className="flex -space-x-2">
          {/* Un indicador visual de que hay personas registradas */}
          <div className="h-6 w-6 rounded-full border-2 border-white bg-secondary/10 flex items-center justify-center text-secondary">
            <UserCircle size={14} />
          </div>
        </div>
        <span className="text-xs font-bold text-gray-700">
          {row.original.contacts}
        </span>
      </div>
    ),
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const client = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Eye size={14} /> Ver Detalle
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer text-secondary">
              <Edit size={14} /> Editar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];