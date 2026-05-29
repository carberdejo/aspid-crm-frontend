"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Edit3 } from "lucide-react";
import { Delivery } from "@/interfaces"; // Ajusta a la ruta real de tus interfaces
import { useParams, useRouter } from "next/navigation";

interface ActionsCellDeliveryProps {
  delivery: Delivery;
}

export const ActionsCellDelivery = ({ delivery }: ActionsCellDeliveryProps) => {
  const router = useRouter();
  const params = useParams();
  const departmentId = params.id;
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleGoToDetail = () => {
    // Ajusta esta ruta según la estructura de carpetas de logística/entregas
    router.push(`/department/${departmentId}/delivery/${delivery.id}`);
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {/* 1. VER DETALLE DIRECTO */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-emerald-600 rounded-full transition-colors shrink-0"
        onClick={handleGoToDetail}
        title="Ver Detalle"
      >
        <Eye size={16} />
      </Button>

      {/* 2. EDITAR (Con Dialog Informativo de En Construcción) */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-amber-600 rounded-full transition-colors shrink-0"
            title="Editar Entrega"
          >
            <Edit3 size={16} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] p-8 bg-white border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-primary uppercase">
              Editar <span className="text-indigo-600">Entrega</span>
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-5 text-center">
            <p className="text-xs font-bold text-slate-500">
              Guía de remisión / Entrega de referencia:{" "}
              <span className="text-slate-800 font-mono font-black">
                {delivery.id}
              </span>
            </p>

            {/* Contenedor estético con la línea gráfica del módulo */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Formulario en construcción
              </span>
              <p className="text-[10px] font-bold text-slate-400 mt-1.5 max-w-[260px] leading-relaxed">
                Próximamente podrás modificar los ítems, cantidades y reasignar
                el responsable de esta guía logística.
              </p>
            </div>

            <div className="flex justify-center pt-2">
              <Button
                className="h-10 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-widest shadow-md transition-all active:scale-95"
                onClick={() => setIsEditOpen(false)}
              >
                Entendido
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
