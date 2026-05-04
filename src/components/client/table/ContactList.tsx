"use client";

import {
  Loader2,
  User,
  Phone,
  Briefcase,
  Mail,
  Users,
  ChevronRight,
} from "lucide-react";
import { useContactsByClient } from "@/hooks";
import { RegisterContactModal } from "../..";
import Link from "next/link";

interface ContactListProps {
  clientId: number;
}

export function ContactList({ clientId }: ContactListProps) {
  const { contact } = useContactsByClient(Number(clientId));
  const contacts = contact.data || [];
  const isLoading = contact.isLoading;

  return (
    <div className="ml-12 mr-4 my-2 p-5 bg-slate-50/50 border border-slate-200 rounded-xl shadow-inner">
      {/* Header del Sub-panel */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.15em] leading-none">
              Directorio de Contactos
            </h3>
            <p className="text-[9px] text-muted-foreground uppercase mt-1">
              Personal clave para coordinaciones comerciales
            </p>
          </div>
        </div>

        {/* Botón siempre visible */}
        <RegisterContactModal clientId={clientId} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10 gap-3 text-muted-foreground italic">
          <Loader2 className="h-4 w-4 animate-spin text-secondary" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Sincronizando...
          </span>
        </div>
      ) : contacts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {contacts.slice(0, 3).map((contact) => (
              <div
                key={contact.id}
                className="group bg-white flex items-center p-3 rounded-lg border border-slate-200 hover:border-secondary/40 hover:shadow-md transition-all relative overflow-hidden"
              >
                {/* Indicador lateral sutil */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100 group-hover:bg-secondary transition-colors" />

                <div className="flex items-center gap-4 w-full">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors shrink-0">
                    <User size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-slate-800 truncate leading-tight uppercase tracking-tight">
                      {contact.firstName} {contact.lastName}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5 text-slate-500">
                      <Briefcase size={10} className="shrink-0" />
                      <span className="text-[9px] font-bold uppercase truncate tracking-tighter">
                        {contact.position}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-secondary">
                        <Phone size={11} />
                        <span className="text-[11px] font-black">
                          {contact.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Mail size={11} />
                        <span className="text-[10px] truncate max-w-[100px]">
                          email@acme.com
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 3. BOTÓN VER MÁS: Solo si hay más de 3 */}
          {contacts.length > 3 && (
            <div className="mt-6 flex justify-center">
              <Link
                href={`/client/${clientId}/contacts`}
                className="group flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black text-primary hover:border-secondary hover:text-secondary transition-all shadow-sm uppercase tracking-[0.2em]"
              >
                Ver todos los contactos ({contacts.length})
                <ChevronRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-lg py-12 flex flex-col items-center justify-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-4">
            No existen contactos registrados en esta cuenta
          </p>
        </div>
      )}
    </div>
  );
}
