'use client';

import { useState, useEffect } from 'react';

import { Building2 } from 'lucide-react';
import { useHeaderStore } from '@/store';
import { useClients } from '@/hooks';
import { ClientToolbar, ContactList, DataTable } from '@/components';
import { columns } from '../../../components/client/columnsClient';
import { RegisterClientModal } from '@/components/client/RegisterClientModal';

export default function ClientsPage() {
  const setHeaderTitle = useHeaderStore((state) => state.setHeaderTitle);
  
  // 1. Estados de Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 2. Estados de Filtros Reales (Los que disparan la petición)
  const [filters, setFilters] = useState({
    name: '',
    ruc: '',
  });

  // 3. Estados de Inputs (Lo que el usuario escribe en tiempo real)
  const [searchInput, setSearchInput] = useState('');
  const [rucInput, setRucInput] = useState('');

  // 4. Lógica de DEBOUNCE (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({
        name: searchInput,
        ruc: rucInput,
      });
      setCurrentPage(1); // Resetear a pág 1 al filtrar
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, rucInput]);

  // 5. Sincronizar Header Global
  useEffect(() => {
    setHeaderTitle('DIRECTORIO DE CLIENTES');
  }, [setHeaderTitle]);

  // 6. Hook de Clientes (Consume los filters ya debounced)
  const { clients, total, isLoading, isError, error } = useClients({
    ...filters,
    offset: (currentPage - 1) * pageSize,
    limit: pageSize,
  });

  // Handlers para el Toolbar
  const handleReset = () => {
    setSearchInput('');
    setRucInput('');
    setFilters({ name: '', ruc: '' });
  };

  if (isError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 font-bold text-sm">
          Error al sincronizar clientes: {error?.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-in fade-in duration-500">
      
      {/* Header Local */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
          <Building2 size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tighter uppercase leading-none">
            Empresas
          </h1>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">
            Gestión de Cartera de Clientes ({total})
          </p>
        </div>
      </div>

      <RegisterClientModal />
      <DataTable
        columns={columns}
        data={clients} // El Hook ya extrae query.data.items
        total={total}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
        // INTEGRACIÓN DE FILAS EXPANDIBLES (Contactos)
        renderSubComponent={({ row }) => (
          <ContactList clientId={row.original.id} />
        )}
        // TOOLBAR CON LOS INPUTS LOCALES
        filters={
          <ClientToolbar 
            searchValue={searchInput}
            rucValue={rucInput}
            onSearch={setSearchInput}
            onRucSearch={setRucInput}
            onReset={handleReset}
            hasFilters={searchInput !== '' || rucInput !== ''}
            onOpenCreate={() => console.log('Abrir Modal')}
          />
        }
      />
    </div>
  );
}