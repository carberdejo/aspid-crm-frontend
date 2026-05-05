"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  User,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  FileText,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVisitDetail } from "@/hooks";

const dateFormatter = new Intl.DateTimeFormat("es-PE", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

interface Props {
  params: Promise<{ id: string; visitId: string }>;
}

export default function VisitDetailPage({ params }: Props) {
  const router = useRouter();
  const resolvedParams = use(params);
  const {
    data: visit,
    isLoading,
    isError,
  } = useVisitDetail(Number(resolvedParams.visitId));

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !visit) return <ErrorState />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* HEADER DE ACCIÓN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="w-fit gap-2 text-slate-400 hover:text-primary font-bold uppercase text-[10px] tracking-widest p-0 hover:bg-transparent"
        >
          <ArrowLeft size={16} /> Volver al listado
        </Button>
        <div className="flex gap-3">
          <Badge className="bg-primary/10 text-primary border-none py-1.5 px-4 rounded-full font-black text-[10px] uppercase">
            ID Visita: #{visit.id}
          </Badge>
          <Badge className="bg-secondary text-white border-none py-1.5 px-4 rounded-full font-black text-[10px] uppercase">
            Completada
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COLUMNA IZQUIERDA: INFORMACIÓN DE ENTIDADES (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* CARD CLIENTE */}
          <InfoCard
            title="Información de Empresa"
            icon={<Building2 size={16} />}
          >
            <p className="text-lg font-black text-primary leading-tight uppercase mb-1">
              {visit.client.commercialName}
            </p>
            <p className="text-[11px] font-bold text-slate-400 mb-4">
              {visit.client.businessName}
            </p>
            <div className="space-y-3 pt-4 border-t border-slate-50">
              <InfoItem label="RUC" value={visit.client.ruc} />
              <InfoItem
                label="Dirección"
                value={visit.client.address}
                icon={<MapPin size={12} />}
              />
            </div>
          </InfoCard>

          {/* CARD CONTACTO */}
          <InfoCard
            title="Contacto Directo"
            icon={<User size={16} />}
            variant="secondary"
          >
            <p className="text-md font-extrabold text-slate-800 uppercase">
              {visit.contact.firstName} {visit.contact.lastName}
            </p>
            <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-4">
              {visit.contact.position}
            </p>
            <div className="space-y-3 pt-4 border-t border-slate-50">
              <InfoItem
                label="Teléfono"
                value={visit.contact.phone}
                icon={<Phone size={12} />}
              />
            </div>
          </InfoCard>

          {/* CARD REGISTRO */}
          <div className="p-6 bg-[#1a2a53] rounded-[2rem] text-white shadow-xl shadow-blue-900/20">
            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 mb-4 flex items-center gap-2">
              <Briefcase size={12} /> Responsable
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center font-black text-primary">
                {visit.user.firstName[0]}
                {visit.user.lastName[0]}
              </div>
              <div>
                <p className="text-sm font-bold uppercase">
                  {visit.user.firstName} {visit.user.lastName}
                </p>
                <p className="text-[10px] opacity-60">{visit.user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: DETALLES DE LA VISITA (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* CARD FECHA */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-50 shadow-sm flex items-center gap-6">
            <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary">
              <Calendar size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Fecha del Evento
              </p>
              <p className="text-2xl font-black text-primary capitalize">
                {dateFormatter.format(new Date(visit.date))}
              </p>
            </div>
          </div>

          {/* CONTENIDO PRINCIPAL */}
          <div className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden">
            <div className="p-8 space-y-10">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-secondary uppercase tracking-[0.3em] flex items-center gap-3">
                  <ClipboardList size={18} /> Temas Tratados
                </h4>
                <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 italic text-slate-600 leading-relaxed">
                  {visit.visitTopics}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                  <FileText size={18} /> Resumen de Resultados
                </h4>
                <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 text-slate-700 leading-relaxed font-medium">
                  {visit.outcomeSummary}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTES AUXILIARES ---

function InfoCard({ title, icon, children, variant = "primary" }: any) {
  return (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-50 shadow-sm">
      <h4
        className={`text-[9px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 ${variant === "primary" ? "text-primary" : "text-secondary"}`}
      >
        {icon} {title}
      </h4>
      {children}
    </div>
  );
}

function InfoItem({ label, value, icon }: any) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
        {label}
      </span>
      <div className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase">
        {icon && <span className="text-slate-300">{icon}</span>}
        {value}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-12 text-center font-black text-slate-200 uppercase tracking-[1em] animate-pulse">
      Cargando Expediente...
    </div>
  );
}

function ErrorState() {
  return (
    <div className="p-12 text-center font-black text-red-400 uppercase">
      Error al cargar la visita
    </div>
  );
}
