"use client";

import { Button } from "@/components/ui/button";
import { Eye, Edit3 } from "lucide-react";
import { VisitListItem } from "@/interfaces/visit.interface";
import { useRouter } from "next/navigation";

export const ActionsCellVisit = ({ visit }: { visit: VisitListItem }) => {
  const router = useRouter();

  const handleGoToDetail = () => {
    router.push(`/department/${visit.departmentId}/visit/${visit.id}`);
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {/* 1. VER DETALLE */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-colors shrink-0"
        onClick={handleGoToDetail}
        title="Ver Detalle de Visita"
      >
        <Eye size={16} />
      </Button>

      {/* 2. EDITAR */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors shrink-0"
        title="Editar Visita"
        onClick={() => {
          // Aquí integrarías la lógica o el modal para editar la visita
          console.log("Abrir modal de edición para visita:", visit.id);
        }}
      >
        <Edit3 size={16} />
      </Button>
    </div>
  );
};
