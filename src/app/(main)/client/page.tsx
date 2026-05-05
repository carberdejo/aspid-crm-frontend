"use client";

import { Building2 } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { useClients } from "@/hooks";
import { useClientFilters } from "@/hooks/useClientFilters"; // El nuevo hook
import { ClientToolbar, ContactList, DataTable } from "@/components";
import { columns } from "../../../components/client/table/columnsClient";
import { RegisterClientModal } from "@/components/client/form/RegisterClientModal";

export default function ClientsPage() {
  const pageSize = 10;

  // 1. Extraemos toda la lógica del Hook personalizado
  const {
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    debouncedTerm,
    handleReset,
    hasFilters,
  } = useClientFilters();

  // 2. Petición de datos (Usando el debouncedTerm)
  const { clients, total, isLoading, isError, error } = useClients({
    term: debouncedTerm, // Enviamos un solo término al backend
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
  });

  if (isError) return <ErrorDisplay message={error?.message} />;

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Empresas"
        subtitle="Gestión de Cartera"
        icon={Building2}
        iconColor="secondary"
        count={total}
        countLabel="empresas"
        action={<RegisterClientModal />}
      />

      <DataTable
        columns={columns}
        data={clients}
        total={total}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
        renderSubComponent={({ row }) => (
          <ContactList clientId={row.original.id} />
        )}
        filters={
          <ClientToolbar
            searchValue={searchTerm}
            onSearch={setSearchTerm}
            onReset={handleReset}
            hasFilters={hasFilters}
          />
        }
      />
    </div>
  );
}

// Sub-componentes pequeños para mantener el JSX limpio
function ErrorDisplay({ message }: { message?: string }) {
  return (
    <div className="p-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 font-bold text-sm">
        Error al sincronizar clientes: {message}
      </div>
    </div>
  );
}
