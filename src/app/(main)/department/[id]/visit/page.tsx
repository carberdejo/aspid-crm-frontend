'use client';

import { use, useState } from 'react';
import { useVisits } from '@/hooks/useVisits';
import { VisitFilter } from '@/interfaces/visit.interface';
import { DataTable } from '@/components';
import { visitColumns } from '@/components/visit/table/VisitColumns';
import { VisitRowDetails } from '@/components/visit/table/VisitRowDetails';


interface VisitasPageProps {
  params: Promise<{ id: string }>; // 2. En Next 15 esto es una Promesa
}

export default function VisitasPage({ params }: VisitasPageProps) {
  const resolvedParams = use(params);
  const departmentId = Number(resolvedParams.id);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<VisitFilter>({
    departmentId: departmentId,
    offset: (page - 1) * 10,
    limit: 10
  });

  const { visits, total, isLoading } = useVisits(filters);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters(prev => ({ ...prev, offset: (newPage - 1) * 10 }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-primary uppercase tracking-tighter">
            Listado de <span className="text-secondary">Visitas</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
            Gestión técnica y comercial del departamento
          </p>
        </div>
      </div>

      <DataTable
        columns={visitColumns}
        data={visits}
        total={total}
        isLoading={isLoading}
        currentPage={page}
        onPageChange={handlePageChange}
        // Pasamos el sub-componente para ver los detalles
        renderSubComponent={VisitRowDetails}
        // Aquí podrías pasar un Toolbar en el futuro
        filters={<div className="text-[10px] font-bold text-slate-400">FILTROS PENDIENTES...</div>}
      />
    </div>
  );
}