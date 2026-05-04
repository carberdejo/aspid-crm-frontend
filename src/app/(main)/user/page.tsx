"use client";

import { Users } from "lucide-react";
import { DataTable } from "@/components/shared/data-table/DataTable";
import { columns } from "@/components/user/table/columns";
import { useUsers } from "@/hooks/useUsers";
import { useUserFilters } from "@/hooks/useUserFilters";
import { DataTableToolbar, RegisterModal } from "@/components";

export default function UserPage() {
  const pageSize = 10;

  const {
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    handleReset,
    hasFilters,
  } = useUserFilters();

  const { users, total, isLoading, isError, error } = useUsers({
    ...filters,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  if (isError)
    return (
      <div className="p-8 text-red-600 font-bold">Error: {error?.message}</div>
    );

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Header Minimalista */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tighter uppercase leading-none">
              Usuarios
            </h1>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">
              Gestión de Personal ({total})
            </p>
          </div>
        </div>
        <RegisterModal />
      </div>

      <DataTable
        columns={columns}
        data={users || []}
        total={total || 0}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
        filters={
          <DataTableToolbar
            searchValue={searchTerm}
            onSearch={setSearchTerm}
            deptValue={filters.departmentId}
            onDeptChange={(val) => handleFilterChange("departmentId", val)}
            activeValue={filters.isActive}
            onActiveChange={(val) => handleFilterChange("isActive", val)}
            onReset={handleReset}
            hasFilters={hasFilters}
          />
        }
      />
    </div>
  );
}
