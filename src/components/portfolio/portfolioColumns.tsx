// src/components/portfolio/table/portfolioColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Portfolio } from "@/interfaces/portfolio.interface";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Power,
  Users,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PortfolioColumnActions {
  onEdit: (portfolio: Portfolio) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
}

export const getPortfolioColumns = ({
  onEdit,
  onToggleStatus,
}: PortfolioColumnActions): ColumnDef<Portfolio>[] => [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => {
      // Solo mostramos el botón de expandir si hay usuarios en el equipo
      return row.original.users?.length ? (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={row.getToggleExpandedHandler()}
        >
          {row.getIsExpanded() ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </Button>
      ) : null;
    },
  },
  {
    accessorKey: "code",
    header: "Código",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-primary">
        {row.getValue("code")}
      </span>
    ),
  },
  {
    id: "typeZone",
    header: "Tipo / Zona",
    cell: ({ row }) => {
      const type = row.original.type;
      const zone = row.original.zone;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{type}</span>
          {zone && (
            <span className="text-xs text-muted-foreground">{zone}</span>
          )}
        </div>
      );
    },
  },
  {
    id: "team",
    header: "Equipo Asignado",
    cell: ({ row }) => {
      const teamSize = row.original.users?.length || 0;
      return (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Users size={16} className="text-slate-400" />
          <span className="font-medium">{teamSize} miembros</span>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: () => <div className="text-center">Estado</div>,
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <div className="flex justify-center">
          <Badge variant={isActive ? "success" : "destructive"}>
            {isActive ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right"></div>,
    cell: ({ row }) => {
      const portfolio = row.original;
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(portfolio)}>
                <Edit className="mr-2 h-4 w-4" /> Editar Equipo
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  onToggleStatus(portfolio.id, portfolio.isActive ?? false)
                }
                className={
                  portfolio.isActive ? "text-red-600" : "text-green-600"
                }
              >
                <Power className="mr-2 h-4 w-4" />
                {portfolio.isActive ? "Desactivar" : "Reactivar"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
