import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter // Agregamos footer para mejor orden
} from "@/components/ui/dialog"; // 👈 IMPORTANTE: Usar tus componentes de UI, no los de Radix directo
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: "default" | "destructive";
}

export function ConfirmDialog({ 
  isOpen, onOpenChange, title, description, onConfirm, isLoading, variant = "default" 
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* Tus componentes de UI ya incluyen el DialogPortal y DialogOverlay internamente */}
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-primary font-black uppercase tracking-tighter">
            {title}
          </DialogTitle>
          <DialogDescription className="text-slate-500 pt-2 font-medium">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-3 mt-6">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)} 
            disabled={isLoading}
            className="font-bold text-slate-500"
          >
            CANCELAR
          </Button>
          <Button 
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isLoading}
            className="font-bold px-6"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16}/> : "SÍ, CONFIRMAR"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}