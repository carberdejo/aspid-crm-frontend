// src/components/segment/table/segmentColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { IndustrySegment } from "@/interfaces";
import { Badge } from "@/components/ui/badge";

// Importamos el nuevo ActionCell
import { SegmentActionCell } from "./SegmentActionCell";

interface SegmentColumnActions {
  onEdit: (segment: IndustrySegment) => void;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
}

export const getSegmentColumns = ({
  onEdit,
  onToggleStatus,
}: SegmentColumnActions): ColumnDef<IndustrySegment>[] => [
  {
    accessorKey: "code",
    header: "Código",
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return (
        <div className="flex items-center gap-2 w-[80px]">
          <div
            className={`h-2 w-2 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`}
          />
          <span className="font-bold font-mono text-primary">
            {row.getValue("code")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Rubro / Nombre",
    cell: ({ row }) => (
      <span className="font-semibold text-slate-700 uppercase text-xs">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    header: () => <div className="text-center">Estado</div>,
    cell: ({ row }) => {
      const isActive = row.original.isActive;
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
    header: () => <div className="text-right">Acciones</div>,
    // AQUÍ ES DONDE SUCEDE LA MAGIA
    cell: ({ row }) => (
      <SegmentActionCell
        segment={row.original}
        onEdit={onEdit}
        onToggleStatus={onToggleStatus}
      />
    ),
  },
];
