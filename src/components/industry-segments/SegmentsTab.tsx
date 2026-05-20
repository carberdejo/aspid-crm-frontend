"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreHorizontal, Edit, Power } from "lucide-react";
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
import { useIndustrySegments, useToggleIndustrySegmentStatus } from "@/hooks";
import { SegmentFormDialog } from "./SegmentFormDialog";
import { IndustrySegmentUpdateDto } from "@/interfaces/industry-segment.interface";

export function SegmentsTab() {
  const { industrySegments: segments, isLoading } = useIndustrySegments({});
  const { toggleStatus } = useToggleIndustrySegmentStatus();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] =
    useState<IndustrySegmentUpdateDto | null>(null);

  // Filtrado local por nombre o código
  const filteredSegments = segments.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (segment: IndustrySegmentUpdateDto) => {
    setSelectedSegment(segment);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedSegment(null);
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
            placeholder="Buscar por código o nombre..."
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
          Registrar Segmtentación
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[100px] font-bold">Código</TableHead>
              <TableHead className="font-bold">Nombre del Segmento</TableHead>
              <TableHead className="w-[120px] font-bold text-center">
                Estado
              </TableHead>
              <TableHead className="w-[80px] text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  Cargando segmentos...
                </TableCell>
              </TableRow>
            ) : filteredSegments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-muted-foreground"
                >
                  No se encontraron segmentos.
                </TableCell>
              </TableRow>
            ) : (
              filteredSegments.map((segment) => (
                <TableRow key={segment.id}>
                  <TableCell className="font-mono font-medium">
                    {segment.code}
                  </TableCell>
                  <TableCell>{segment.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={segment.isActive ? "success" : "destructive"}
                    >
                      {segment.isActive ? "Activo" : "Inactivo"}
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
                        <DropdownMenuItem onClick={() => handleEdit(segment)}>
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            toggleStatus({
                              id: segment.id,
                              isActive: segment.isActive,
                            })
                          }
                          className={
                            segment.isActive ? "text-red-600" : "text-green-600"
                          }
                        >
                          <Power className="mr-2 h-4 w-4" />
                          {segment.isActive ? "Desactivar" : "Reactivar"}
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

      <SegmentFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        segment={selectedSegment}
      />
    </div>
  );
}
