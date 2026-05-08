"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Mail,
  Phone,
  Building2,
  Loader2,
  MessageCircle,
  ExternalLink,
  Copy,
  Briefcase,
  Edit,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { useClientDetail } from "@/hooks/client/useClientDetail";
import { RegisterContactModal } from "@/components";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ClientContactsPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const { data: client, isLoading } = useClientDetail(+clientId);
  const contacts = client?.contacts || [];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Aquí podrías disparar un toast de sonner o similar
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-secondary" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Cargando directorio...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* NAVEGACIÓN Y HEADER */}
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-primary transition-all uppercase tracking-[0.2em] group"
        >
          <ChevronLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Volver a Cartera
        </button>

        <PageHeader
          title={client?.commercialName || "Cliente"}
          subtitle={`${client?.businessName || ""} • ${client?.address || ""}`}
          icon={Building2}
          iconColor="secondary"
          count={contacts.length}
          countLabel="contactos registrados"
          action={<RegisterContactModal clientId={+clientId} />}
        />
      </div>

      {/* GRID DE CONTACTOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.length > 0 ? (
          contacts.map((c) => {
            // Generamos el link de WhatsApp (countryCode + phone)
            const waLink = `https://wa.me/${c.countryCode}${c.phone.replace(/\s+/g, "")}`;

            return (
              <div
                key={c.id}
                className="bg-white rounded-[1.5rem] p-5 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 group flex flex-col gap-4"
              >
                {/* HEADER COMPACTO: Avatar y Nombre en la misma fila para ahorrar espacio */}
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-primary flex items-center justify-center text-white text-sm font-black group-hover:bg-secondary transition-colors italic">
                    {c.firstName[0]}
                    {c.lastName[0]}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-black text-primary  uppercase italic tracking-tight">
                      {c.firstName} {c.lastName}
                    </h2>
                    <p className="text-[8px] font-black text-secondary uppercase tracking-[0.15em] opacity-70">
                      {c.position}
                    </p>
                  </div>
                </div>

                {/* INFO DE CONTACTO: Iconos pequeños y texto compacto */}
                <div className="grid grid-cols-1 gap-2 py-2 border-y border-slate-50">
                  <div className="flex items-center gap-2 text-slate-500 overflow-hidden">
                    <Mail size={12} className="shrink-0 text-slate-300" />
                    <span className="text-[12px] font-bold truncate lowercase italic">
                      {c.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone size={12} className="shrink-0 text-slate-300" />
                    <span className="text-[12px] font-black font-mono tracking-tighter">
                      +{c.countryCode} {c.phone}
                    </span>
                  </div>
                </div>

                {/* BOTONES COMPACTOS: Estilo "Action Bar" */}
                <div className="flex gap-2">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 h-9 flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white rounded-lg transition-all duration-300 border border-[#25D366]/10 hover:border-transparent"
                  >
                    {/* SVG Oficial de WhatsApp */}
                    <svg
                      className="w-3.5 h-3.5 fill-currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      WhatsApp
                    </span>
                  </a>
                  <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:text-primary hover:bg-slate-100 transition-colors">
                    <Edit size={14} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <Briefcase size={40} className="text-slate-200" />
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              No hay contactos para este cliente
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
