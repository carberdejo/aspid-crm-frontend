// components/visits/RegisterVisitModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VisitForm } from "./VisitForm";
import { VisitFormValues } from "@/lib/schemas/visit";

interface RegisterVisitModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  departmentId: number;
  onSubmit: (data: VisitFormValues) => void;
  isLoading: boolean;
}

export function RegisterVisitModal({ 
  isOpen, 
  onOpenChange, 
  departmentId, 
  onSubmit, 
  isLoading
}: RegisterVisitModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] rounded-[2.5rem] p-8">
        <DialogHeader className="border-b border-slate-100 pb-4">
          <DialogTitle className="text-3xl font-black text-primary uppercase tracking-tighter">
            Registrar <span className="text-secondary-text">Visita</span>
          </DialogTitle>
        </DialogHeader>
        
        <VisitForm 
          departmentId={departmentId}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}