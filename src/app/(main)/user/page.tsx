"use client";

import { Users } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { DataTable } from "@/components/shared/data-table/DataTable";
import { columns } from "@/components/user/table/columns";
import { useUsers } from "@/hooks/user/useUsers";
import { useUserFilters } from "@/hooks/user/useUserFilters";
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
      {/* Header */}
      <PageHeader
        title="Usuarios"
        subtitle="Gestión de Personal"
        icon={Users}
        themeColor="corporate"
        count={total}
        countLabel="usuarios"
        action={<RegisterModal />}
      />

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
