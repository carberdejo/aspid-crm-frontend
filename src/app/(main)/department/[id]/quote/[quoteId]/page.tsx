"use client";

import { use } from "react";
import { useQuoteDetail } from "@/hooks/quote/useQuotes";
import PageHeader from "@/components/common/PageHeader";
import {
  ArrowLeft,
  Building2,
  Calendar,
  FileText,
  IdCard,
  Info,
  Phone,
  User,
  Wallet,
  Tag,
  Briefcase,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string; quoteId: string }>;
}

export default function QuoteDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const quoteId = Number(resolvedParams.quoteId);
  const departmentId = Number(resolvedParams.id);

  const { data: quote, isLoading, isError } = useQuoteDetail(quoteId);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-secondary" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Cargando expediente técnico...
        </p>
      </div>
    );
  }

  if (isError || !quote) {
    return (
      <div className="p-10 text-center uppercase font-black text-rose-500">
        Error al cargar la cotización
      </div>
    );
  }

  const statusStyles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-600 border-amber-200",
    APPROVED: "bg-emerald-50 text-emerald-600 border-emerald-200",
    REJECTED: "bg-rose-50 text-rose-600 border-rose-200",
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* CABECERA DE NAVEGACIÓN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="group p-0 hover:bg-transparent text-slate-400 hover:text-primary transition-all flex gap-2 items-center text-[10px] font-black uppercase tracking-widest"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Volver al listado
          </Button>
          <PageHeader
            title="Cotización"
            subtitle={`Ref. ${quote.quoteNumber}`}
            icon={FileText}
            iconColor="accent"
            variant="compact"
          />
        </div>

        <div className="flex gap-3 items-center">
          <Badge
            variant="outline"
            className={`h-8 px-4 text-[11px] font-black uppercase border ${statusStyles[quote.status]}`}
          >
            {quote.status}
          </Badge>
          <Button className="h-12 px-8 rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-900/10">
            Descargar PDF
          </Button>
        </div>
      </div>

      {/* GRID DE INFORMACIÓN PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA 1: CLIENTE Y CONTACTO */}
        <div className="lg:col-span-2 space-y-8">
          {/* TARJETA CLIENTE */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
              <div className="p-3 bg-blue-50 text-primary rounded-2xl">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-primary uppercase leading-tight">
                  Información del Cliente
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Datos comerciales registrados
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DataField
                label="Nombre Comercial"
                value={quote.client.commercialName}
              />
              <DataField
                label="Razón Social"
                value={quote.client.businessName}
              />
              <DataField
                label="RUC"
                value={quote.client.ruc}
                icon={<IdCard size={14} />}
              />
              <DataField
                label="Dirección Fiscal"
                value={quote.client.address}
              />
            </div>
          </section>

          {/* TARJETA CONTACTO */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-primary uppercase leading-tight">
                  Contacto Directo
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Responsable de la operación
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DataField
                label="Nombre Completo"
                value={`${quote.contact.firstName} ${quote.contact.lastName}`}
              />
              <DataField
                label="Cargo / Posición"
                value={quote.contact.position}
              />
              <DataField
                label="Teléfono / Celular"
                value={quote.contact.phone}
                icon={<Phone size={14} />}
              />
            </div>
          </section>

          {/* ALCANCE / DESCRIPCIÓN */}
          <section className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-secondary">
              <FileText size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Descripción del Alcance
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed font-medium">
              {quote.description}
            </p>
          </section>
        </div>

        {/* COLUMNA 2: DATOS TÉCNICOS Y MONTOS */}
        <div className="space-y-8">
          {/* TARJETA ECONOMICA */}
          <section className="bg-secondary p-8 rounded-[2.5rem] text-white shadow-xl shadow-orange-500/20">
            <div className="space-y-6">
              <div className="flex items-center gap-2 opacity-80">
                <Wallet size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Monto de Operación
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-5xl font-black tracking-tighter">
                  S/{" "}
                  {quote.amount.toLocaleString("es-PE", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-[10px] font-bold uppercase opacity-70 tracking-widest">
                  Sujeto a IGV según ley
                </p>
              </div>
            </div>
          </section>

          {/* TARJETA DETALLES INTERNOS */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <DataField
              label="Tipo de Cotización"
              value={quote.type}
              icon={<Tag size={12} />}
            />
            <DataField
              label="Tipo de Orden"
              value={quote?.orderType || "No especificado"}
              icon={<Briefcase size={12} />}
            />
            <DataField
              label="Creado por"
              value={`${quote.user.firstName} ${quote.user.lastName}`}
              icon={<User size={12} />}
            />

            <div className="pt-4 border-t border-slate-50 space-y-4">
              <DataField
                label="Fecha Emisión"
                value={new Date(quote.createdAt).toLocaleDateString("es-PE")}
                icon={<Calendar size={12} />}
              />
              <DataField
                label="Última Actualización"
                value={new Date(quote.updatedAt).toLocaleDateString("es-PE")}
                icon={<Clock size={12} />}
              />
            </div>
          </section>

          {/* MOTIVO DE RECHAZO (SI EXISTE) */}
          {quote.status === "RECHAZADO" && (
            <section className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 space-y-3">
              <div className="flex items-center gap-2 text-rose-600">
                <Info size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Motivo de Rechazo
                </span>
              </div>
              <p className="text-rose-700 text-sm font-bold italic">
                {quote.statusReason}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// COMPONENTE AUXILIAR PARA CAMPOS DE DATOS
function DataField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
        {icon} {label}
      </label>
      <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">
        {value || "---"}
      </p>
    </div>
  );
}
