'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/shared/data-table/DataTable';
import { columns } from '@/components/user/columns';
import { useUsers } from '@/hooks/useUsers';
import type { UserFilters } from '@/services/user.service';
import { Users } from 'lucide-react';
import { DataTableToolbar, RegisterModal } from '@/components';

export default function UserPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  // Estado local para filtros (SIN paginación)
  const [filters, setFilters] = useState<UserFilters>({
    name: '',
    role: '',
  });


  // Búsqueda con debounce para evitar peticiones excesivas
  const [searchInput, setSearchInput] = useState('');
  
  // Debounce del search (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        name: searchInput,
      }));
      setCurrentPage(1); // Importante: Resetear página al buscar
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Hook de usuarios con filtros dinámicos
  // CADA CAMBIO EN FILTERS HACE UNA NUEVA PETICIÓN HTTP AL BACKEND
  const { users, total, isLoading, isError, error} = useUsers({
    ...filters,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  // Manejadores de filtros
  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

  const handleRoleFilter = (role: string) => {
    setFilters((prev) => ({
      ...prev,
      role: role,
    }));
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setFilters({
      name: '',
      role: '',
    });
  };


  if (isError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <h2 className="font-semibold mb-2">Error al cargar usuarios</h2>
          <p className="text-sm">{error?.message || 'Ocurrió un error inesperado'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-800 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Gestión de Usuarios
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Administra los usuarios del sistema
                {total > 0 && (
                  <span className="ml-2 text-gray-800 font-medium">
                    ({total} {total === 1 ? 'usuario' : 'usuarios'})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

      
        {/* Botón que abre el formulario */}
        <RegisterModal key="register-modal-component" />
      </div>

      <DataTable
        columns={columns}
        data={users || []}
        total={total || 0}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
        showPagination={true}
        // PASAMOS LOS FILTROS AQUÍ
        filters={
          <DataTableToolbar 
            onSearch={handleSearch}
            onRoleFilter={handleRoleFilter}
            onResetFilters={handleResetFilters}
            searchValue={searchInput}
            roleValue={filters.role}
            hasFilters={searchInput !== '' || filters.role !== ''}
      />
  }
/>
    </div>
  );
}
