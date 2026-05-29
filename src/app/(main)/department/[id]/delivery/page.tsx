"use client";

import { DataTable, deliveryColumns } from "@/components";
import PageHeader from "@/components/common/PageHeader";
import { PurchaseOrderFiltersTable } from "@/components/orders/table/PurchaseOrderFiltersTable";
import { useDelivery, usePurchaseOrderFilters } from "@/hooks";
import { useAuthStore } from "@/store";
import { use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}
export default function DeliveryPage({ params }: Props) {
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

  const { deliverys, total, isLoading } = useDelivery();
  //   filters, {
  //   enabled: !!userId,
  // }

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title={"Entregas"}
        subtitle="Registro y seguimiento de entregas realizadas"
      />

      <DataTable
        columns={deliveryColumns}
        data={deliverys}
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
