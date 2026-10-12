"use client";

import { DataTable } from "@/components";
import PageHeader from "@/components/common/PageHeader";
import { purchaseOrderColumns } from "@/components/orders/table/PurchaseOrderColumns";
import { PurchaseOrderFiltersTable } from "@/components/orders/table/PurchaseOrderFiltersTable";
import { usePurchaseOrderFilters } from "@/hooks";
import { usePurchaseOrders } from "@/hooks/order/usePurchaseOrders";
import { useOwnerFilter } from "@/hooks/auth/useOwnerFilter";
import { ShoppingCart } from "lucide-react";
import { use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}
export default function PurchaseOrdersPage({ params }: Props) {
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

  const { orders, total, isLoading } = usePurchaseOrders(filters, {
    enabled: isReady,
  });

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Órdenes de Compra"
        subtitle="Gestión de órdenes generadas a partir de cotizaciones aprobadas"
        icon={ShoppingCart}
        themeColor="emerald"
        count={total}
        countLabel="órdenes"
      />

      <DataTable
        columns={purchaseOrderColumns}
        data={orders}
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
