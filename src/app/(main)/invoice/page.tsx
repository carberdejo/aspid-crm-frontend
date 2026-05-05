"use client";

import { FileText } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";

export default function InvoicePage() {
  return (
    <div className="p-4 lg:p-8 space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Facturas"
        subtitle="Gestión de Facturas y Documentos Fiscales"
        icon={FileText}
        iconColor="accent"
      />
      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <p className="text-slate-400 font-medium text-center">
          Módulo de facturación en desarrollo
        </p>
      </div>
    </div>
  );
}
