// src/components/segment/table/SegmentActionCell.tsx
import { Button } from "@/components/ui/button";
import { Edit, Power } from "lucide-react";
import { IndustrySegment } from "@/interfaces";

interface SegmentActionCellProps {
  segment: IndustrySegment;
  onEdit: (segment: IndustrySegment) => void;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
}

export function SegmentActionCell({
  segment,
  onEdit,
  onToggleStatus,
}: SegmentActionCellProps) {
  return (
    <div className="flex items-center gap-2 justify-end">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(segment)}
        className="h-8 w-8 text-slate-400 hover:text-secondary-text hover:bg-secondary/10"
        title="Editar"
      >
        <Edit size={16} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onToggleStatus(+segment.id, segment.isActive)}
        className={`h-8 w-8 transition-colors ${
          segment.isActive
            ? "text-slate-400 hover:text-red-500 hover:bg-red-50"
            : "text-slate-400 hover:text-green-500 hover:bg-green-50"
        }`}
        title={segment.isActive ? "Desactivar" : "Reactivar"}
      >
        <Power size={16} />
      </Button>
    </div>
  );
}
