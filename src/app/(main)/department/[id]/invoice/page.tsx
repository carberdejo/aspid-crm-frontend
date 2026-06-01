"use client";

import { DataTable, invoiceColumns } from "@/components";
import PageHeader from "@/components/common/PageHeader";
import { PurchaseOrderFiltersTable } from "@/components/orders/table/PurchaseOrderFiltersTable";
import { useInvoices, usePurchaseOrderFilters } from "@/hooks";
import { useAuthStore } from "@/store";
import { FileText, Receipt } from "lucide-react";
import { use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}
export default function InvoicePage({ params }: Props) {
  const departmentId = use(params).id;
  // const departmentId = Number(resolvedParams);
  const userId = useAuthStore((state) => state.user?.sub);

  const {
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    filters,
    handleReset,
    handleFilterChange,
  } = usePurchaseOrderFilters(+departmentId, userId);

  const { invoices, total, isLoading } = useInvoices(filters, {
    enabled: !!userId,
  });

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Facturas"
        subtitle="Gestión de Facturas y Documentos Fiscales"
        icon={Receipt}
        themeColor="rose"
        count={total}
        countLabel="facturas"
      />

      <DataTable
        columns={invoiceColumns}
        data={invoices}
        total={total}
        currentPage={page}
        onPageChange={setPage}
        isLoading={isLoading}
        filters={
          <PurchaseOrderFiltersTable
            filters={filters}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm} // Para el buscador global
            onFilterChange={handleFilterChange} // Para el select de orden (ASC/DESC)
            onClear={handleReset}
          />
        }
      />
    </div>
  );
}
