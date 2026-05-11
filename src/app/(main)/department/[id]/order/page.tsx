"use client";

import { DataTable } from "@/components";
import { purchaseOrderColumns } from "@/components/orders/table/PurchaseOrderColumns";
import { PurchaseOrderFiltersTable } from "@/components/orders/table/PurchaseOrderFiltersTable";
import { usePurchaseOrderFilters } from "@/hooks";
import { usePurchaseOrders } from "@/hooks/order/usePurchaseOrders";
import { useAuthStore } from "@/store";
import { use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}
export default function PurchaseOrdersPage({ params }: Props) {
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

  const { data, isLoading } = usePurchaseOrders(filters, {
    enabled: !!userId,
  });

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-primary uppercase tracking-tighter">
            Órdenes de <span className="text-emerald-500">Compra</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Registro y seguimiento de documentos aprobados
          </p>
        </div>
      </header>

      <DataTable
        columns={purchaseOrderColumns}
        data={data?.items || []}
        total={data?.total || 0}
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
