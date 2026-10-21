"use client";

import { DataTable, deliveryColumns } from "@/components";
import PageHeader from "@/components/common/PageHeader";
import { PurchaseOrderFiltersTable } from "@/components/orders/table/PurchaseOrderFiltersTable";
import { useDelivery, usePurchaseOrderFilters } from "@/hooks";
import { useOwnerFilter } from "@/hooks/auth/useOwnerFilter";
import { Truck } from "lucide-react";
import { use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}
export default function DeliveryPage({ params }: Props) {
  const departmentId = use(params).id;
  // const departmentId = Number(resolvedParams);
  // Empleado: sin userId (el backend aplica su alcance); admin: el suyo
  const { ownerId, isReady } = useOwnerFilter();

  const {
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    filters,
    handleReset,
    handleFilterChange,
  } = usePurchaseOrderFilters(+departmentId, ownerId);

  const { deliverys, total, isLoading } = useDelivery(filters, {
    enabled: isReady,
  });

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title={"Entregas"}
        subtitle="Registro y seguimiento de entregas realizadas"
        icon={Truck}
        themeColor="indigo"
        count={total}
        countLabel="entregas"
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
