"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreHorizontal, Edit, Power, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePortfolios, useTogglePortfolioStatus } from "@/hooks";
import { PortfolioFormDialog } from "./PortfolioFormDialog";
import { Portfolio } from "@/interfaces/portfolio.interface";

export function PortfoliosTab() {
  const { portfolios, isLoading } = usePortfolios({});
  const { togglePortfolioStatus } = useTogglePortfolioStatus();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null,
  );

  // Búsqueda por código, tipo o zona
  const filteredPortfolios = portfolios.filter(
    (p: Portfolio) =>
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.zone && p.zone.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const handleEdit = (portfolio: Portfolio | null) => {
    setSelectedPortfolio(portfolio);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedPortfolio(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            placeholder="Buscar por código, tipo o zona..."
            className="pl-10 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={handleCreate}
          className="gap-2 bg-secondary hover:bg-secondary-dark text-white px-4 h-10 rounded-lg font-semibold flex items-center transition-all shadow-md active:scale-95"
        >
          <Plus size={18} />
          Registrar Cartera
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[100px] font-bold">Código</TableHead>
              <TableHead className="font-bold">Tipo / Zona</TableHead>
              <TableHead className="font-bold">Equipo Asignado</TableHead>
              <TableHead className="w-[120px] font-bold text-center">
                Estado
              </TableHead>
              <TableHead className="w-[80px] text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Cargando carteras...
                </TableCell>
              </TableRow>
            ) : filteredPortfolios.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground"
                >
                  No se encontraron carteras.
                </TableCell>
              </TableRow>
            ) : (
              filteredPortfolios.map((portfolio: Portfolio) => (
                <TableRow key={portfolio.id}>
                  <TableCell className="font-mono font-medium">
                    {portfolio.code}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{portfolio.type}</span>
                      {portfolio.zone && (
                        <span className="text-xs text-muted-foreground">
                          {portfolio.zone}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users size={16} className="text-slate-400" />
                      {/* Asumiendo que tu backend devuelve el arreglo 'users' en el GET */}
                      {portfolio.users?.length || 0} miembros
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={portfolio.isActive ? "success" : "destructive"}
                    >
                      {portfolio.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(portfolio)}>
                          <Edit className="mr-2 h-4 w-4" /> Editar Equipo
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            togglePortfolioStatus({
                              id: portfolio.id,
                              isActive: portfolio.isActive ?? false,
                            })
                          }
                          className={
                            portfolio.isActive
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        >
                          <Power className="mr-2 h-4 w-4" />
                          {portfolio.isActive ? "Desactivar" : "Reactivar"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Lo dejamos comentado hasta crear el componente */}
      <PortfolioFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        portfolio={selectedPortfolio}
      />
    </div>
  );
}
