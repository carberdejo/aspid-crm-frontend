"use client";

import {
  User,
  Mail,
  Phone,
  Globe,
  Shield,
  Monitor,
  Clock,
  MapPin,
  Loader2,
  LogOut,
  Building2,
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { useTerminateSession, useTerminateAllSessions } from "@/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/auth/useProfile";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useAuthStore } from "@/store";
import { toast } from "sonner";

export default function ProfilePage() {
  const { logout } = useAuthStore();
  const params = useParams();
  const userId = params.id as string;
  const router = useRouter();

  const { data, isLoading } = useProfile(userId);
  const { mutate: terminateOne, isPending: isTerminatingOne } =
    useTerminateSession();
  const { mutate: terminateAll, isPending: isTerminatingAll } =
    useTerminateAllSessions();

  const profile = data;
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    type: "ONE" | "ALL" | null;
    targetId?: string;
  }>({ isOpen: false, type: null });

  const handleOpenConfirm = (type: "ONE" | "ALL", id?: string) => {
    // console.log("Intentando abrir modal para:", type, id); // Log de control
    setConfirmConfig({
      isOpen: true,
      type: type,
      targetId: id,
    });
  };

  const handleConfirmAction = () => {
    if (confirmConfig.type === "ONE" && confirmConfig.targetId) {
      terminateOne(
        { sessionId: confirmConfig.targetId },
        {
          onSuccess: () =>
            setConfirmConfig((prev) => ({ ...prev, isOpen: false })),
        },
      );
    } else if (confirmConfig.type === "ALL" && confirmConfig.targetId) {
      console.log("Data de all:", confirmConfig.targetId);
      terminateAll(
        { sessionId: confirmConfig.targetId, allDevices: true },
        {
          onSuccess: () => {
            setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
            logout(); // Cerrar sesión actual después de cerrar las otras sesiones
            router.push("/login");
            toast.success("Todas las sesiones han sido finalizadas");
          },
        },
      );
    }
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-secondary" size={40} />
      </div>
    );
  }

  console.log(
    "¿Modal abierto?:",
    confirmConfig.isOpen,
    "Tipo:",
    confirmConfig.type,
  );
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* --- HEADER DE PERFIL --- */}
      <PageHeader
        title={`${profile?.firstName} ${profile?.lastName}`}
        subtitle={profile?.role}
        icon={User}
        themeColor="corporate"
        count={profile?.codUser ? 1 : 0}
        countLabel={`COD: ${profile?.codUser}`}
        // variant="compact"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- COLUMNA IZQUIERDA: DATOS PERSONALES --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
                <div className="w-1 h-3 bg-secondary rounded-full" />
                Información Personal
              </h3>
              <div className="space-y-5">
                <InfoItem
                  icon={<Mail size={16} />}
                  label="Correo Electrónico"
                  value={profile?.email}
                />
                <InfoItem
                  icon={<Phone size={16} />}
                  label="Teléfono Directo"
                  value={profile?.phone}
                />
                <InfoItem
                  icon={<Globe size={16} />}
                  label="País / Región"
                  value={profile?.country}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                <Building2 size={12} />
                Departamentos
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile?.userDepartments.map((dep: any) => (
                  <Badge
                    key={dep.id}
                    variant="secondary"
                    className="bg-slate-100 text-slate-600 border-none text-[9px] font-black uppercase px-2.5"
                  >
                    {dep.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- COLUMNA DERECHA: SEGURIDAD Y SESIONES --- */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                  <Shield size={12} className="text-green-500" />
                  Sesiones Activas
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Gestiona los dispositivos que tienen acceso a tu cuenta.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={
                  isTerminatingAll || (profile?.sessions?.length || 0) <= 1
                }
                onClick={() => {
                  handleOpenConfirm(
                    "ALL",
                    profile?.sessions?.[profile.sessions.length - 1]?.id,
                  ); // Pasamos el ID de la sesión actual para que el backend sepa cuál mantener activa
                }}
                className="text-[10px] font-black uppercase tracking-widest border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all rounded-xl h-9"
              >
                {isTerminatingAll ? (
                  <Loader2 className="animate-spin mr-2" size={12} />
                ) : (
                  <LogOut size={12} className="mr-2" />
                )}
                Cerrar todas las sesiones
              </Button>
            </div>

            <div className="space-y-3">
              {profile?.sessions.map((session: any) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/50 border border-slate-100 group hover:border-secondary/30 hover:bg-white transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-5">
                    <div className="p-3 bg-white rounded-xl text-slate-400 group-hover:text-secondary shadow-sm transition-colors border border-slate-100">
                      <Monitor size={22} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-black text-slate-700 uppercase tracking-tight">
                          {session.deviceInfo}
                        </p>
                        {/* Ejemplo de lógica: podrías comparar el ID de sesión con el de tu token actual */}
                        <span className="text-[8px] font-black bg-green-100 text-green-600 px-1.5 py-0.5 rounded uppercase">
                          Activa ahora
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        <span className="flex items-center gap-1">
                          <MapPin size={10} className="text-slate-300" />{" "}
                          {session.ipAddress}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} className="text-slate-300" />{" "}
                          {new Date(session.lastActive).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={isTerminatingOne}
                    onClick={() => {
                      console.log({ session });
                      handleOpenConfirm("ONE", session.id);
                    }}
                    className="h-10 w-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0"
                    title="Cerrar esta sesión"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Modal de confimacion */}
      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        onOpenChange={(open) =>
          setConfirmConfig((prev) => ({ ...prev, isOpen: open }))
        }
        title={
          confirmConfig.type === "ALL"
            ? "Cerrar todas las sesiones"
            : "Cerrar sesión"
        }
        description={
          confirmConfig.type === "ALL"
            ? "¿Estás seguro de que deseas cerrar todas tus sesiones activas en otros dispositivos? Esta acción no se puede deshacer."
            : "¿Deseas finalizar esta sesión específica? El dispositivo perderá el acceso inmediato a la plataforma."
        }
        onConfirm={handleConfirmAction}
        isLoading={isTerminatingOne || isTerminatingAll}
        variant="destructive"
      />
    </div>
  );
}

// Componente auxiliar para las filas de información
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="p-2.5 bg-slate-50 rounded-xl text-secondary group-hover:bg-secondary/10 transition-colors border border-slate-100">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-700">
          {value || "No registrado"}
        </p>
      </div>
    </div>
  );
}
