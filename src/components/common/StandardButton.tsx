import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StandardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon | ReactNode; // Para permitir tanto iconos de Lucide como cualquier nodo (ej. para casos especiales)
  label: string;
  colorClass?: string; // Para pasar fondos personalizados
}

export function StandardButton({
  icon: Icon,
  label,
  // Tu color por defecto (ej. para Registrar Empresa)
  colorClass = "bg-secondary hover:bg-secondary-dark text-white",
  className,
  ...props
}: StandardButtonProps) {
  return (
    <Button
      className={cn(
        "gap-2 px-4 h-10 rounded-lg font-semibold flex items-center transition-all shadow-md active:scale-95",
        colorClass,
        className,
      )}
      {...props}
    >
      {Icon && (typeof Icon === "function" ? <Icon size={18} /> : Icon)}
      {label}
    </Button>
  );
}
