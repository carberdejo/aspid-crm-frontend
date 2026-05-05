"use client";

import { Settings } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";

export default function SettingsPage() {
  return (
    <div className="p-4 lg:p-8 space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Configuración"
        subtitle="Personaliza tus preferencias de sistema"
        icon={Settings}
        iconColor="primary"
      />
      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <p className="text-slate-400 font-medium text-center">
          Las opciones de configuración estarán disponibles pronto
        </p>
      </div>
    </div>
  );
}
