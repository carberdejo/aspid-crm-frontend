"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useContactsByClient } from "@/hooks";
import { Loader2, Phone, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegisterContactModal } from "@/components";

interface ContactSheetProps {
  clientId: number | null;
  clientName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactSheet({
  clientId,
  clientName,
  isOpen,
  onOpenChange,
}: ContactSheetProps) {
  const { contact } = useContactsByClient(clientId || 0);
  const contacts = contact.data || [];
  const isLoading = contact.isLoading;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[450px] p-0 border-l-slate-100 flex flex-col gap-0 shadow-2xl">
        {/* HEADER COMPACTO Y FIJO */}
        <SheetHeader className="p-4 sm:p-6 bg-white border-b border-slate-50">
          {/* Contenedor principal: Column en móvil, Row en Desktop */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Títulos: Con min-w-0 para evitar que el texto rompa el layout */}
            <div className="min-w-0 space-y-1">
              <SheetTitle className="text-xl sm:text-2xl font-black text-primary italic uppercase tracking-tighter leading-none">
                Directorio
              </SheetTitle>
              {/* Subtítulo con scroll horizontal o wrap controlado */}
              <SheetDescription className="text-[9px] sm:text-[10px] font-bold text-secondary uppercase tracking-[0.15em] leading-relaxed break-words">
                {clientName}
              </SheetDescription>
            </div>

            {/* Botón: Ancho completo en móvil para mejorar el área de clic (UX) */}
            <div className="w-full sm:w-auto">
              {clientId && (
                <div className="[&>button]:w-full sm:[&>button]:w-auto">
                  <RegisterContactModal clientId={clientId} />
                </div>
              )}
            </div>
          </div>
        </SheetHeader>

        {/* CONTENIDO SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Sincronizando Directorio...
              </p>
            </div>
          ) : contacts.length > 0 ? (
            contacts.map((c) => {
              const waLink = `https://wa.me/${c.countryCode}${c.phone.replace(/\s+/g, "")}`;

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow group"
                >
                  {/* Fila Superior: Avatar + Info Básica */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-900 flex items-center justify-center text-white text-sm font-black italic group-hover:bg-secondary transition-colors">
                      {c.firstName[0]}
                      {c.lastName[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[13px] font-black text-slate-800 uppercase italic truncate tracking-tight leading-none">
                        {c.firstName} {c.lastName}
                      </h4>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                        {c.position}
                      </span>
                    </div>
                  </div>

                  {/* Datos de Contacto en Cuadrícula */}
                  <div className="grid grid-cols-1 gap-2 mb-4 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors cursor-default">
                      <Mail size={12} className="text-slate-300" />
                      <span className="text-[10px] font-bold lowercase italic truncate">
                        {c.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Phone size={12} className="text-slate-300" />
                      <span className="text-[11px] font-black font-mono tracking-tighter">
                        +{c.countryCode} {c.phone}
                      </span>
                    </div>
                  </div>

                  {/* Botón de Acción Principal */}
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-10 border-emerald-500/20 bg-emerald-50/30 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl font-black uppercase text-[9px] tracking-widest transition-all gap-2"
                  >
                    <a href={waLink} target="_blank" rel="noopener noreferrer">
                      <svg
                        className="w-3.5 h-3.5 fill-currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Enviar WhatsApp
                    </a>
                  </Button>
                </div>
              );
            })
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-white/50">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Sin contactos registrados
              </p>
            </div>
          )}
        </div>

        {/* FOOTER OPCIONAL: Acceso a Detalle */}
        {contacts.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-50">
            <Button
              variant="ghost"
              className="w-full text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors"
              onClick={() =>
                (window.location.href = `/dashboard/clients/${clientId}`)
              }
            >
              Ver perfil completo del cliente{" "}
              <ExternalLink size={12} className="ml-2" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
