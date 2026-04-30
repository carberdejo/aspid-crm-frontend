import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuoteForm } from "./QuoteForm";
import { QuoteFormValues } from "@/lib/schemas/quote";

interface RegisterQuoteModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  departmentId: number;
  userId: number;
  onSubmit: (data: QuoteFormValues) => void;
  isLoading: boolean;
  onNewClient: () => void;
  onNewContact: () => void;
  newClientId?: string;
  newContactId?: string;
  onClientChange?: (clientId: string) => void;
}

export function RegisterQuoteModal({
  isOpen,
  onOpenChange,
  departmentId,
  onSubmit,
  isLoading,
}: RegisterQuoteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] rounded-[2.5rem] p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-slate-100 pb-4">
          <DialogTitle className="text-3xl font-black text-primary uppercase tracking-tighter">
            Generar <span className="text-secondary">Cotización</span>
          </DialogTitle>
        </DialogHeader>

        <QuoteForm
          departmentId={departmentId}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
