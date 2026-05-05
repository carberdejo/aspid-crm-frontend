'use client';

import { use, useState } from 'react';
import { MapPin } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
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
      <PageHeader
        title="Visitas"
        subtitle="Gestión técnica y comercial del departamento"
        icon={MapPin}
        iconColor="secondary"
        count={total}
        countLabel="visitas"
      />

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