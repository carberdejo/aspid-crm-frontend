"use client";

import { Building2, FileSpreadsheet } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { useClients } from "@/hooks";
import { useClientFilters } from "@/hooks/client/useClientFilters";
import { ClientToolbar, DataTable } from "@/components";
import { columns } from "../../../components/client/table/columnsClient";
import { RegisterClientModal } from "@/components/client/form/RegisterClientModal";
import { ContactSheet } from "@/components/client/table/ContactSheet";
import { useState } from "react";
import { ImportClientsDialog } from "@/components/client/ImportClientsDialog";
import { StandardButton } from "@/components/common/StandardButton"; // Asegúrate de ajustar la ruta
import { useAuthStore } from "@/store";
import { UserRole } from "@/interfaces";

export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const pageSize = 10;

  // Simulación de rol (debes extraer esto de tu auth store / context)
  // const userRole2 = "ADMIN";
  const userRole = useAuthStore((state) => state.user?.role) || "USER"; // Ajusta según tu store de autenticación

  const {
    page,
    setPage,
    filters,
    searchTerm,
    setSearchTerm,
    handleReset,
    hasFilters,
  } = useClientFilters();
  console.log({ filters });

  const { clients, total, isLoading, isError, error } = useClients(filters);

  if (isError) return <ErrorDisplay message={error?.message} />;

  const openContactSheet = (client: any) => {
    setSelectedClient({ id: client.id, name: client.commercialName });
    setIsSheetOpen(true);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Empresas"
        subtitle="Gestión de Cartera"
        icon={Building2}
        iconColor="secondary"
        count={total}
        countLabel="empresas"
        action={
          // Agrupamos los botones en un contenedor flex
          <div className="flex items-center gap-3">
            {userRole === UserRole.ADMIN && (
              <>
                <StandardButton
                  icon={FileSpreadsheet}
                  label="Importar Excel"
                  // Sobrescribimos el color por defecto al verde corporativo
                  colorClass="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => setIsImportModalOpen(true)}
                />

                {/* Asumimos que dentro de este componente actualizarás el trigger al nuevo StandardButton */}
                <RegisterClientModal />
              </>
            )}
          </div>
        }
      />

      {/* Los Modales deben ir flotando fuera de la estructura visual del Header */}
      <ImportClientsDialog
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
      />

      <DataTable
        columns={columns}
        data={clients}
        total={total}
        currentPage={page}
        onPageChange={setPage}
        isLoading={isLoading}
        meta={{ openContactSheet }}
        filters={
          <ClientToolbar
            searchValue={searchTerm}
            onSearch={setSearchTerm}
            onReset={handleReset}
            hasFilters={hasFilters}
          />
        }
      />

      <ContactSheet
        clientId={selectedClient?.id || null}
        clientName={selectedClient?.name || ""}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
}

function ErrorDisplay({ message }: { message?: string }) {
  return (
    <div className="p-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 font-bold text-sm">
        Error al sincronizar clientes: {message}
      </div>
    </div>
  );
}
