'use client';

import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Mail, Phone, Building2, Briefcase, Loader2, MapPin, Hash } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { useClientDetail } from '@/hooks/useClientDetail';
import { RegisterContactModal } from '@/components';

export default function ClientContactsPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  // Obtenemos TODO el objeto del cliente
  const { data: clientResponse, isLoading } = useClientDetail(+clientId);
  const client = clientResponse;
  const contacts = client?.contacts || [];

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-slate-50/30 min-h-screen">
      
      {/* HEADER DINÁMICO CON DATOS DEL CLIENTE */}
      <div className="space-y-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-secondary transition-colors uppercase tracking-[0.2em]"
        >
          <ChevronLeft size={14} /> Volver a Cartera
        </button>
        
        <PageHeader
          title={client?.commercialName || "Cliente"}
          subtitle={`${client?.businessName || ""} • ${client?.address || ""}`}
          icon={Building2}
          iconColor="secondary"
          count={contacts.length}
          countLabel="contactos"
          action={<RegisterContactModal clientId={+clientId} />}
        />
      </div>

      {/* GRID DE CONTACTOS (Usando la data del mismo objeto) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((c) => (
          <div 
            key={c.id} 
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-secondary/30 transition-all group relative overflow-hidden"
          >
             {/* ... (el resto de la card de contacto que definimos antes) */}
             <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                  <span className="text-lg font-black uppercase">{c.firstName[0]}{c.lastName[0]}</span>
                </div>
                <div>
                   <h2 className="text-base font-black text-slate-800 uppercase leading-tight">{c.firstName} {c.lastName}</h2>
                   <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">{c.position}</p>
                </div>
             </div>
             
             <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3 text-slate-600">
                   <Phone size={14} className="text-slate-400" />
                   <span className="text-sm font-bold font-mono">{c.phone}</span>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}